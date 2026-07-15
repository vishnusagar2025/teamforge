"""
resume_parser.py
Parses .docx engineering resumes and returns structured candidate data.
"""

import os
import re
from docx import Document

# Mapping of filename prefix → full department name
DEPT_MAP = {
    "AIDS":           "AI & Data Science",
    "AIML":           "AI & Machine Learning",
    "CCE":            "Computer & Communication Engineering",
    "CSBS":           "CS & Business Systems",
    "CSE":            "Computer Science Engineering",
    "CYBER_SECURITY": "Cyber Security",
    "ECE":            "Electronics & Communication Engineering",
    "EEE":            "Electrical & Electronics Engineering",
    "IT":             "Information Technology",
    "MECH":           "Mechanical Engineering",
}

# Skill keywords to detect across resume text (category → keywords)
SKILL_KEYWORDS = {
    "Python":             ["python"],
    "Java":               ["java"],
    "C++":                ["c++", "cpp"],
    "C":                  [" c ", "\nc\n", "c programming"],
    "JavaScript":         ["javascript", "js"],
    "React":              ["react"],
    "Node.js":            ["node.js", "nodejs"],
    "Machine Learning":   ["machine learning", "ml"],
    "Deep Learning":      ["deep learning"],
    "TensorFlow":         ["tensorflow"],
    "PyTorch":            ["pytorch"],
    "Data Science":       ["data science", "data analysis"],
    "SQL":                ["sql", "mysql", "postgresql", "sqlite"],
    "MongoDB":            ["mongodb"],
    "Docker":             ["docker"],
    "Git":                ["git"],
    "Linux":              ["linux"],
    "Embedded Systems":   ["embedded", "microcontroller", "arduino", "raspberry pi"],
    "VLSI":               ["vlsi", "vhdl", "verilog"],
    "MATLAB":             ["matlab"],
    "AutoCAD":            ["autocad", "solidworks", "catia"],
    "Networking":         ["networking", "tcp/ip", "network security"],
    "Cloud":              ["aws", "azure", "gcp", "cloud"],
    "Flutter":            ["flutter"],
    "Kotlin":             ["kotlin"],
    "Cybersecurity":      ["cybersecurity", "penetration testing", "ethical hacking", "kali linux"],
    "HTML/CSS":           ["html", "css"],
    "Power Electronics":  ["power electronics", "plc", "scada"],
    "IoT":                ["iot", "internet of things"],
    "NLP":                ["nlp", "natural language processing"],
    "Computer Vision":    ["computer vision", "opencv", "image processing"],
    "Statistics":         ["statistics", "probability"],
}

# Department → interest category mapping
DEPT_INTERESTS = {
    "AI & Data Science":                    ["AI/Machine Learning", "Data Science"],
    "AI & Machine Learning":                ["AI/Machine Learning", "Data Science"],
    "Computer Science Engineering":         ["Web Development", "Software Engineering"],
    "CS & Business Systems":               ["Web Development", "Business Analytics"],
    "Information Technology":              ["Web Development", "Networking"],
    "Computer & Communication Engineering": ["Networking", "IoT & Embedded Systems"],
    "Cyber Security":                      ["Cybersecurity"],
    "Electronics & Communication Engineering": ["IoT & Embedded Systems", "VLSI"],
    "Electrical & Electronics Engineering": ["Power Systems", "IoT & Embedded Systems"],
    "Mechanical Engineering":              ["Design & Manufacturing", "IoT & Embedded Systems"],
}


def _extract_dept_and_name(filename: str) -> tuple[str, str, str]:
    """
    Parse filename like: CSE_01_Karthik_Menon.docx
    Returns (dept_key, full_name, roll_suffix) e.g. ("CSE", "Karthik Menon", "01")
    """
    base = os.path.splitext(os.path.basename(filename))[0]

    # Handle CYBER_SECURITY prefix specially
    if base.startswith("CYBER_SECURITY_"):
        rest = base[len("CYBER_SECURITY_"):]
        dept_key = "CYBER_SECURITY"
    else:
        parts = base.split("_", 1)
        dept_key = parts[0]
        rest = parts[1] if len(parts) > 1 else ""

    # rest = "01_Karthik_Menon" or similar
    rest_parts = rest.split("_")
    roll_suffix = rest_parts[0] if rest_parts else "00"
    name_parts = rest_parts[1:] if len(rest_parts) > 1 else []
    full_name = " ".join(name_parts)

    return dept_key, full_name, roll_suffix


def _get_doc_text(filepath: str) -> str:
    """Extract all paragraph text from a .docx file."""
    doc = Document(filepath)
    return "\n".join(p.text for p in doc.paragraphs)


def _extract_gpa(text: str) -> float | None:
    """Look for GPA / CGPA patterns like 8.5, 9.2/10."""
    patterns = [
        r'(?:cgpa|gpa)[:\s]+([0-9]\.[0-9]{1,2})',
        r'([0-9]\.[0-9]{1,2})\s*/\s*10',
        r'([0-9]\.[0-9]{1,2})\s*cgpa',
    ]
    for pat in patterns:
        match = re.search(pat, text.lower())
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass
    return None


def _extract_skills(text: str) -> list[dict]:
    """Return list of {name, level, category} skill dicts found in resume text."""
    text_lower = text.lower()
    found = []
    seen = set()
    for skill_name, keywords in SKILL_KEYWORDS.items():
        if skill_name in seen:
            continue
        for kw in keywords:
            if kw in text_lower:
                found.append({
                    "name": skill_name,
                    "level": "intermediate",
                    "category": _skill_category(skill_name),
                })
                seen.add(skill_name)
                break
    return found


def _skill_category(skill_name: str) -> str:
    ml_skills = {"Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "Data Science"}
    web_skills = {"JavaScript", "React", "Node.js", "HTML/CSS", "Flutter"}
    embedded_skills = {"Embedded Systems", "VLSI", "IoT", "MATLAB", "Power Electronics"}
    security_skills = {"Cybersecurity", "Networking", "Linux"}
    infra_skills = {"Docker", "Cloud", "Git", "SQL", "MongoDB"}

    if skill_name in ml_skills:
        return "AI/ML"
    elif skill_name in web_skills:
        return "Web"
    elif skill_name in embedded_skills:
        return "Embedded"
    elif skill_name in security_skills:
        return "Security"
    elif skill_name in infra_skills:
        return "Infrastructure"
    return "Programming"


def _count_projects(text: str) -> int:
    """Estimate project count from section keywords."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    project_section = False
    count = 0
    for line in lines:
        low = line.lower()
        if any(k in low for k in ["project", "projects"]):
            project_section = True
        if project_section and re.match(r'^[A-Z][A-Za-z\s\-]+$', line) and len(line) < 60:
            count += 1
    return min(count, 6)


def _extract_certifications(text: str) -> list[str]:
    """Find certification mentions."""
    certs = []
    cert_patterns = [
        r'(aws certified[^,\n]*)',
        r'(google [a-z ]+ certified[^,\n]*)',
        r'(nptel[^,\n]*)',
        r'(coursera[^,\n]*)',
        r'(udemy[^,\n]*)',
        r'(microsoft certified[^,\n]*)',
        r'(cisco[^,\n]*)',
    ]
    text_lower = text.lower()
    for pat in cert_patterns:
        for m in re.finditer(pat, text_lower):
            cert = m.group(1).strip().title()
            if cert and cert not in certs:
                certs.append(cert)
    return certs[:4]


def parse_resume(filepath: str) -> dict:
    """
    Parse a single .docx resume and return a structured dict with all candidate data.
    """
    dept_key, full_name, roll_suffix = _extract_dept_and_name(filepath)
    dept_full = DEPT_MAP.get(dept_key, dept_key)

    try:
        text = _get_doc_text(filepath)
    except Exception as e:
        text = ""
        print(f"  [WARN] Could not read {filepath}: {e}")

    gpa = _extract_gpa(text)
    skills = _extract_skills(text)
    certs = _extract_certifications(text)
    projects_count = _count_projects(text)
    interests = DEPT_INTERESTS.get(dept_full, ["General Engineering"])

    # Build a clean roll number
    roll_number = f"{dept_key}_{roll_suffix.zfill(3)}"

    # Deterministic fake email & phone
    email_name = full_name.lower().replace(" ", ".") if full_name else "unknown"
    email = f"{roll_number.lower().replace('_', '.')}@teamforge.local"
    phone = f"9{abs(hash(roll_number)) % 900000000 + 100000000}"[:10]

    return {
        "full_name": full_name or f"Candidate {roll_suffix}",
        "email": email,
        "phone": phone,
        "roll_number": roll_number,
        "department": dept_full,
        "dept_key": dept_key,
        "institution": "Sample Engineering College",
        "year_of_study": 3,
        "gpa": gpa,
        "skills": skills,
        "interests": interests,
        "certifications": certs,
        "projects_completed": projects_count,
        "resume_filename": os.path.basename(filepath),
        "bio": f"{full_name} is a {dept_full} student with expertise in {', '.join([s['name'] for s in skills[:3]]) or 'various engineering domains'}.",
        "commitment_level": "serious",
        "is_looking_for_team": True,
    }
