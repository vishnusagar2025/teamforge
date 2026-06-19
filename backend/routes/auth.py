from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database.db import db
from models.user import User
from models.profile import Profile
from models.interest import Interest
from models.skill import Skill

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["email", "phone", "password", "full_name", "institution", "department", "year_of_study"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409
    if User.query.filter_by(phone=data["phone"]).first():
        return jsonify({"error": "Phone already registered"}), 409
    roll = data.get("roll_number") or None
    if roll and User.query.filter_by(roll_number=roll).first():
        return jsonify({"error": "Roll number already registered"}), 409
    user = User(
        email=data["email"], phone=data["phone"], full_name=data["full_name"],
        roll_number=roll, institution=data["institution"],
        department=data["department"], year_of_study=int(data["year_of_study"]),
        linkedin_url=data.get("linkedin_url"), portfolio_url=data.get("portfolio_url"),
        commitment_level=data.get("commitment_level", "serious"),
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.flush()
    profile = Profile(user_id=user.id, bio=data.get("bio", ""))
    db.session.add(profile)
    for cat in (data.get("interests") or []):
        db.session.add(Interest(user_id=user.id, category=cat))
    for skill_name in (data.get("skills") or []):
        db.session.add(Skill(user_id=user.id, name=skill_name, level="intermediate"))
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200
