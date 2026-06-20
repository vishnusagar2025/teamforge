from database.db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    roll_number = db.Column(db.String(30), unique=True, nullable=True)
    institution = db.Column(db.String(150))
    department = db.Column(db.String(100))
    year_of_study = db.Column(db.Integer)
    linkedin_url = db.Column(db.String(200))
    portfolio_url = db.Column(db.String(200))
    resume_url = db.Column(db.String(200))
    avatar_url = db.Column(db.String(200), default="/default-avatar.png")
    avatar_config = db.Column(db.Text, nullable=True)  # JSON: custom avatar config
    is_looking_for_team = db.Column(db.Boolean, default=True)
    commitment_level = db.Column(db.String(20), default="serious")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    profile = db.relationship("Profile", backref="user", uselist=False, cascade="all, delete-orphan")
    skills = db.relationship("Skill", backref="user", cascade="all, delete-orphan")
    interests = db.relationship("Interest", backref="user", cascade="all, delete-orphan")
    notifications = db.relationship("Notification", backref="user", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def dummy_check():
        """Run a fake password check to prevent timing attacks on login."""
        check_password_hash("pbkdf2:sha256:dummy", "dummy")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone": self.phone,
            "full_name": self.full_name,
            "roll_number": self.roll_number,
            "institution": self.institution,
            "department": self.department,
            "year_of_study": self.year_of_study,
            "linkedin_url": self.linkedin_url,
            "portfolio_url": self.portfolio_url,
            "resume_url": self.resume_url,
            "avatar_url": self.avatar_url,
            "avatar_config": self.avatar_config,
            "is_looking_for_team": self.is_looking_for_team,
            "commitment_level": self.commitment_level,
            "skills": [s.to_dict() for s in self.skills],
            "interests": [i.to_dict() for i in self.interests],
            "bio": self.profile.bio if self.profile else "",
            "github_url": self.profile.github_url if self.profile else "",
            "created_at": self.created_at.isoformat(),
        }

    def to_summary(self):
        """Lightweight version for nested use (team members, search results)."""
        return {
            "id": self.id, "full_name": self.full_name, "department": self.department,
            "year_of_study": self.year_of_study, "institution": self.institution,
            "avatar_url": self.avatar_url, "avatar_config": self.avatar_config,
            "commitment_level": self.commitment_level,
        }
