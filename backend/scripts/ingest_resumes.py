"""
ingest_resumes.py
One-time script to parse all 100 .docx resumes and seed them into the TeamForge database.

Usage (from backend/ directory):
    python scripts/ingest_resumes.py
"""

import sys
import os

# Allow imports from backend root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database.db import db
from models.user import User
from models.profile import Profile
from models.skill import Skill
from models.interest import Interest
from utils.resume_parser import parse_resume

RESUMES_DIR = os.path.join(os.path.dirname(__file__), "..", "resumes")
DEFAULT_PASSWORD = "TeamForge2024!"


def ingest_all():
    app = create_app()
    with app.app_context():
        resume_files = sorted([
            f for f in os.listdir(RESUMES_DIR)
            if f.endswith(".docx")
        ])

        print(f"Found {len(resume_files)} resume files.\n")
        created = 0
        skipped = 0

        for filename in resume_files:
            filepath = os.path.join(RESUMES_DIR, filename)
            try:
                data = parse_resume(filepath)
            except Exception as e:
                print(f"  [ERROR] Parsing {filename}: {e}")
                continue

            # Skip if already ingested
            existing = User.query.filter_by(email=data["email"]).first()
            if existing:
                print(f"  [SKIP] {data['full_name']} already in DB.")
                skipped += 1
                continue

            # Create User
            user = User(
                email=data["email"],
                phone=data["phone"],
                full_name=data["full_name"],
                roll_number=data["roll_number"],
                institution=data["institution"],
                department=data["department"],
                year_of_study=data["year_of_study"],
                is_looking_for_team=data["is_looking_for_team"],
                commitment_level=data["commitment_level"],
                resume_url=f"/resumes/{data['resume_filename']}",
                avatar_url="/default-avatar.png",
            )
            user.set_password(DEFAULT_PASSWORD)
            db.session.add(user)
            db.session.flush()  # Get user.id

            # Create Profile
            cert_text = "; ".join(data.get("certifications", []))
            profile = Profile(
                user_id=user.id,
                bio=data["bio"],
                achievements=cert_text if cert_text else None,
                hackathons_participated=0,
                projects_completed=data.get("projects_completed", 0),
            )
            db.session.add(profile)

            # Create Skills
            for skill_data in data.get("skills", []):
                skill = Skill(
                    user_id=user.id,
                    name=skill_data["name"],
                    level=skill_data.get("level", "intermediate"),
                    category=skill_data.get("category", "General"),
                )
                db.session.add(skill)

            # Create Interests
            for i, interest_cat in enumerate(data.get("interests", [])):
                interest = Interest(
                    user_id=user.id,
                    category=interest_cat,
                    is_primary=(i == 0),
                )
                db.session.add(interest)

            db.session.commit()
            skill_names = [s["name"] for s in data["skills"][:4]]
            print(f"  [OK] {data['full_name']} ({data['department']}) — skills: {', '.join(skill_names) or 'none detected'}")
            created += 1

        print(f"\nDone! Created {created} new profiles, skipped {skipped}.")


if __name__ == "__main__":
    ingest_all()
