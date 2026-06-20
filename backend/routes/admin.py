from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.user import User
from models.team import Team
from models.project import Project
from models.review import Review

admin_bp = Blueprint("admin", __name__)

ADMIN_EMAILS = {"admin@teamforge.com"}  # extend via env var in production

def _require_admin():
    uid = int(get_jwt_identity())
    user = User.query.get(uid)
    if not user or user.email not in ADMIN_EMAILS:
        return None, (jsonify({"error": "Forbidden"}), 403)
    return user, None

@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    _, err = _require_admin()
    if err:
        return err
    return jsonify({
        "users": User.query.count(),
        "teams": Team.query.count(),
        "open_teams": Team.query.filter_by(is_open=True).count(),
        "projects": Project.query.count(),
        "reviews": Review.query.count(),
        "looking_for_team": User.query.filter_by(is_looking_for_team=True).count(),
    }), 200

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    _, err = _require_admin()
    if err:
        return err
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))
    q = User.query.order_by(User.created_at.desc())
    paginated = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "users": [u.to_summary() for u in paginated.items],
        "total": paginated.total,
        "pages": paginated.pages,
        "page": page,
    }), 200

@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    _, err = _require_admin()
    if err:
        return err
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200
