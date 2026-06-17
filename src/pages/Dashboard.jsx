import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { searchService } from "../services/teamService";
import { Users, Search, Plus, Zap, ArrowRight, Star } from "lucide-react";
import { DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    searchService.searchUsers({ looking_for_team: "true" })
      .then(res => setRecommended(res.data.slice(0, 6))).catch(() => {});
    searchService.searchTeams({})
      .then(res => setTeams(res.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Hey, {user?.full_name?.split(" ")[0]} 👋</h1>
          <p className="text-slate-400">{user?.institution} · {user?.department} · Year {user?.year_of_study}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { to:"/find-people", icon:<Search size={20} className="text-purple-400"/>, label:"Find People", desc:"Search by skill & interest" },
            { to:"/find-teams", icon:<Users size={20} className="text-cyan-400"/>, label:"Find Teams", desc:"Join an open team" },
            { to:"/teams/new", icon:<Plus size={20} className="text-green-400"/>, label:"Create Team", desc:"Post a team slot" },
            { to:"/projects/new", icon:<Zap size={20} className="text-yellow-400"/>, label:"Add Project", desc:"Share your idea" },
          ].map(a => (
            <Link key={a.to} to={a.to} className="card hover:border-purple-500/50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-[#0F0F1A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {a.icon}
              </div>
              <p className="font-semibold text-sm">{a.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Star size={18} className="text-yellow-400"/> Recommended for You
              </h2>
              <Link to="/find-people" className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300">
                View all <ArrowRight size={14}/>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommended.length === 0 ? (
                <div className="card col-span-2 text-center text-slate-400 py-8">
                  Complete your profile to get personalized recommendations
                </div>
              ) : recommended.map(u => (
                <Link to={`/users/${u.id}`} key={u.id} className="card hover:border-purple-500/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold shrink-0">
                      {u.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{u.full_name}</p>
                      <p className="text-slate-400 text-xs truncate">{u.department} · Year {u.year_of_study}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {u.interests?.slice(0, 2).map(i => (
                          <span key={i.id} className="badge-purple text-[10px]">
                            {DOMAIN_ICONS[i.category]} {i.category}
                          </span>
                        ))}
                      </div>
                    </div>
                    {u.compatibility_score != null && (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        u.compatibility_score >= 70 ? "bg-green-900/40 text-green-300" :
                        u.compatibility_score >= 40 ? "bg-yellow-900/40 text-yellow-300" :
                        "bg-slate-800 text-slate-400"}`}>
                        {u.compatibility_score}%
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Users size={18} className="text-cyan-400"/> Open Teams
              </h2>
              <Link to="/find-teams" className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300">
                All <ArrowRight size={14}/>
              </Link>
            </div>
            <div className="space-y-3">
              {teams.length === 0 ? (
                <div className="card text-center text-slate-400 py-6 text-sm">No open teams yet</div>
              ) : teams.map(t => (
                <Link to={`/teams/${t.id}`} key={t.id} className="card block hover:border-cyan-500/40 transition-colors">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{t.hackathon_name || "General project"}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="badge-blue text-[10px]">
                      {DOMAIN_ICONS[t.project_domain] || "🚀"} {t.project_domain || "Mixed"}
                    </span>
                    <span className="text-slate-400 text-xs">{t.current_members}/{t.max_members} members</span>
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
