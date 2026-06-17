import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/teamService";
import toast from "react-hot-toast";
import { Edit2, Plus, X, Linkedin, Globe, Trophy, BookOpen } from "lucide-react";
import { SKILL_SUGGESTIONS, INTEREST_LIST, DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [skillInput, setSkillInput] = useState("");
  const [addingInterest, setAddingInterest] = useState(false);

  const handleToggleAvailability = async () => {
    try {
      const res = await profileService.updateProfile({ is_looking_for_team: !user.is_looking_for_team });
      updateUser({ is_looking_for_team: res.data.is_looking_for_team });
      toast.success("Availability updated!");
    } catch { toast.error("Failed to update"); }
  };

  const addSkill = async (name) => {
    if (!name.trim()) return;
    try {
      await profileService.addSkill({ name, level: "intermediate" });
      const me = await profileService.getMyProfile();
      updateUser(me.data);
      setSkillInput("");
    } catch { toast.error("Failed to add skill"); }
  };

  const removeSkill = async (id) => {
    try {
      await profileService.deleteSkill(id);
      updateUser({ skills: user.skills.filter(s => s.id !== id) });
    } catch { toast.error("Failed to remove skill"); }
  };

  const addInterest = async (category) => {
    try {
      await profileService.addInterest({ category });
      const me = await profileService.getMyProfile();
      updateUser(me.data);
      setAddingInterest(false);
    } catch { toast.error("Failed to add interest"); }
  };

  const removeInterest = async (id) => {
    try {
      await profileService.deleteInterest(id);
      updateUser({ interests: user.interests.filter(i => i.id !== id) });
    } catch { toast.error("Failed to remove interest"); }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <div className="card mb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white">
                {user?.full_name?.[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold">{user?.full_name}</h1>
                <p className="text-slate-400 text-sm">{user?.department} · Year {user?.year_of_study}</p>
                <p className="text-slate-500 text-sm">{user?.institution}</p>
                {user?.roll_number && <p className="text-slate-500 text-xs mt-0.5">#{user.roll_number}</p>}
              </div>
            </div>
            <Link to="/profile/edit" className="btn-secondary flex items-center gap-2 text-sm">
              <Edit2 size={14}/> Edit Profile
            </Link>
          </div>
          <div className="flex gap-3 mt-4">
            {user?.linkedin_url && (
              <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm">
                <Linkedin size={16}/> LinkedIn
              </a>
            )}
            {user?.portfolio_url && (
              <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm">
                <Globe size={16}/> Portfolio
              </a>
            )}
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#2A2A4A]">
            <button onClick={handleToggleAvailability}
              className={`relative w-12 h-6 rounded-full transition-colors ${user?.is_looking_for_team ? "bg-green-600" : "bg-slate-600"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${user?.is_looking_for_team ? "left-7" : "left-1"}`}/>
            </button>
            <span className="text-sm text-slate-300">{user?.is_looking_for_team ? "✓ Looking for a team" : "Not looking for a team"}</span>
            <span className="badge-purple ml-2">{COMMITMENT_LABELS[user?.commitment_level]}</span>
          </div>
        </div>

        <div className="card mb-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={16} className="text-purple-400"/> Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {user?.skills?.map(s => (
              <span key={s.id} className="badge-purple flex items-center gap-1">
                {s.name} <button onClick={() => removeSkill(s.id)} className="hover:text-red-400"><X size={12}/></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" placeholder="Add a skill..."
              value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}/>
            <button onClick={() => addSkill(skillInput)} className="btn-secondary text-sm px-4">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SKILL_SUGGESTIONS.filter(s => !user?.skills?.some(us => us.name === s)).slice(0, 10).map(s => (
              <button key={s} onClick={() => addSkill(s)}
                className="text-xs px-2 py-1 rounded-full bg-[#16213E] border border-[#2A2A4A] text-slate-400 hover:border-slate-500">
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Trophy size={16} className="text-yellow-400"/> Interests</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {user?.interests?.map(i => (
              <span key={i.id} className="badge-green flex items-center gap-1">
                {DOMAIN_ICONS[i.category] || "⚡"} {i.category}
                <button onClick={() => removeInterest(i.id)} className="hover:text-red-400"><X size={12}/></button>
              </span>
            ))}
          </div>
          {addingInterest ? (
            <div className="flex flex-wrap gap-2">
              {INTEREST_LIST.filter(c => !user?.interests?.some(i => i.category === c)).map(cat => (
                <button key={cat} onClick={() => addInterest(cat)}
                  className="text-sm px-3 py-1.5 rounded-full bg-[#16213E] border border-[#2A2A4A] text-slate-400 hover:border-purple-500 hover:text-purple-300 transition-colors">
                  {DOMAIN_ICONS[cat]} {cat}
                </button>
              ))}
              <button onClick={() => setAddingInterest(false)} className="text-sm text-slate-500 px-2">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setAddingInterest(true)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors">
              <Plus size={16}/> Add interest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
