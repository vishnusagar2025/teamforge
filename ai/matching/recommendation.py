from ai.matching.compatibility import compute_compatibility
from ai.matching.skill_match import complementary_score

def recommend_teammates(current_user, all_users, top_n=10):
    results = []
    for u in all_users:
        if u.id == current_user.id or not u.is_looking_for_team:
            continue
        compat = compute_compatibility(current_user, u)
        comp_skill = complementary_score(current_user, u)
        results.append({
            "user": u.to_dict(), "compatibility_score": compat,
            "skill_complement_score": comp_skill,
            "final_score": round((compat * 0.6) + (comp_skill * 0.4), 1),
        })
    return sorted(results, key=lambda x: x["final_score"], reverse=True)[:top_n]

def recommend_teams_for_user(current_user, all_teams, top_n=10):
    user_interests = {i.category.lower() for i in current_user.interests}
    results = []
    for team in all_teams:
        if not team.is_open or team.member_count() >= team.max_members:
            continue
        score = 0.0
        if team.project_domain and any(team.project_domain.lower() in i for i in user_interests):
            score += 40
        if current_user.institution and team.institution:
            if current_user.institution.lower() == team.institution.lower():
                score += 30
        if current_user.commitment_level == team.commitment_level:
            score += 20
        score += min(10, (team.max_members - team.member_count()) * 2)
        results.append({"team": team.to_dict(), "match_score": round(score, 1)})
    return sorted(results, key=lambda x: x["match_score"], reverse=True)[:top_n]
