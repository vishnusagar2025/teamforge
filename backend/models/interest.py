from database.db import db

class Interest(db.Model):
    __tablename__ = "interests"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {"id": self.id, "category": self.category, "is_primary": self.is_primary}
