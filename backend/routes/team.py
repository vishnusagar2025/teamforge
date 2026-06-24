from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.team import Team
from models.user import User
from models.notification import Notification
import json

team_bp = Blueprint("team", __name__)

@team_bp.route("/", methods=["GET"])
@jwt_required()
def get_teams():
    query = Team.query.filter_by(is_open=True)
    if request.args.get("institution"):
        query = query.filter(Team.institution.ilike(f"%{request.args.get('institution')}%"))
    if request.args.get("domain"):
        query = query.filter(Team.project_domain.ilike(f"%{request.args.get('domain')}%"))
    return jsonify([t.to_dict() for t in query.order_by(Team.created_at.desc()).all()]), 200

@team_bp.route("/", methods=["POST"])
@jwt_required()
def create_team():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    team = Team(
        name=data["name"], description=data.get("description"), leader_id=user_id,
        institution=data.get("institution"), max_members=data.get("max_members", 4),
        hackathon_name=data.get("hackathon_name"), project_domain=data.get("project_domain"),
        required_skills=json.dumps(data.get("required_skills", [])),
        commitment_level=data.get("commitment_level", "serious"),
    )
    db.session.add(team)
    db.session.flush()
    team.members.append(User.query.get(user_id))
    db.session.commit()
    return jsonify(team.to_dict()), 201

@team_bp.route("/<int:team_id>", methods=["GET"])
@jwt_required()
def get_team(team_id):
    return jsonify(Team.query.get_or_404(team_id).to_dict()), 200

@team_bp.route("/<int:team_id>/join", methods=["POST"])
@jwt_required()
def request_to_join(team_id):
    user_id = int(get_jwt_identity())
    team = Team.query.get_or_404(team_id)
    user = User.query.get(user_id)
    if user in team.members:
        return jsonify({"error": "Already a member"}), 400
    if team.member_count() >= team.max_members:
        return jsonify({"error": "Team is full"}), 400
    notif = Notification(
        user_id=team.leader_id, title="New Join Request",
        message=f"{user.full_name} wants to join your team '{team.name}'",
        notif_type="join_request", reference_id=team_id,
        sender_id=user_id,
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify({"message": "Request sent to team leader"}), 200

@team_bp.route("/<int:team_id>/accept/<int:member_id>", methods=["POST"])
@jwt_required()
def accept_member(team_id, member_id):
    user_id = int(get_jwt_identity())
    team = Team.query.get_or_404(team_id)
    if team.leader_id != user_id:
        return jsonify({"error": "Only leader can accept members"}), 403
    new_member = User.query.get_or_404(member_id)
    team.members.append(new_member)
    notif = Notification(
        user_id=member_id, title="You joined a team!",
        message=f"You have been added to team '{team.name}'!",
        notif_type="team_invite", reference_id=team_id,
    )
    db.session.add(notif)
    db.session.commit()
    return jsonify(team.to_dict()), 200
