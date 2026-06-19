from database.db import db
from datetime import datetime
import json

team_members = db.Table("team_members",
    db.Column("team_id", db.Integer, db.ForeignKey("teams.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("users.id")),
    db.Column("role", db.String(50), default="member"),
    db.Column("joined_at", db.DateTime, default=datetime.utcnow),
)

class Team(db.Model):
    __tablename__ = "teams"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    leader_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    institution = db.Column(db.String(150))
    max_members = db.Column(db.Integer, default=4)
    is_open = db.Column(db.Boolean, default=True)
    hackathon_name = db.Column(db.String(200))
    project_domain = db.Column(db.String(100))
    required_skills = db.Column(db.Text)
    commitment_level = db.Column(db.String(20), default="serious")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    leader = db.relationship("User", foreign_keys=[leader_id])
    members = db.relationship("User", secondary=team_members, backref="teams")

    def member_count(self):
        return len(self.members)

    def to_dict(self):
        try:
            skills = json.loads(self.required_skills) if self.required_skills else []
        except (ValueError, TypeError):
            skills = []
        return {
            "id": self.id, "name": self.name, "description": self.description,
            "leader": self.leader.to_summary() if self.leader else None,
            "institution": self.institution, "max_members": self.max_members,
            "current_members": self.member_count(), "is_open": self.is_open,
            "hackathon_name": self.hackathon_name, "project_domain": self.project_domain,
            "required_skills": skills, "commitment_level": self.commitment_level,
            "members": [m.to_summary() for m in self.members],
            "created_at": self.created_at.isoformat(),
        }
