import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { teamService } from "../services/teamService";
import toast from "react-hot-toast";
import { INTEREST_LIST, SKILL_SUGGESTIONS } from "../data/constants";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function CreateTeam() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    name:"", description:"", institution: user?.institution || "",
    max_members:4, hackathon_name:"", project_domain:"",
    required_skills:[], commitment_level:"serious",
  });

  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const addSkill = (s) => { if (s && !form.required_skills.includes(s)) set("required_skills", [...form.required_skills, s]); setSkillInput(""); };
  const removeSkill = (s) => set("required_skills", form.required_skills.filter(r => r !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Team name is required");
    setLoading(true);
    try {
      const res = await teamService.createTeam(form);
      toast.success("Team created!");
      navigate(`/teams/${res.data.id}`);
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Create a Team</h1>
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Team Name *</label>
            <input className="input" placeholder="e.g. Code Crusaders" required
              value={form.name} onChange={e => set("name", e.target.value)}/>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="What are you building?"
              value={form.description} onChange={e => set("description", e.target.value)}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Hackathon / Event</label>
              <input className="input" placeholder="e.g. SIH 2024"
                value={form.hackathon_name} onChange={e => set("hackathon_name", e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Project Domain</label>
              <select className="input" value={form.project_domain} onChange={e => set("project_domain", e.target.value)}>
                <option value="">Select domain</option>
                {INTEREST_LIST.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Institution</label>
              <input className="input" placeholder="Your college"
                value={form.institution} onChange={e => set("institution", e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Max Members</label>
              <select className="input" value={form.max_members} onChange={e => set("max_members", parseInt(e.target.value))}>
                {[2,3,4,5,6].map(n => <option key={n} value={n}>{n} members</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input className="input text-sm flex-1" placeholder="Type a skill..."
                value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}/>
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary text-sm px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.required_skills.map(s => (
                <span key={s} className="badge-purple flex items-center gap-1">
                  {s} <button type="button" onClick={() => removeSkill(s)}><X size={12}/></button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_SUGGESTIONS.filter(s => !form.required_skills.includes(s)).slice(0, 10).map(s => (
                <button type="button" key={s} onClick={() => addSkill(s)}
                  className="text-xs px-2 py-1 rounded-full bg-[#16213E] border border-[#2A2A4A] text-slate-400 hover:border-slate-500">
                  + {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Commitment Level</label>
            <div className="flex gap-3">
              {[{val:"serious",label:"🔥 Serious"},{val:"learning",label:"📚 Learning"},{val:"fun",label:"😄 Fun"}].map(c => (
                <button type="button" key={c.val} onClick={() => set("commitment_level", c.val)}
                  className={`flex-1 py-2 rounded-xl border text-sm transition-colors ${
                    form.commitment_level === c.val ? "border-purple-500 bg-purple-900/20 text-purple-300" : "border-[#2A2A4A] text-slate-400"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </div>
  );
}
