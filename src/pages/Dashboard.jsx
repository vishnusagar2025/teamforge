import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import AvatarDisplay from "../components/common/AvatarDisplay";
import { searchService } from "../services/teamService";
import { Users, Search, Plus, Zap, ArrowRight, Bot, ChevronRight } from "lucide-react";
import { DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      searchService.searchUsers({ looking_for_team: "true" }).catch(() => ({ data: [] })),
      searchService.searchTeams({}).catch(() => ({ data: [] })),
    ]).then(([u, t]) => {
      setRecommended(u.data.slice(0, 6));
      setTeams(t.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const profileFields = [user?.bio, user?.skills?.length, user?.interests?.length, user?.linkedin_url];
  const pct = Math.round((profileFields.filter(Boolean).length / 4) * 100);

  return (
    <div className="page">
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 48px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
              Good to see you, {user?.full_name?.split(" ")[0]}
            </h1>
            <p className="muted">{user?.institution} · {user?.department} · Year {user?.year_of_study}</p>
          </div>

          {pct < 100 && (
            <Link to="/profile/edit" style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--surface)",
              fontSize: 13, textDecoration: "none", color: "var(--text)",
              transition: "border-color 0.12s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 6, color: "var(--text2)" }}>Profile {pct}% complete</div>
                <div className="progress-track" style={{ width: 140 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <ChevronRight size={14} style={{ color: "var(--text3)" }} />
            </Link>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 40 }}>
          {[
            { to: "/find-people", icon: <Search size={14} />, label: "Find People" },
            { to: "/find-teams", icon: <Users size={14} />, label: "Find Teams" },
            { to: "/teams/new", icon: <Plus size={14} />, label: "Create Team" },
            { to: "/projects/new", icon: <Plus size={14} />, label: "New Project" },
            { to: "/ai/team-builder", icon: <Zap size={14} />, label: "AI Builder" },
            { to: "/ai/assistant", icon: <Bot size={14} />, label: "AI Assistant" },
          ].map(a => (
            <Link key={a.to} to={a.to} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 13px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--surface)",
              fontSize: 13, fontWeight: 450, color: "var(--text2)",
              textDecoration: "none", transition: "all 0.12s",
              whiteSpace: "nowrap"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--surface2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.background = "var(--surface)"; }}>
              {a.icon}{a.label}
            </Link>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }} className="dashboard-grid">

          {/* Recommended */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2>Recommended teammates</h2>
              <Link to="/find-people" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text3)", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}>
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 13, width: "40%", marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 11, width: "60%" }} />
                    </div>
                  </div>
                ))
              ) : recommended.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <p style={{ color: "var(--text3)", fontSize: 13 }}>Complete your profile to get matched</p>
                  <Link to="/profile" className="btn btn-primary" style={{ marginTop: 12, height: 32, fontSize: 12 }}>Complete profile</Link>
                </div>
              ) : recommended.map((u, i) => (
                <Link to={`/users/${u.id}`} key={u.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                  borderBottom: i < recommended.length - 1 ? "1px solid var(--border)" : "none",
                  textDecoration: "none", transition: "background 0.1s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <AvatarDisplay user={u} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.full_name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.department} · Year {u.year_of_study}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {u.interests?.slice(0, 1).map(int => (
                      <span key={int.id} className="badge-neutral" style={{ fontSize: 11 }}>
                        {DOMAIN_ICONS[int.category]} {int.category}
                      </span>
                    ))}
                    {u.compatibility_score != null && (
                      <span className={`badge ${u.compatibility_score >= 70 ? "score-high" : u.compatibility_score >= 40 ? "score-mid" : "score-low"}`}
                        style={{ fontSize: 11, borderRadius: 6 }}>
                        {u.compatibility_score}%
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Open teams sidebar */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2>Open teams</h2>
              <Link to="/find-teams" style={{ fontSize: 13, color: "var(--text3)", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}>
                All →
              </Link>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                    <div className="skeleton" style={{ height: 13, width: "60%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: "40%" }} />
                  </div>
                ))
              ) : teams.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <p style={{ color: "var(--text3)", fontSize: 13 }}>No open teams</p>
                  <Link to="/teams/new" className="btn btn-secondary" style={{ marginTop: 10, height: 30, fontSize: 12 }}>Create one</Link>
                </div>
              ) : teams.map((t, i) => (
                <Link to={`/teams/${t.id}`} key={t.id} style={{
                  display: "block", padding: "12px 16px",
                  borderBottom: i < teams.length - 1 ? "1px solid var(--border)" : "none",
                  textDecoration: "none", transition: "background 0.1s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface2)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>
                      {DOMAIN_ICONS[t.project_domain] || "🚀"} {t.project_domain || "General"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{t.current_members}/{t.max_members}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .dashboard-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
