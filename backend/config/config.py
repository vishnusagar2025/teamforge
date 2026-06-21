import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "teamforge-secret-key-2024-xZ9#mQ7!")
    
    # Render gives postgres:// but SQLAlchemy needs postgresql://
    _db_url = os.environ.get("DATABASE_URL", "sqlite:///teamforge.db")
    SQLALCHEMY_DATABASE_URI = _db_url.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-teamforge-secret-2024-xZ9#mQ7!")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "../../public/uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
