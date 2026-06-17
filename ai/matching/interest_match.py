INTEREST_WEIGHTS = {
    "AI/Machine Learning": 1.3, "IoT & Embedded Systems": 1.2, "Robotics": 1.2,
    "Web Development": 1.0, "Mobile App Development": 1.0, "Cybersecurity": 1.1,
    "Blockchain": 1.1, "Data Science": 1.1, "Game Development": 1.0,
    "AR/VR": 1.2, "Cloud Computing": 1.0, "UI/UX Design": 1.0,
    "Hardware Hacking": 1.2, "Open Source": 0.9,
}

def interest_match_score(user_interests: list, target_interests: list) -> float:
    user_set = {i.lower() for i in user_interests}
    target_set = {i.lower() for i in target_interests}
    if not user_set or not target_set:
        return 0.0
    total_weight = match_weight = 0.0
    for interest in target_set:
        weight = next((v for k, v in INTEREST_WEIGHTS.items() if k.lower() == interest), 1.0)
        total_weight += weight
        if interest in user_set:
            match_weight += weight
    return round((match_weight / total_weight) * 100, 1) if total_weight else 0.0

def rank_users_by_interest(current_user, all_users):
    current_interests = [i.category for i in current_user.interests]
    ranked = [(u, interest_match_score(current_interests, [i.category for i in u.interests]))
              for u in all_users if u.id != current_user.id]
    return sorted(ranked, key=lambda x: x[1], reverse=True)
