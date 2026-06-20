import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import AvatarDisplay from "../components/common/AvatarDisplay";
import AvatarBuilder from "../components/common/AvatarBuilder";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/teamService";
import toast from "react-hot-toast";
import { Edit2, Plus, X, Linkedin, Globe, Github, Pencil, BookOpen, Trophy, MapPin, Calendar, Phone } from "lucide-react";
import { SKILL_SUGGESTIONS, INTEREST_LIST, DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [skillInput, setSkillInput] = useState("");
  const [addingInterest, setAddingInterest] = useState(false);
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);

  const handleToggleAvailability = async () => {
    try {
      const res = await profileService.updateProfile({ is_looking_for_team: !user.is_looking_for_team });
      updateUser({ is_looking_for_team: res.data.is_looking_for_team });
      toast.success(user.is_looking_for_team ? "Marked as not looking" : "Now visible to recruiters!");
    } catch { toast.error("Failed to update"); }
  };

  const addSkill = async (name) => {
    if (!name.trim() || user.skills?.some(s => s.name.toLowerCase() === name.toLowerCase())) return;
    try {
      await profileService.addSkill({ name: name.trim(), level: "intermediate" });
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
    <div className="page">
      <Navbar />
      {showAvatarBuilder && <AvatarBuilder onClose={() => setShowAvatarBuilder(false)} />}

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12 space-y-4">

        {/* Profile Header Card */}
        <div className="card">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* Avatar with edit button */}
              <div className="relative group cursor-pointer" onClick={() => setShowAvatarBuilder(true)}>
                <AvatarDisplay user={user} size={72} className="avatar-ring" />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Pencil size={16} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">{user?.full_name}</h1>
                <p className="text-slate-400 text-sm mt-0.5">{user?.department} · Year {user?.year_of_study}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {user?.institution && (
                    <span className="flex items-center gap-1 text-slate-500 text-xs">
                      <MapPin size={11} /> {user.institution}
                    </span>
                  )}
                  {user?.roll_number && (
                    <span className="text-slate-600 text-xs">#{user.roll_number}</span>
                  )}
                </div>
              </div>
            </div>
            <Link to="/profile/edit" className="btn-secondary text-sm py-2 px-4">
              <Edit2 size={14} /> Edit Profile
            </Link>
          </div>

          {/* Bio */}
          {user?.bio && (
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">{user.bio}</p>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-4">
            {user?.linkedin_url && (
              <a href={user.linkedin_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {user?.portfolio_url && (
              <a href={user.portfolio_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                <Globe size={14} /> Portfolio
              </a>
            )}
            {user?.github_url && (
              <a href={user.github_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                <Github size={14} /> GitHub
              </a>
            )}
          </div>

          {/* Availability + Commitment */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06] flex-wrap">
            <button onClick={handleToggleAvailability}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${user?.is_looking_for_team ? "bg-emerald-600" : "bg-white/10"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${user?.is_looking_for_team ? "left-6" : "left-1"}`} />
            </button>
            <span className="text-sm text-slate-300">
              {user?.is_looking_for_team ? "✓ Looking for a team" : "Not looking"}
            </span>
            <span className="badge-purple">{COMMITMENT_LABELS[user?.commitment_level]}</span>
            <button onClick={() => setShowAvatarBuilder(true)}
              className="ml-auto btn-secondary text-xs py-1.5 px-3">
              <Pencil size={12} /> Edit Avatar
            </button>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <BookOpen size={15} className="text-violet-400" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {user?.skills?.map(s => (
              <span key={s.id} className="chip chip-active flex items-center gap-1.5">
                {s.name}
                <button onClick={() => removeSkill(s.id)} className="hover:text-red-400 transition-colors ml-0.5">
                  <X size={11} />
                </button>
              </span>
            ))}
            {user?.skills?.length === 0 && (
              <p className="text-slate-600 text-sm">No skills added yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <input className="input text-sm flex-1" placeholder="Type a skill and press Enter..."
              value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))} />
            <button onClick={() => addSkill(skillInput)} className="btn-primary text-sm px-4 py-2.5">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SKILL_SUGGESTIONS.filter(s => !user?.skills?.some(us => us.name === s)).slice(0, 12).map(s => (
              <button key={s} onClick={() => addSkill(s)} className="chip text-xs">+ {s}</button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <Trophy size={15} className="text-amber-400" /> Interests
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {user?.interests?.map(i => (
              <span key={i.id} className="badge-green flex items-center gap-1.5">
                {DOMAIN_ICONS[i.category] || "⚡"} {i.category}
                <button onClick={() => removeInterest(i.id)} className="hover:text-red-400 transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
            {user?.interests?.length === 0 && (
              <p className="text-slate-600 text-sm">No interests added yet</p>
            )}
          </div>
          {addingInterest ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {INTEREST_LIST.filter(c => !user?.interests?.some(i => i.category === c)).map(cat => (
                  <button key={cat} onClick={() => addInterest(cat)} className="chip text-sm">
                    {DOMAIN_ICONS[cat]} {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => setAddingInterest(false)} className="text-sm text-slate-500 hover:text-slate-400">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setAddingInterest(true)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-400 transition-colors">
              <Plus size={14} /> Add interest
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
