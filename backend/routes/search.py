from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.team import Team
from ai.matching.compatibility import compute_compatibility

search_bp = Blueprint("search", __name__)

@search_bp.route("/users", methods=["GET"])
@jwt_required()
def search_users():
    current_user_id = int(get_jwt_identity())
    query = User.query.filter(User.id != current_user_id)
    if request.args.get("institution"):
        query = query.filter(User.institution.ilike(f"%{request.args.get('institution')}%"))
    if request.args.get("department"):
        query = query.filter(User.department.ilike(f"%{request.args.get('department')}%"))
    if request.args.get("year"):
        query = query.filter_by(year_of_study=int(request.args.get("year")))
    if request.args.get("commitment"):
        query = query.filter_by(commitment_level=request.args.get("commitment"))
    if request.args.get("looking_for_team") == "true":
        query = query.filter_by(is_looking_for_team=True)
    users = query.all()
    if request.args.get("interest"):
        interest = request.args.get("interest").lower()
        users = [u for u in users if any(interest in i.category.lower() for i in u.interests)]
    if request.args.get("skill"):
        skill = request.args.get("skill").lower()
        users = [u for u in users if any(skill in s.name.lower() for s in u.skills)]
    current_user = User.query.get(current_user_id)
    results = []
    for u in users:
        data = u.to_dict()
        data["compatibility_score"] = compute_compatibility(current_user, u)
        results.append(data)
    results.sort(key=lambda x: x["compatibility_score"], reverse=True)
    return jsonify(results), 200

@search_bp.route("/teams", methods=["GET"])
@jwt_required()
def search_teams():
    query = Team.query.filter_by(is_open=True)
    if request.args.get("domain"):
        query = query.filter(Team.project_domain.ilike(f"%{request.args.get('domain')}%"))
    if request.args.get("hackathon"):
        query = query.filter(Team.hackathon_name.ilike(f"%{request.args.get('hackathon')}%"))
    if request.args.get("institution"):
        query = query.filter(Team.institution.ilike(f"%{request.args.get('institution')}%"))
    return jsonify([t.to_dict() for t in query.order_by(Team.created_at.desc()).all()]), 200
