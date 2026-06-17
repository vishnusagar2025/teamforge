from database.db import db
from datetime import datetime

class Project(db.Model):
    __tablename__ = "projects"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"))
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    domain = db.Column(db.String(100))
    tech_stack = db.Column(db.Text)
    github_url = db.Column(db.String(200))
    demo_url = db.Column(db.String(200))
    status = db.Column(db.String(30), default="planning")
    is_looking_for_members = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    team = db.relationship("Team", backref="projects")
    creator = db.relationship("User", backref="created_projects")

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "description": self.description,
            "team_id": self.team_id, "creator": self.creator.full_name if self.creator else None,
            "domain": self.domain, "tech_stack": self.tech_stack,
            "github_url": self.github_url, "demo_url": self.demo_url,
            "status": self.status, "is_looking_for_members": self.is_looking_for_members,
            "created_at": self.created_at.isoformat(),
        }
