from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.user import User

user_bp = Blueprint("user", __name__)

@user_bp.route("/", methods=["GET"])
@jwt_required()
def get_users():
    return jsonify([u.to_dict() for u in User.query.filter_by(is_looking_for_team=True).all()]), 200

@user_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    return jsonify(User.query.get_or_404(user_id).to_dict()), 200

@user_bp.route("/toggle-availability", methods=["PUT"])
@jwt_required()
def toggle_availability():
    user = User.query.get_or_404(int(get_jwt_identity()))
    user.is_looking_for_team = not user.is_looking_for_team
    db.session.commit()
    return jsonify({"is_looking_for_team": user.is_looking_for_team}), 200
