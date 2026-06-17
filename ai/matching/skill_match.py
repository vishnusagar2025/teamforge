SKILL_CATEGORIES = {
    "frontend": ["react", "vue", "angular", "html", "css", "javascript", "typescript", "tailwind"],
    "backend": ["python", "flask", "django", "node", "express", "java", "spring", "go"],
    "ml": ["pytorch", "tensorflow", "sklearn", "pandas", "numpy", "ml", "ai", "nlp"],
    "mobile": ["flutter", "react native", "kotlin", "swift", "android", "ios"],
    "devops": ["docker", "kubernetes", "aws", "gcp", "azure", "linux"],
    "database": ["sql", "postgresql", "mongodb", "redis", "mysql"],
    "hardware": ["arduino", "raspberry pi", "iot", "embedded", "pcb", "fpga"],
    "design": ["figma", "adobe xd", "ui", "ux"],
    "security": ["cybersecurity", "ethical hacking", "penetration testing", "ctf"],
}

def categorize_skill(skill_name: str) -> str:
    skill_lower = skill_name.lower()
    for category, keywords in SKILL_CATEGORIES.items():
        if any(kw in skill_lower for kw in keywords):
            return category
    return "other"

def team_skill_coverage(members) -> dict:
    coverage = {cat: [] for cat in SKILL_CATEGORIES}
    for member in members:
        for skill in member.skills:
            cat = categorize_skill(skill.name)
            if cat in coverage:
                coverage[cat].append({"user": member.full_name, "skill": skill.name})
    return {k: v for k, v in coverage.items() if v}

def skill_gap_analysis(team_members, required_skills: list) -> list:
    team_skills = {s.name.lower() for member in team_members for s in member.skills}
    return [req for req in required_skills if not any(req.lower() in ts for ts in team_skills)]

def complementary_score(user_a, user_b) -> float:
    cats_a = {categorize_skill(s.name) for s in user_a.skills}
    cats_b = {categorize_skill(s.name) for s in user_b.skills}
    new_categories = cats_b - cats_a
    return round(len(new_categories) / max(len(SKILL_CATEGORIES), 1) * 100, 1)
