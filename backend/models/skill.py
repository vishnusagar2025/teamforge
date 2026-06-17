from database.db import db

class Skill(db.Model):
    __tablename__ = "skills"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    level = db.Column(db.String(20), default="intermediate")
    category = db.Column(db.String(50))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "level": self.level, "category": self.category}
