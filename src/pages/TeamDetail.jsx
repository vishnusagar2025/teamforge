import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { teamService, aiService } from "../services/teamService";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Trophy, Building2, Zap, Heart } from "lucide-react";
import { DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";

export default function TeamDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [health, setHealth] = useState(null);

  useEffect(() => {
    teamService.getTeam(id).then(res => setTeam(res.data)).catch(() => toast.error("Team not found")).finally(() => setLoading(false));
    aiService.getTeamHealth(id).then(res => setHealth(res.data)).catch(() => {});
  }, [id]);

  const handleJoin = async () => {
    try { await teamService.requestToJoin(id); toast.success("Join request sent!"); }
    catch (err) { toast.error(err.response?.data?.error || "Error"); }
  };

  const handleAccept = async (memberId) => {
    try { const res = await teamService.acceptMember(id, memberId); setTeam(res.data); toast.success("Member added!"); }
    catch (err) { toast.error(err.response?.data?.error || "Error"); }
  };

  if (loading) return <div className="min-h-screen page-bg flex items-center justify-center text-slate-400">Loading...</div>;
  if (!team) return null;

  const isLeader = user?.id === team.leader?.id;
  const isMember = team.members?.some(m => m.id === user?.id);
  const slotsLeft = team.max_members - team.current_members;

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="card mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{team.name}</h1>
              {team.hackathon_name && <p className="text-purple-400 flex items-center gap-2"><Trophy size={16}/> {team.hackathon_name}</p>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {team.project_domain && <span className="badge-blue">{DOMAIN_ICONS[team.project_domain] || "🚀"} {team.project_domain}</span>}
              <span className="badge-purple">{COMMITMENT_LABELS[team.commitment_level]}</span>
              {team.is_open ? <span className="badge-green">✓ Open</span> : <span className="badge bg-red-900/40 text-red-300 border border-red-700/50">Closed</span>}
            </div>
          </div>
          {team.description && <p className="text-slate-400 mt-4">{team.description}</p>}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
            {team.institution && <span className="flex items-center gap-1.5"><Building2 size={14}/> {team.institution}</span>}
          </div>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: team.max_members }).map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${
                i < team.current_members ? "bg-purple-600 border-purple-500 text-white font-bold" : "page-bg border-[#2A2A4A] text-slate-600"}`}>
                {i < team.current_members ? "✓" : "+"}
              </div>
            ))}
            {slotsLeft > 0 && <span className="text-sm text-slate-400 self-center ml-1">{slotsLeft} slot{slotsLeft > 1 ? "s" : ""} open</span>}
          </div>
          {!isMember && team.is_open && slotsLeft > 0 && (
            <button onClick={handleJoin} className="btn-primary mt-5 flex items-center gap-2">
              <Zap size={16}/> Request to Join
            </button>
          )}
          {isMember && !isLeader && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/20 text-green-300 border border-green-700/50 text-sm">
              ✓ You are in this team
            </div>
          )}
        </div>

        {health && (
          <div className="card mb-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Heart size={16} className="text-rose-400" /> Team Health Score
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <div className={`text-4xl font-extrabold ${
                health.health_score >= 70 ? "text-emerald-400" :
                health.health_score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                {health.health_score}
              </div>
              <div className="flex-1">
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    health.health_score >= 70 ? "bg-emerald-500" :
                    health.health_score >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${health.health_score}%` }} />
                </div>
                <p className="text-slate-500 text-xs mt-1">out of 100</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(health.breakdown || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between px-3 py-1.5 rounded-lg bg-white/[0.03]">
                  <span className="text-slate-400 capitalize">{key.replace("_", " ")}</span>
                  <span className="text-slate-200 font-medium">{val}</span>
                </div>
              ))}
            </div>
            {health.skill_gaps?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1.5">Missing skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {health.skill_gaps.map(g => (
                    <span key={g} className="badge-red text-[10px]">{g}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card mb-6">
          <h2 className="font-semibold text-lg mb-4">Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.members?.map(m => (
              <Link to={`/users/${m.id}`} key={m.id}
                className="flex items-center gap-3 p-3 rounded-xl page-bg border border-[#2A2A4A] hover:border-purple-500/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                  {m.full_name?.[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {m.full_name}
                    {m.id === team.leader?.id && <span className="ml-2 badge-yellow text-[10px]">Leader</span>}
                  </p>
                  <p className="text-slate-400 text-xs">{m.department} · Year {m.year_of_study}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {Array.isArray(team.required_skills) && team.required_skills.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-lg mb-3">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {team.required_skills.map(s => <span key={s} className="badge-purple">{s}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
