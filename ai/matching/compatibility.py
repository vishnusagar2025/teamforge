def compute_compatibility(user_a, user_b) -> float:
    score = 0.0
    interests_a = {i.category.lower() for i in user_a.interests}
    interests_b = {i.category.lower() for i in user_b.interests}
    if interests_a and interests_b:
        overlap = len(interests_a & interests_b)
        union = len(interests_a | interests_b)
        score += 40 * (overlap / union)
    skills_a = {s.name.lower() for s in user_a.skills}
    skills_b = {s.name.lower() for s in user_b.skills}
    if skills_a and skills_b:
        shared = len(skills_a & skills_b)
        unique_to_b = len(skills_b - skills_a)
        skill_score = (shared * 1.0 + unique_to_b * 1.5) / max(len(skills_a | skills_b), 1)
        score += min(30, 30 * skill_score)
    if user_a.institution and user_b.institution:
        if user_a.institution.strip().lower() == user_b.institution.strip().lower():
            score += 15
        elif any(word in user_b.institution.lower() for word in user_a.institution.lower().split() if len(word) > 3):
            score += 7
    commitment_map = {"serious": 3, "learning": 2, "fun": 1}
    ca = commitment_map.get(user_a.commitment_level, 2)
    cb = commitment_map.get(user_b.commitment_level, 2)
    score += [15, 8, 0][min(abs(ca - cb), 2)]
    return round(min(score, 100), 1)
