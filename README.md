# 🔥 TeamForge

> Find teammates who actually show up.

Built from real hackathon pain — a platform for students to find committed teammates by institution, department, skills, interests and commitment level.

---

## 📁 Folder Structure

```
TeamForge/
├── ai/
│   └── matching/
│       ├── compatibility.py     ← AI match score (0-100)
│       ├── interest_match.py    ← Interest overlap scoring
│       ├── skill_match.py       ← Skill gap analysis
│       └── recommendation.py   ← Top-N recommendations
│
├── backend/
│   ├── models/                  ← user, profile, skill, interest, team, project, notification
│   ├── routes/                  ← auth, profile, team, search, project, user, notification
│   ├── config/config.py
│   ├── requirements.txt
│   └── app.py                   ← Flask entry point
│
├── database/
│   ├── schema.sql               ← PostgreSQL schema
│   └── seed.sql                 ← Test data
│
├── deployment/
│   ├── docker/                  ← Dockerfile + docker-compose
│   └── nginx/                   ← nginx config for production
│
├── src/
│   ├── pages/                   ← Landing, Login, Register, Dashboard,
│   │                               FindPeople, FindTeams, TeamDetail,
│   │                               CreateTeam, Projects, CreateProject,
│   │                               Profile, EditProfile, UserProfile, Notifications
│   ├── components/common/       ← Navbar
│   ├── context/AuthContext.jsx  ← Auth state management
│   ├── services/                ← api.js, teamService.js
│   ├── hooks/                   ← useNotifications, useProfile
│   ├── data/constants.js        ← Interests, skills, departments
│   ├── styles/index.css         ← Tailwind + custom classes
│   ├── utils/helpers.js
│   ├── app.jsx
│   └── routes.jsx
│
├── .env                         ← VITE_API_URL=/api
├── .gitignore
├── index.html
├── main.jsx
├── package.json
├── vite.config.js               ← Proxy /api → Flask
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Run Locally

### Backend (Terminal 1)
```bash
cd TeamForge
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

pip install -r backend/requirements.txt

# Set Python path so ai/ folder is found
$env:PYTHONPATH = "C:\path\to\TeamForge"   # PowerShell
export PYTHONPATH=/path/to/TeamForge        # Mac/Linux

cd backend
python app.py
```
Backend → http://127.0.0.1:5000

### Frontend (Terminal 2)
```bash
cd TeamForge
npm install
npm run dev
```
Frontend → http://localhost:5173

---

## 🌐 Deploy

| Service | What |
|---------|------|
| **Vercel** | React frontend |
| **Render** | Flask backend + free PostgreSQL |

Set `VITE_API_URL` in Vercel to your Render backend URL.

---

## 🧠 AI Matching Score

| Factor | Weight |
|--------|--------|
| Shared interests | 40% |
| Complementary skills | 30% |
| Same institution | 15% |
| Commitment alignment | 15% |

---

Built for every student who got betrayed by uncommitted teammates. 🔥
