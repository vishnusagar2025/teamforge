import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { searchService } from "../services/teamService";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { INTEREST_LIST, DEPARTMENTS, YEARS, DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";
import { useAuth } from "../context/AuthContext";

export default function FindPeople() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    institution: user?.institution || "", department: "", year: "", interest: "", commitment: "",
  });

  const doSearch = async () => {
    setLoading(true);
    try { const res = await searchService.searchUsers(filters); setUsers(res.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { doSearch(); }, []);
  const setF = (k, v) => setFilters(p => ({...p, [k]: v}));

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Find Teammates</h1>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2 text-sm">
            <SlidersHorizontal size={16}/> Filters
          </button>
        </div>

        {showFilters && (
          <div className="card mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Institution</label>
              <input className="input text-sm" placeholder="Your college..." value={filters.institution}
                onChange={e => setF("institution", e.target.value)}/>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <select className="input text-sm" value={filters.department} onChange={e => setF("department", e.target.value)}>
                <option value="">All</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Year</label>
              <select className="input text-sm" value={filters.year} onChange={e => setF("year", e.target.value)}>
                <option value="">All years</option>
                {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Interest Domain</label>
              <select className="input text-sm" value={filters.interest} onChange={e => setF("interest", e.target.value)}>
                <option value="">All domains</option>
                {INTEREST_LIST.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Commitment</label>
              <select className="input text-sm" value={filters.commitment} onChange={e => setF("commitment", e.target.value)}>
                <option value="">Any</option>
                <option value="serious">🔥 Serious</option>
                <option value="learning">📚 Learning</option>
                <option value="fun">😄 Fun</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={doSearch} className="btn-primary text-sm flex-1">Search</button>
              <button onClick={() => setFilters({ institution:"", department:"", year:"", interest:"", commitment:"" })}
                className="btn-secondary p-2.5"><X size={16}/></button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-slate-400 py-20">Searching...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-slate-400 py-20">No users found. Try different filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => (
              <Link to={`/users/${u.id}`} key={u.id} className="card hover:border-purple-500/50 transition-colors group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {u.full_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{u.full_name}</p>
                    <p className="text-slate-400 text-xs">{u.department}</p>
                    <p className="text-slate-500 text-xs">{u.institution}</p>
                  </div>
                  {u.compatibility_score != null && (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                      u.compatibility_score >= 70 ? "bg-green-900/40 text-green-300 border-green-700/50" :
                      u.compatibility_score >= 40 ? "bg-yellow-900/40 text-yellow-300 border-yellow-700/50" :
                      "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {u.compatibility_score}%
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {u.interests?.slice(0, 3).map(i => (
                    <span key={i.id} className="badge-purple text-[10px]">
                      {DOMAIN_ICONS[i.category] || "⚡"} {i.category}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#2A2A4A]">
                  <span className="text-xs text-slate-400">Year {u.year_of_study}</span>
                  <span className="text-xs text-slate-400">{COMMITMENT_LABELS[u.commitment_level]}</span>
                  {u.is_looking_for_team && <span className="badge-green text-[10px]">✓ Available</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
