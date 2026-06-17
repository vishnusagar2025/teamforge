from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config.config import Config
from database.db import db
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.team import team_bp
from routes.project import project_bp
from routes.search import search_bp
from routes.user import user_bp
from routes.notification import notification_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

CORS(app, origins="*", supports_credentials=False)    
db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(team_bp, url_prefix="/api/teams")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(search_bp, url_prefix="/api/search")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
