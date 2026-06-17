from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.project import Project
import json

project_bp = Blueprint("project", __name__)

@project_bp.route("/", methods=["GET"])
@jwt_required()
def get_projects():
    return jsonify([p.to_dict() for p in Project.query.order_by(Project.created_at.desc()).all()]), 200

@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    project = Project(
        title=data["title"], description=data.get("description"), creator_id=user_id,
        team_id=data.get("team_id"), domain=data.get("domain"),
        tech_stack=json.dumps(data.get("tech_stack", [])),
        github_url=data.get("github_url"), demo_url=data.get("demo_url"),
        status=data.get("status", "planning"),
        is_looking_for_members=data.get("is_looking_for_members", True),
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.to_dict()), 201

@project_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    return jsonify(Project.query.get_or_404(project_id).to_dict()), 200
