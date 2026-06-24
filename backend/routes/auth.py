from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database.db import db
from models.user import User
from models.profile import Profile
from models.interest import Interest
from models.skill import Skill
import re
from datetime import datetime, timedelta
from collections import defaultdict

auth_bp = Blueprint("auth", __name__)

# ── Simple in-memory rate limiter ─────────────────────────────────────────────
_login_attempts = defaultdict(list)  # ip -> [timestamp, ...]
MAX_ATTEMPTS = 10
WINDOW_SECONDS = 300  # 5 minutes

def _is_rate_limited(ip):
    now = datetime.utcnow()
    window = now - timedelta(seconds=WINDOW_SECONDS)
    _login_attempts[ip] = [t for t in _login_attempts[ip] if t > window]
    if len(_login_attempts[ip]) >= MAX_ATTEMPTS:
        return True
    _login_attempts[ip].append(now)
    return False

# ── Validators ────────────────────────────────────────────────────────────────
EMAIL_RE  = re.compile(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')
PHONE_RE  = re.compile(r'^\+?[0-9]{10,15}$')

def validate_email(email):
    return bool(EMAIL_RE.match(str(email).strip()))

def validate_phone(phone):
    digits = re.sub(r'[\s\-()]', '', str(phone))
    return bool(PHONE_RE.match(digits))

def validate_password(password):
    """Returns (ok, message)"""
    p = str(password)
    if len(p) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Za-z]', p):
        return False, "Password must contain at least one letter"
    if not re.search(r'[0-9]', p):
        return False, "Password must contain at least one number"
    if len(p) > 128:
        return False, "Password is too long"
    return True, ""

def sanitize(value, max_len=200):
    if value is None:
        return None
    return str(value).strip()[:max_len]

# ── Routes ────────────────────────────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    # Required fields check
    required = ["email", "phone", "password", "full_name", "institution", "department", "year_of_study"]
    for field in required:
        if not str(data.get(field, "")).strip():
            return jsonify({"error": f"{field.replace('_', ' ').title()} is required"}), 400

    email    = sanitize(data["email"], 120).lower()
    phone    = sanitize(data["phone"], 20)
    password = str(data["password"])
    name     = sanitize(data["full_name"], 100)

    # Validate email
    if not validate_email(email):
        return jsonify({"error": "Enter a valid email address"}), 400

    # Validate phone
    if not validate_phone(phone):
        return jsonify({"error": "Enter a valid 10-digit phone number"}), 400

    # Validate password strength
    pw_ok, pw_msg = validate_password(password)
    if not pw_ok:
        return jsonify({"error": pw_msg}), 400

    # Validate name
    if len(name) < 2:
        return jsonify({"error": "Full name must be at least 2 characters"}), 400

    # Validate year
    try:
        year = int(data["year_of_study"])
        if year not in [1, 2, 3, 4, 5]:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid year of study"}), 400

    # Duplicate checks
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    if User.query.filter_by(phone=phone).first():
        return jsonify({"error": "Phone number already registered"}), 409

    roll = sanitize(data.get("roll_number"), 30) or None
    if roll and User.query.filter_by(roll_number=roll).first():
        return jsonify({"error": "Roll number already registered"}), 409

    # Create user
    user = User(
        email=email,
        phone=phone,
        full_name=name,
        roll_number=roll,
        institution=sanitize(data["institution"], 150),
        department=sanitize(data["department"], 100),
        year_of_study=year,
        linkedin_url=sanitize(data.get("linkedin_url"), 200),
        portfolio_url=sanitize(data.get("portfolio_url"), 200),
        commitment_level=data.get("commitment_level", "serious") if data.get("commitment_level") in ["serious", "learning", "fun"] else "serious",
    )
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    profile = Profile(user_id=user.id, bio=sanitize(data.get("bio"), 500) or "")
    db.session.add(profile)

    for cat in (data.get("interests") or [])[:10]:
        db.session.add(Interest(user_id=user.id, category=sanitize(cat, 80)))

    for skill_name in (data.get("skills") or [])[:20]:
        db.session.add(Skill(user_id=user.id, name=sanitize(skill_name, 80), level="intermediate"))

    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "unknown").split(",")[0].strip()

    if _is_rate_limited(ip):
        return jsonify({"error": "Too many login attempts. Please wait 5 minutes."}), 429

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    email    = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if not validate_email(email):
        return jsonify({"error": "Invalid credentials"}), 401

    user = User.query.filter_by(email=email).first()

    # Always run check_password to prevent timing attacks
    if not user:
        User.dummy_check()  # prevent timing leak
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    return jsonify(user.to_dict()), 200


@auth_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    user = User.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json(silent=True) or {}

    current = str(data.get("current_password", ""))
    new_pw  = str(data.get("new_password", ""))

    if not user.check_password(current):
        return jsonify({"error": "Current password is incorrect"}), 400

    pw_ok, pw_msg = validate_password(new_pw)
    if not pw_ok:
        return jsonify({"error": pw_msg}), 400

    if current == new_pw:
        return jsonify({"error": "New password must be different from current"}), 400

    user.set_password(new_pw)
    db.session.commit()
    return jsonify({"message": "Password updated successfully"}), 200


@auth_bp.route("/verify-identity", methods=["POST"])
def verify_identity():
    """Step 1 of forgot-password: confirm email + phone match."""
    data = request.get_json(silent=True) or {}
    email = sanitize(data.get("email"), 120).lower()
    phone = sanitize(data.get("phone"), 20)

    if not email or not phone:
        return jsonify({"error": "Email and phone are required"}), 400
    if not validate_email(email):
        return jsonify({"error": "Enter a valid email address"}), 400
    if not validate_phone(phone):
        return jsonify({"error": "Enter a valid phone number"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No account found with that email"}), 404

    # Strip and compare phone digits only
    stored = re.sub(r'[\s\-()]', '', str(user.phone or ''))
    incoming = re.sub(r'[\s\-()]', '', phone)
    if stored != incoming:
        return jsonify({"error": "Phone number does not match our records"}), 400

    return jsonify({"message": "Identity verified"}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    """Step 2 of forgot-password: set a new password after identity verified."""
    data = request.get_json(silent=True) or {}
    email    = sanitize(data.get("email"), 120).lower()
    phone    = sanitize(data.get("phone"), 20)
    new_pw   = str(data.get("new_password", ""))

    if not email or not phone or not new_pw:
        return jsonify({"error": "All fields are required"}), 400

    # Re-verify identity (prevent direct API calls bypassing step 1)
    if not validate_email(email) or not validate_phone(phone):
        return jsonify({"error": "Invalid credentials"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No account found with that email"}), 404

    stored   = re.sub(r'[\s\-()]', '', str(user.phone or ''))
    incoming = re.sub(r'[\s\-()]', '', phone)
    if stored != incoming:
        return jsonify({"error": "Identity verification failed"}), 400

    pw_ok, pw_msg = validate_password(new_pw)
    if not pw_ok:
        return jsonify({"error": pw_msg}), 400

    user.set_password(new_pw)
    db.session.commit()
    return jsonify({"message": "Password reset successfully"}), 200
