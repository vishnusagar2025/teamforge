import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { searchService, teamService } from "../services/teamService";
import { Users, Plus, Search } from "lucide-react";
import { INTEREST_LIST, DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";
import toast from "react-hot-toast";

export default function FindTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState("");
  const [hackathon, setHackathon] = useState("");

  const doSearch = async () => {
    setLoading(true);
    try { const res = await searchService.searchTeams({ domain, hackathon }); setTeams(res.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { doSearch(); }, []);

  const handleJoin = async (e, teamId) => {
    e.preventDefault();
    try { await teamService.requestToJoin(teamId); toast.success("Join request sent!"); }
    catch (err) { toast.error(err.response?.data?.error || "Could not send request"); }
  };

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Find Teams</h1>
          <Link to="/teams/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16}/> Create Team
          </Link>
        </div>

        <div className="card mb-6 flex flex-col sm:flex-row gap-3">
          <select className="input text-sm flex-1" value={domain} onChange={e => setDomain(e.target.value)}>
            <option value="">All Domains</option>
            {INTEREST_LIST.map(i => <option key={i}>{i}</option>)}
          </select>
          <input className="input text-sm flex-1" placeholder="Hackathon name..." value={hackathon}
            onChange={e => setHackathon(e.target.value)}/>
          <button onClick={doSearch} className="btn-primary flex items-center gap-2">
            <Search size={16}/> Search
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-20">
            <Users size={40} className="text-slate-600 mx-auto mb-4"/>
            <p className="text-slate-400">No open teams found.</p>
            <Link to="/teams/new" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus size={16}/> Create the first one
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {teams.map(t => (
              <div key={t.id} className="card hover:border-cyan-500/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{t.name}</h3>
                    {t.hackathon_name && <p className="text-purple-400 text-sm">🏆 {t.hackathon_name}</p>}
                  </div>
                  <span className="badge-blue text-xs">
                    {DOMAIN_ICONS[t.project_domain] || "🚀"} {t.project_domain || "General"}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{t.description || "No description"}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span>👤 {t.leader?.full_name?.split(" ")[0]}</span>
                  <span>🏫 {t.institution || "Any"}</span>
                  <span>{COMMITMENT_LABELS[t.commitment_level]}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#2A2A4A]">
                  <div className="flex gap-1 items-center">
                    {Array.from({ length: t.max_members }).map((_, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full border-2 ${
                        i < t.current_members ? "bg-purple-600 border-purple-500" : "page-bg border-[#2A2A4A]"}`}/>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">{t.max_members - t.current_members} slots open</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/teams/${t.id}`} className="btn-secondary text-xs px-3 py-1.5">View</Link>
                    {t.current_members < t.max_members && (
                      <button onClick={e => handleJoin(e, t.id)} className="btn-primary text-xs px-3 py-1.5">
                        Request Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
