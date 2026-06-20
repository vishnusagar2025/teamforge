import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import AvatarDisplay from "../components/common/AvatarDisplay";
import { searchService } from "../services/teamService";
import { Users, Search, Plus, Zap, ArrowRight, Star, TrendingUp, Target } from "lucide-react";
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
    ]).then(([users, teamsRes]) => {
      setRecommended(users.data.slice(0, 6));
      setTeams(teamsRes.data.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const profileComplete = [user?.bio, user?.skills?.length, user?.interests?.length, user?.linkedin_url]
    .filter(Boolean).length;
  const profilePct = Math.round((profileComplete / 4) * 100);

  const ACTIONS = [
    { to: "/find-people", icon: <Search size={18} className="text-violet-400" />, label: "Find People", desc: "Search by skill & interest", bg: "bg-violet-500/8" },
    { to: "/find-teams", icon: <Users size={18} className="text-cyan-400" />, label: "Find Teams", desc: "Join an open team", bg: "bg-cyan-500/8" },
    { to: "/teams/new", icon: <Plus size={18} className="text-emerald-400" />, label: "Create Team", desc: "Post a team slot", bg: "bg-emerald-500/8" },
    { to: "/projects/new", icon: <Zap size={18} className="text-amber-400" />, label: "Add Project", desc: "Share your idea", bg: "bg-amber-500/8" },
    { to: "/ai/team-builder", icon: <Zap size={18} className="text-violet-300" />, label: "AI Builder", desc: "Auto-assemble a team", bg: "bg-violet-500/8" },
    { to: "/ai/assistant", icon: <Zap size={18} className="text-cyan-300" />, label: "AI Ideas", desc: "Get project suggestions", bg: "bg-cyan-500/8" },
  ];

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Hey, {user?.full_name?.split(" ")[0]} 👋</h1>
            <p className="text-slate-500 text-sm mt-1">{user?.institution} · {user?.department} · Year {user?.year_of_study}</p>
          </div>
          {profilePct < 100 && (
            <div className="card py-3 px-4 flex items-center gap-3 min-w-[200px]">
              <Target size={16} className="text-violet-400 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Profile {profilePct}% complete</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${profilePct}%` }} />
                </div>
              </div>
              <Link to="/profile/edit" className="text-xs text-violet-400 hover:text-violet-300 shrink-0">Fix →</Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {ACTIONS.map(a => (
            <Link key={a.to} to={a.to}
              className="card-hover group cursor-pointer">
              <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center mb-3`}>
                {a.icon}
              </div>
              <p className="font-semibold text-sm">{a.label}</p>
              <p className="text-slate-600 text-xs mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommended People */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm">
                <Star size={15} className="text-amber-400 fill-amber-400" /> Recommended for You
              </h2>
              <Link to="/find-people" className="text-violet-400 text-xs flex items-center gap-1 hover:text-violet-300 transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card h-24 animate-pulse bg-white/[0.02]" />
                ))}
              </div>
            ) : recommended.length === 0 ? (
              <div className="card text-center py-10">
                <TrendingUp size={32} className="text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Complete your profile to get matched</p>
                <Link to="/profile" className="btn-primary text-xs mt-3 py-2 px-4">Complete Profile</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommended.map(u => (
                  <Link to={`/users/${u.id}`} key={u.id} className="card-hover">
                    <div className="flex items-start gap-3">
                      <AvatarDisplay user={u} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{u.full_name}</p>
                        <p className="text-slate-500 text-xs truncate">{u.department} · Y{u.year_of_study}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {u.interests?.slice(0, 2).map(i => (
                            <span key={i.id} className="badge-purple text-[10px]">
                              {DOMAIN_ICONS[i.category]} {i.category}
                            </span>
                          ))}
                        </div>
                      </div>
                      {u.compatibility_score != null && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          u.compatibility_score >= 70 ? "bg-emerald-900/40 text-emerald-300" :
                          u.compatibility_score >= 40 ? "bg-amber-900/40 text-amber-300" :
                          "bg-white/5 text-slate-400"}`}>
                          {u.compatibility_score}%
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Open Teams */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm">
                <Users size={15} className="text-cyan-400" /> Open Teams
              </h2>
              <Link to="/find-teams" className="text-violet-400 text-xs flex items-center gap-1 hover:text-violet-300 transition-colors">
                All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {teams.length === 0 ? (
                <div className="card text-center py-8 text-slate-600 text-sm">No open teams yet</div>
              ) : teams.map(t => (
                <Link to={`/teams/${t.id}`} key={t.id} className="card-hover block">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">{t.hackathon_name || "General project"}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="badge-blue text-[10px]">
                      {DOMAIN_ICONS[t.project_domain] || "🚀"} {t.project_domain || "Mixed"}
                    </span>
                    <span className="text-slate-600 text-xs">{t.current_members}/{t.max_members} members</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
