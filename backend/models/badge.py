from database.db import db
from datetime import datetime

class Badge(db.Model):
    __tablename__ = "badges"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    icon = db.Column(db.String(10), default="🏆")
    description = db.Column(db.String(200))
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="badges")

    # Badge definitions — awarded automatically based on actions
    DEFINITIONS = {
        "first_team":    {"icon": "🚀", "name": "Team Player",    "desc": "Joined your first team"},
        "team_leader":   {"icon": "👑", "name": "Team Leader",    "desc": "Created a team"},
        "networker":     {"icon": "🤝", "name": "Networker",      "desc": "Connected with 5+ people"},
        "contributor":   {"icon": "💻", "name": "Contributor",    "desc": "Added your first project"},
        "skilled":       {"icon": "⚡", "name": "Skilled",        "desc": "Added 5+ skills"},
        "top_rated":     {"icon": "⭐", "name": "Top Rated",      "desc": "Received 5-star rating"},
        "hackathon_vet": {"icon": "🏆", "name": "Hackathon Vet",  "desc": "Participated in 3+ hackathons"},
    }

    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "icon": self.icon,
            "description": self.description, "earned_at": self.earned_at.isoformat(),
        }
