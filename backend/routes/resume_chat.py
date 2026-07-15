"""
resume_chat.py
Chatbot API for natural-language team search over the resume candidate pool.

Endpoint:
    POST /api/resume-chat/message
    Body: { "message": "I need a team of 4 for ML hackathon with Python and React devs" }

    GET /api/resume-chat/candidates?dept=CSE&skill=Python&limit=20
"""

import re
from flask import Blueprint, request, jsonify
from models.user import User
from models.skill import Skill
from models.interest import Interest

resume_chat_bp = Blueprint("resume_chat", __name__)

# ─── Constraint extraction helpers ─────────────────────────────────────────────

DEPT_ALIASES = {
    "cse": "Computer Science Engineering",
    "computer science": "Computer Science Engineering",
    "it": "Information Technology",
    "information technology": "Information Technology",
    "ece": "Electronics & Communication Engineering",
    "electronics": "Electronics & Communication Engineering",
    "eee": "Electrical & Electronics Engineering",
    "electrical": "Electrical & Electronics Engineering",
    "mech": "Mechanical Engineering",
    "mechanical": "Mechanical Engineering",
    "aiml": "AI & Machine Learning",
    "ai ml": "AI & Machine Learning",
    "ai/ml": "AI & Machine Learning",
    "machine learning": "AI & Machine Learning",
    "aids": "AI & Data Science",
    "data science": "AI & Data Science",
    "ai & data": "AI & Data Science",
    "cyber": "Cyber Security",
    "cybersecurity": "Cyber Security",
    "cyber security": "Cyber Security",
    "cce": "Computer & Communication Engineering",
    "communication": "Computer & Communication Engineering",
    "csbs": "CS & Business Systems",
    "business systems": "CS & Business Systems",
}

SKILL_ALIASES = {
    "python": "Python",
    "java": "Java",
    "c++": "C++",
    "cpp": "C++",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "react": "React",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "data science": "Data Science",
    "sql": "SQL",
    "mongodb": "MongoDB",
    "docker": "Docker",
    "git": "Git",
    "linux": "Linux",
    "embedded": "Embedded Systems",
    "arduino": "Embedded Systems",
    "vlsi": "VLSI",
    "matlab": "MATLAB",
    "autocad": "AutoCAD",
    "networking": "Networking",
    "aws": "Cloud",
    "cloud": "Cloud",
    "flutter": "Flutter",
    "kotlin": "Kotlin",
    "cybersecurity": "Cybersecurity",
    "ethical hacking": "Cybersecurity",
    "html": "HTML/CSS",
    "css": "HTML/CSS",
    "power electronics": "Power Electronics",
    "iot": "IoT",
    "nlp": "NLP",
    "computer vision": "Computer Vision",
}

DOMAIN_INTERESTS = {
    "ai": "AI/Machine Learning",
    "machine learning": "AI/Machine Learning",
    "ml": "AI/Machine Learning",
    "data science": "Data Science",
    "web": "Web Development",
    "website": "Web Development",
    "frontend": "Web Development",
    "backend": "Web Development",
    "fullstack": "Web Development",
    "iot": "IoT & Embedded Systems",
    "embedded": "IoT & Embedded Systems",
    "security": "Cybersecurity",
    "cyber": "Cybersecurity",
    "business": "Business Analytics",
}

BOT_GREETINGS = [
    "hi", "hello", "hey", "hlo", "hii", "howdy",
]

HELP_KEYWORDS = ["help", "what can you do", "how does this work", "guide"]


def extract_team_size(text: str) -> int | None:
    patterns = [
        r'team\s+of\s+(\d+)',
        r'(\d+)\s+member',
        r'(\d+)\s+person',
        r'(\d+)\s+people',
        r'size\s+(\d+)',
        r'(\d+)\s+candidate',
    ]
    for pat in patterns:
        m = re.search(pat, text.lower())
        if m:
            return min(int(m.group(1)), 8)
    return None


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for alias, canonical in SKILL_ALIASES.items():
        if alias in text_lower and canonical not in found:
            found.append(canonical)
    return found


def extract_departments(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for alias, canonical in DEPT_ALIASES.items():
        if alias in text_lower and canonical not in found:
            found.append(canonical)
    return found


def extract_domain_interests(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for alias, canonical in DOMAIN_INTERESTS.items():
        if alias in text_lower and canonical not in found:
            found.append(canonical)
    return found


def extract_constraints(text: str) -> dict:
    return {
        "team_size": extract_team_size(text),
        "skills": extract_skills(text),
        "departments": extract_departments(text),
        "domains": extract_domain_interests(text),
    }


# ─── Candidate scoring ─────────────────────────────────────────────────────────

def score_candidate(user: User, constraints: dict) -> float:
    score = 0.0
    user_skills = {s.name.lower() for s in user.skills}
    user_interests = {i.category for i in user.interests}

    # Skill match: +20 per matched skill (max 60)
    for skill in constraints.get("skills", []):
        if skill.lower() in user_skills:
            score += 20
    score = min(score, 60)

    # Department match: +25 if dept matches
    for dept in constraints.get("departments", []):
        if user.department and dept.lower() in user.department.lower():
            score += 25
            break

    # Domain/interest match: +15 per matched interest (max 30)
    for domain in constraints.get("domains", []):
        if domain in user_interests:
            score += 15
    score = min(score, score)  # no extra cap needed

    # Diversity bonus: always give base 5 to avoid all-zero results
    score += 5

    return round(score, 1)


def find_best_team(constraints: dict, max_size: int = 4) -> list[dict]:
    """
    Select a diverse team of candidates that best satisfies the constraints.
    Uses a greedy approach to maximize skill & department diversity.
    """
    all_candidates = User.query.filter(
        User.is_looking_for_team == True,
        User.email.like("%teamforge.local%")  # only resume-seeded users
    ).all()

    # Score all candidates
    scored = []
    for user in all_candidates:
        s = score_candidate(user, constraints)
        scored.append((s, user))

    scored.sort(key=lambda x: x[0], reverse=True)

    # Greedy selection: build a diverse team
    selected = []
    used_depts = set()
    used_skills = set()

    # First pass: pick top candidates that add new dept/skill diversity
    for score, user in scored:
        if len(selected) >= max_size:
            break
        user_dept = user.department or ""
        user_skill_names = {s.name for s in user.skills}
        adds_dept = user_dept not in used_depts
        adds_skill = bool(user_skill_names - used_skills)
        if adds_dept or adds_skill:
            selected.append((score, user))
            used_depts.add(user_dept)
            used_skills |= user_skill_names

    # Second pass: fill remaining slots with top scorers not already selected
    if len(selected) < max_size:
        selected_ids = {u.id for _, u in selected}
        for score, user in scored:
            if len(selected) >= max_size:
                break
            if user.id not in selected_ids:
                selected.append((score, user))
                selected_ids.add(user.id)

    return [user_to_card(user, score) for score, user in selected]


def user_to_card(user: User, score: float) -> dict:
    skills = [s.name for s in user.skills]
    return {
        "id": user.id,
        "full_name": user.full_name,
        "department": user.department,
        "year_of_study": user.year_of_study,
        "institution": user.institution,
        "skills": skills[:8],
        "bio": user.profile.bio if user.profile else "",
        "resume_url": user.resume_url,
        "avatar_url": user.avatar_url,
        "match_score": min(int(score), 100),
        "email": user.email,
        "roll_number": user.roll_number,
    }


# ─── Bot response generator ────────────────────────────────────────────────────

def generate_bot_response(message: str) -> dict:
    """
    Parse the user's message and return a structured bot response.
    Returns: { "text": str, "team": [...], "constraints": {...}, "type": str }
    """
    msg_lower = message.lower().strip()

    # Greeting
    if any(g in msg_lower for g in BOT_GREETINGS) and len(msg_lower) < 20:
        return {
            "type": "greeting",
            "text": (
                "Hey there! I'm TeamForge Bot.\n\n"
                "Tell me what kind of team you're looking for and I'll find the best matches from our candidate pool.\n\n"
                "Try something like:\n"
                "• \"Find me a team of 4 for an AI/ML hackathon\"\n"
                "• \"I need 2 Python developers and 1 ECE student\"\n"
                "• \"Build a team with React, Node.js, and Machine Learning skills\""
            ),
            "team": [],
            "constraints": {},
        }

    # Help
    if any(h in msg_lower for h in HELP_KEYWORDS):
        return {
            "type": "help",
            "text": (
                "Here's what I can do:\n\n"
                "**Search by skills** — mention any tech like Python, React, ML, VLSI, AutoCAD\n"
                "**Search by department** — CSE, ECE, AIML, Cyber Security, Mechanical, etc.\n"
                "**Set team size** — say 'team of 4' or '3 members'\n"
                "**Domain search** — mention hackathon domains like AI, Web, IoT, Cybersecurity\n\n"
                "Example: *\"I need a team of 5 for a web dev hackathon — 2 React devs, 1 Node.js, 1 ML, 1 ECE\"*"
            ),
            "team": [],
            "constraints": {},
        }

    # Extract constraints from user message
    constraints = extract_constraints(message)
    team_size = constraints["team_size"] or 4

    # If nothing was understood
    if not constraints["skills"] and not constraints["departments"] and not constraints["domains"]:
        return {
            "type": "unclear",
            "text": (
                "I couldn't quite understand your requirements. Try being more specific!\n\n"
                "For example:\n"
                "• Skills: Python, React, Machine Learning, VLSI, Docker...\n"
                "• Departments: CSE, ECE, AIML, Mechanical, Cyber Security...\n"
                "• Team size: 'team of 4', '3 members'\n"
                "• Domain: AI/ML, Web, IoT, Cybersecurity"
            ),
            "team": [],
            "constraints": constraints,
        }

    # Find best team
    team = find_best_team(constraints, max_size=team_size)

    # Build response text
    skill_str = ", ".join(constraints["skills"]) if constraints["skills"] else ""
    dept_str = ", ".join(constraints["departments"]) if constraints["departments"] else ""
    parts = []
    if dept_str:
        parts.append(f"from **{dept_str}**")
    if skill_str:
        parts.append(f"skilled in **{skill_str}**")

    filter_desc = " and ".join(parts) if parts else "from our candidate pool"

    text = (
        f"Found **{len(team)} candidate(s)** {filter_desc} for your team of {team_size}!\n\n"
        f"These candidates are ranked by how well they match your requirements."
    )

    if len(team) < team_size:
        text += f"\n\n*Note: Only {len(team)} candidates matched your specific constraints. Try broadening your search.*"

    return {
        "type": "results",
        "text": text,
        "team": team,
        "constraints": {
            "team_size": team_size,
            "skills": constraints["skills"],
            "departments": constraints["departments"],
            "domains": constraints["domains"],
        },
    }


# ─── Routes ────────────────────────────────────────────────────────────────────

@resume_chat_bp.route("/message", methods=["POST"])
def chat_message():
    """Process a natural-language team search message."""
    data = request.get_json()
    if not data or not data.get("message"):
        return jsonify({"error": "message is required"}), 400

    message = str(data["message"]).strip()
    if len(message) > 500:
        return jsonify({"error": "message too long (max 500 chars)"}), 400

    response = generate_bot_response(message)
    return jsonify(response), 200


@resume_chat_bp.route("/candidates", methods=["GET"])
def list_candidates():
    """Return all resume-seeded candidates with optional filters."""
    dept_filter = request.args.get("dept", "").strip()
    skill_filter = request.args.get("skill", "").strip()
    limit = min(int(request.args.get("limit", 20)), 100)

    query = User.query.filter(User.email.like("%teamforge.local%"))

    if dept_filter:
        query = query.filter(User.department.ilike(f"%{dept_filter}%"))

    users = query.limit(limit).all()

    if skill_filter:
        users = [u for u in users if any(skill_filter.lower() in s.name.lower() for s in u.skills)]

    return jsonify([user_to_card(u, 0) for u in users]), 200


@resume_chat_bp.route("/stats", methods=["GET"])
def candidate_stats():
    """Return summary stats about the candidate pool."""
    all_users = User.query.filter(User.email.like("%teamforge.local%")).all()

    dept_counts = {}
    skill_counts = {}
    for user in all_users:
        d = user.department or "Unknown"
        dept_counts[d] = dept_counts.get(d, 0) + 1
        for s in user.skills:
            skill_counts[s.name] = skill_counts.get(s.name, 0) + 1

    top_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:15]

    return jsonify({
        "total_candidates": len(all_users),
        "departments": dept_counts,
        "top_skills": [{"skill": k, "count": v} for k, v in top_skills],
    }), 200
