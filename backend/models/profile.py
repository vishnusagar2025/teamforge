from database.db import db
from datetime import datetime

class Profile(db.Model):
    __tablename__ = "profiles"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    bio = db.Column(db.Text)
    github_url = db.Column(db.String(200))
    achievements = db.Column(db.Text)
    hackathons_participated = db.Column(db.Integer, default=0)
    projects_completed = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "user_id": self.user_id, "bio": self.bio,
            "github_url": self.github_url, "achievements": self.achievements,
            "hackathons_participated": self.hackathons_participated,
            "projects_completed": self.projects_completed,
        }
