from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.team import Team
from models.project import Project
from ai.matching.recommendation import recommend_teammates, recommend_teams_for_user
from ai.matching.skill_match import team_skill_coverage, skill_gap_analysis, SKILL_CATEGORIES

ai_bp = Blueprint("ai", __name__)

# Project idea seeds per domain — simple rule-based suggestions
PROJECT_IDEAS = {
    "AI/Machine Learning": [
        "Resume parser that extracts skills automatically",
        "Fake news detection using NLP",
        "Personalized learning path recommender",
    ],
    "Web Development": [
        "Collaborative whiteboard for remote teams",
        "Open-source job board for students",
        "Event management platform with QR check-in",
    ],
    "IoT & Embedded Systems": [
        "Smart campus attendance using RFID",
        "Air quality monitor with real-time dashboard",
        "Automated plant watering system",
    ],
    "Cybersecurity": [
        "CTF challenge platform for beginners",
        "Password strength analyzer with breach check",
        "Network intrusion detection dashboard",
    ],
    "Data Science": [
        "Student performance prediction dashboard",
        "Public transport delay analysis tool",
        "Cricket match outcome predictor",
    ],
    "default": [
        "Hackathon project management tool",
        "Peer mentorship matching platform",
        "Open-source contribution tracker",
    ],
}

@ai_bp.route("/suggest-teammates", methods=["GET"])
@jwt_required()
def suggest_teammates():
    current_user = User.query.get_or_404(int(get_jwt_identity()))
    all_users = User.query.filter(User.id != current_user.id).all()
    suggestions = recommend_teammates(current_user, all_users, top_n=8)
    return jsonify(suggestions), 200

@ai_bp.route("/suggest-teams", methods=["GET"])
@jwt_required()
def suggest_teams():
    current_user = User.query.get_or_404(int(get_jwt_identity()))
    all_teams = Team.query.all()
    suggestions = recommend_teams_for_user(current_user, all_teams, top_n=6)
    return jsonify(suggestions), 200

@ai_bp.route("/project-ideas", methods=["GET"])
@jwt_required()
def project_ideas():
    current_user = User.query.get_or_404(int(get_jwt_identity()))
    domains = [i.category for i in current_user.interests] or ["default"]
    ideas = []
    for domain in domains[:3]:
        ideas += [{"idea": idea, "domain": domain}
                  for idea in PROJECT_IDEAS.get(domain, PROJECT_IDEAS["default"])]
    return jsonify(ideas[:9]), 200

@ai_bp.route("/team-health/<int:team_id>", methods=["GET"])
@jwt_required()
def team_health(team_id):
    team = Team.query.get_or_404(team_id)
    coverage = team_skill_coverage(team.members)
    covered_cats = len(coverage)
    total_cats = len(SKILL_CATEGORIES)
    skill_score = round((covered_cats / total_cats) * 40, 1)
    size_score = round(min(team.member_count() / max(team.max_members, 1), 1) * 30, 1)
    diversity_score = min(len({m.department for m in team.members}) * 10, 20)
    open_score = 10 if team.is_open else 0
    health = round(skill_score + size_score + diversity_score + open_score, 1)
    gaps = []
    if team.required_skills:
        import json
        try:
            req = json.loads(team.required_skills) if isinstance(team.required_skills, str) else team.required_skills
            gaps = skill_gap_analysis(team.members, req)
        except Exception:
            pass
    return jsonify({
        "health_score": health,
        "breakdown": {
            "skill_coverage": skill_score,
            "team_size": size_score,
            "diversity": diversity_score,
            "openness": open_score,
        },
        "covered_skill_categories": list(coverage.keys()),
        "skill_gaps": gaps,
        "member_count": team.member_count(),
    }), 200

@ai_bp.route("/build-team", methods=["POST"])
@jwt_required()
def build_team():
    """Given a list of required skill categories, return the best set of users to form a team."""
    current_user = User.query.get_or_404(int(get_jwt_identity()))
    data = request.get_json()
    required_categories = data.get("categories", [])
    max_size = min(int(data.get("max_size", 4)), 6)
    all_users = User.query.filter(User.id != current_user.id, User.is_looking_for_team == True).all()
    # Score each user by how many required categories they cover
    def user_category_coverage(user):
        from ai.matching.skill_match import categorize_skill
        cats = {categorize_skill(s.name) for s in user.skills}
        return len(cats & set(required_categories))
    candidates = sorted(all_users, key=lambda u: (
        user_category_coverage(u),
        len(u.skills)
    ), reverse=True)
    # Greedy selection: pick users that add new categories
    from ai.matching.skill_match import categorize_skill
    covered = {categorize_skill(s.name) for s in current_user.skills}
    team = [current_user.to_summary()]
    for user in candidates:
        if len(team) >= max_size:
            break
        user_cats = {categorize_skill(s.name) for s in user.skills}
        if user_cats - covered:  # adds something new
            covered |= user_cats
            team.append(user.to_summary())
    return jsonify({"suggested_team": team, "covered_categories": list(covered)}), 200
