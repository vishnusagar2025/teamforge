import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { projectService } from "../services/teamService";
import toast from "react-hot-toast";
import { INTEREST_LIST, SKILL_SUGGESTIONS } from "../data/constants";
import { X } from "lucide-react";

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState({
    title:"", description:"", domain:"", tech_stack:[],
    github_url:"", demo_url:"", status:"planning", is_looking_for_members:true,
  });

  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const addTech = (t) => { if (t && !form.tech_stack.includes(t)) set("tech_stack", [...form.tech_stack, t]); setTechInput(""); };
  const removeTech = (t) => set("tech_stack", form.tech_stack.filter(x => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await projectService.createProject(form); toast.success("Project added!"); navigate("/projects"); }
    catch { toast.error("Failed to create project"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Add Project</h1>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Project Title *</label>
            <input className="input" required value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Smart Attendance System"/>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="What does this project do?"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Domain</label>
              <select className="input" value={form.domain} onChange={e => set("domain", e.target.value)}>
                <option value="">Select</option>
                {INTEREST_LIST.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Status</label>
              <select className="input" value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="planning">Planning</option>
                <option value="building">Building</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input className="input text-sm flex-1" placeholder="Add technology..."
                value={techInput} onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech(techInput))}/>
              <button type="button" onClick={() => addTech(techInput)} className="btn-secondary text-sm px-4">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tech_stack.map(t => (
                <span key={t} className="badge-purple text-xs flex items-center gap-1">
                  {t} <button type="button" onClick={() => removeTech(t)}><X size={12}/></button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SKILL_SUGGESTIONS.filter(s => !form.tech_stack.includes(s)).slice(0, 10).map(s => (
                <button type="button" key={s} onClick={() => addTech(s)}
                  className="text-xs px-2 py-1 rounded-full bg-[#16213E] border border-[#2A2A4A] text-slate-400 hover:border-slate-500">
                  + {s}
                </button>
              ))}
            </div>
          </div>
          {[{label:"GitHub URL", key:"github_url"},{label:"Demo URL", key:"demo_url"}].map(f => (
            <div key={f.key}>
              <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
              <input type="url" className="input" value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder="https://..."/>
            </div>
          ))}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_looking_for_members}
              onChange={e => set("is_looking_for_members", e.target.checked)} className="w-4 h-4 accent-purple-500"/>
            <span className="text-sm text-slate-300">Looking for collaborators</span>
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Saving..." : "Add Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
