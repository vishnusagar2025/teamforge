# 🔥 TeamForge

> Find teammates who actually show up.

A full-stack AI-powered team formation platform for students, built with React + Flask.

---

## 📁 Folder Structure

```
TF2/
├── ai/matching/
│   ├── compatibility.py     ← Match score (interests 40% + skills 30% + institution 15% + commitment 15%)
│   ├── interest_match.py    ← Weighted interest overlap scoring
│   ├── skill_match.py       ← Skill gap analysis + category coverage
│   └── recommendation.py   ← Top-N teammate + team recommendations
│
├── backend/
│   ├── models/              ← user, profile, skill, interest, team, project, notification, review, badge
│   ├── routes/              ← auth, profile, team, project, search, user, notification, review, ai_routes, admin
│   ├── config/config.py
│   ├── database/db.py
│   ├── requirements.txt
│   └── app.py
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── src/
│   ├── pages/               ← 16 pages including AITeamBuilder + AIAssistant
│   ├── components/common/   ← Navbar, Logo, AvatarDisplay, AvatarBuilder
│   ├── context/             ← AuthContext
│   ├── services/            ← api.js, teamService.js (+ reviewService, aiService)
│   ├── hooks/               ← useNotifications, useProfile
│   ├── data/constants.js
│   └── styles/index.css
│
├── .env
├── vite.config.js           ← Proxy /api → Flask :5000
└── package.json
```

---

## 🚀 Run Locally

### Backend (Terminal 1)
```bash
cd TF2

python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

pip install -r backend/requirements.txt

# Set PYTHONPATH so ai/ module resolves correctly
$env:PYTHONPATH = "C:\path\to\TF2"   # PowerShell
export PYTHONPATH=/path/to/TF2        # Mac/Linux

cd backend
python app.py
```
Backend → http://127.0.0.1:5000

### Frontend (Terminal 2)
```bash
cd TF2
npm install
npm run dev
```
Frontend → http://localhost:5173

---

## 🌐 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current user |
| GET/PUT | `/api/profile/` | Get/update my profile |
| PUT | `/api/profile/avatar` | Update avatar config |
| POST/DELETE | `/api/profile/skills` | Add/remove skills |
| POST/DELETE | `/api/profile/interests` | Add/remove interests |
| GET | `/api/users/` | All users looking for team |
| GET | `/api/users/:id` | Get user |
| GET | `/api/teams/` | List open teams |
| POST | `/api/teams/` | Create team |
| GET | `/api/teams/:id` | Team detail |
| POST | `/api/teams/:id/join` | Request to join |
| POST | `/api/teams/:id/accept/:uid` | Accept member |
| GET | `/api/projects/` | List projects |
| POST | `/api/projects/` | Create project |
| GET | `/api/search/users` | Search users (filters: institution, department, year, skill, interest, commitment) |
| GET | `/api/search/teams` | Search teams (filters: domain, hackathon, institution) |
| GET | `/api/notifications/` | My notifications |
| PUT | `/api/notifications/:id/read` | Mark read |
| PUT | `/api/notifications/read-all` | Mark all read |
| GET | `/api/reviews/users/:id` | Get reviews for user |
| POST | `/api/reviews/users/:id` | Leave a review (1-5 stars) |
| GET | `/api/ai/suggest-teammates` | AI teammate recommendations |
| GET | `/api/ai/suggest-teams` | AI team recommendations |
| GET | `/api/ai/project-ideas` | Project ideas based on interests |
| GET | `/api/ai/team-health/:id` | Team health score (0-100) |
| POST | `/api/ai/build-team` | Auto-assemble optimal team |
| GET | `/api/admin/stats` | Platform stats (admin only) |
| GET | `/api/admin/users` | Paginated user list (admin only) |

---

## 🧠 AI Systems

### Compatibility Score (0-100)
| Factor | Weight |
|--------|--------|
| Shared interests (Jaccard) | 40% |
| Complementary skills | 30% |
| Same institution | 15% |
| Commitment alignment | 15% |

### Team Health Score (0-100)
| Factor | Weight |
|--------|--------|
| Skill category coverage | 40% |
| Team size fill % | 30% |
| Department diversity | 20% |
| Open to new members | 10% |

### AI Team Builder
Greedy algorithm: starts from current user's skill categories, iteratively adds users who contribute new skill categories until team is full.

---

## 🏆 Badges

Automatically awarded:
- 🚀 **Team Player** — Joined first team
- 👑 **Team Leader** — Created a team
- 💻 **Contributor** — Added first project
- ⚡ **Skilled** — Added 5+ skills
- ⭐ **Top Rated** — Received a 5-star review
- 🤝 **Networker** — Connected with 5+ people
- 🏆 **Hackathon Vet** — 3+ hackathon participations

---

## 🌐 Deploy

| Service | What |
|---------|------|
| **Vercel** | React frontend (`npm run build` → dist/) |
| **Render** | Flask backend (free tier) |
| **Render PostgreSQL** | Switch `DATABASE_URL` in config |

Set in Vercel:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

For PostgreSQL, set `DATABASE_URL` env var:
```
postgresql://user:pass@host/dbname
```

---

Built for every student who got betrayed by uncommitted teammates. 🔥
