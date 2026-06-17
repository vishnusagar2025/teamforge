from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.user import User
from models.profile import Profile
from models.skill import Skill
from models.interest import Interest

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_profile():
    user = User.query.get_or_404(int(get_jwt_identity()))
    return jsonify(user.to_dict()), 200

@profile_bp.route("/", methods=["PUT"])
@jwt_required()
def update_profile():
    user = User.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json()
    for field in ["full_name", "phone", "institution", "department", "year_of_study",
                  "linkedin_url", "portfolio_url", "commitment_level", "is_looking_for_team"]:
        if field in data:
            setattr(user, field, data[field])
    if "bio" in data:
        if not user.profile:
            user.profile = Profile(user_id=user.id)
        user.profile.bio = data["bio"]
    if "github_url" in data and user.profile:
        user.profile.github_url = data["github_url"]
    db.session.commit()
    return jsonify(user.to_dict()), 200

@profile_bp.route("/skills", methods=["POST"])
@jwt_required()
def add_skill():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    skill = Skill(user_id=user_id, name=data["name"],
                  level=data.get("level", "intermediate"), category=data.get("category", "general"))
    db.session.add(skill)
    db.session.commit()
    return jsonify(skill.to_dict()), 201

@profile_bp.route("/skills/<int:skill_id>", methods=["DELETE"])
@jwt_required()
def delete_skill(skill_id):
    user_id = int(get_jwt_identity())
    skill = Skill.query.filter_by(id=skill_id, user_id=user_id).first_or_404()
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"message": "Skill removed"}), 200

@profile_bp.route("/interests", methods=["POST"])
@jwt_required()
def add_interest():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    interest = Interest(user_id=user_id, category=data["category"], is_primary=data.get("is_primary", False))
    db.session.add(interest)
    db.session.commit()
    return jsonify(interest.to_dict()), 201

@profile_bp.route("/interests/<int:interest_id>", methods=["DELETE"])
@jwt_required()
def delete_interest(interest_id):
    user_id = int(get_jwt_identity())
    interest = Interest.query.filter_by(id=interest_id, user_id=user_id).first_or_404()
    db.session.delete(interest)
    db.session.commit()
    return jsonify({"message": "Interest removed"}), 200

@profile_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200
