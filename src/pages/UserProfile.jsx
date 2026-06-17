import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useProfile } from "../hooks/useProfile";
import { DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";
import { Phone, Linkedin, Globe, Zap } from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const { profile, loading } = useProfile(id);

  if (loading) return <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center text-slate-400">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <div className="card mb-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {profile.full_name?.[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl font-bold">{profile.full_name}</h1>
                  <p className="text-slate-400 text-sm">{profile.department} · Year {profile.year_of_study}</p>
                  <p className="text-slate-500 text-sm">{profile.institution}</p>
                  {profile.roll_number && <p className="text-slate-500 text-xs">#{profile.roll_number}</p>}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {profile.is_looking_for_team && <span className="badge-green text-xs">✓ Looking for team</span>}
                  <span className="badge-purple text-xs">{COMMITMENT_LABELS[profile.commitment_level]}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 text-green-400 hover:text-green-300 text-sm">
                    <Phone size={14}/> {profile.phone}
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm">
                    <Linkedin size={14}/> LinkedIn
                  </a>
                )}
                {profile.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm">
                    <Globe size={14}/> Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {profile.skills?.length > 0 && (
          <div className="card mb-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Zap size={16} className="text-yellow-400"/> Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => <span key={s.id} className="badge-purple">{s.name}</span>)}
            </div>
          </div>
        )}

        {profile.interests?.length > 0 && (
          <div className="card">
            <h2 className="font-semibold mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(i => (
                <span key={i.id} className="badge-green">
                  {DOMAIN_ICONS[i.category] || "⚡"} {i.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
