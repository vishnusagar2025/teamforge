from database.db import db
from datetime import datetime

class Review(db.Model):
    __tablename__ = "reviews"
    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"))
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    tags = db.Column(db.String(200))  # comma-separated: "reliable,communicative,skilled"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reviewer = db.relationship("User", foreign_keys=[reviewer_id])
    reviewee = db.relationship("User", foreign_keys=[reviewee_id])

    def to_dict(self):
        return {
            "id": self.id,
            "reviewer": self.reviewer.to_summary() if self.reviewer else None,
            "reviewee_id": self.reviewee_id,
            "team_id": self.team_id,
            "rating": self.rating,
            "comment": self.comment,
            "tags": self.tags.split(",") if self.tags else [],
            "created_at": self.created_at.isoformat(),
        }
