from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.review import Review
from models.badge import Badge
from models.user import User

review_bp = Blueprint("review", __name__)

@review_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_reviews(user_id):
    reviews = Review.query.filter_by(reviewee_id=user_id).order_by(Review.created_at.desc()).all()
    avg = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
    return jsonify({"reviews": [r.to_dict() for r in reviews], "average_rating": avg, "count": len(reviews)}), 200

@review_bp.route("/users/<int:user_id>", methods=["POST"])
@jwt_required()
def create_review(user_id):
    reviewer_id = int(get_jwt_identity())
    if reviewer_id == user_id:
        return jsonify({"error": "Cannot review yourself"}), 400
    existing = Review.query.filter_by(reviewer_id=reviewer_id, reviewee_id=user_id).first()
    if existing:
        return jsonify({"error": "Already reviewed this user"}), 409
    data = request.get_json()
    rating = int(data.get("rating", 0))
    if not 1 <= rating <= 5:
        return jsonify({"error": "Rating must be 1-5"}), 400
    tags = ",".join(data.get("tags", []))
    review = Review(reviewer_id=reviewer_id, reviewee_id=user_id,
                    team_id=data.get("team_id"), rating=rating,
                    comment=data.get("comment"), tags=tags)
    db.session.add(review)
    # Award top_rated badge if user hits a 5-star review
    if rating == 5:
        _award_badge(user_id, "top_rated")
    db.session.commit()
    return jsonify(review.to_dict()), 201

def _award_badge(user_id, badge_key):
    defn = Badge.DEFINITIONS.get(badge_key)
    if not defn:
        return
    exists = Badge.query.filter_by(user_id=user_id, name=defn["name"]).first()
    if not exists:
        db.session.add(Badge(user_id=user_id, name=defn["name"],
                             icon=defn["icon"], description=defn["desc"]))
