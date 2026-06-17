from database.db import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(150))
    message = db.Column(db.Text, nullable=False)
    notif_type = db.Column(db.String(30), default="info")
    is_read = db.Column(db.Boolean, default=False)
    reference_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id, "title": self.title, "message": self.message,
            "type": self.notif_type, "is_read": self.is_read,
            "reference_id": self.reference_id, "created_at": self.created_at.isoformat(),
        }
