import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Zap, X } from "lucide-react";
import { INTEREST_LIST, DEPARTMENTS, YEARS, SKILL_SUGGESTIONS, DOMAIN_ICONS } from "../data/constants";

const TOTAL_STEPS = 4;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "",
    roll_number: "", institution: "", department: "", year_of_study: "",
    linkedin_url: "", commitment_level: "serious", bio: "",
    interests: [], skills: [],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleInterest = (cat) =>
    set("interests", form.interests.includes(cat)
      ? form.interests.filter(c => c !== cat)
      : [...form.interests, cat]);

  const addSkill = (name) => {
    const n = name.trim();
    if (!n || form.skills.includes(n)) return;
    set("skills", [...form.skills, n]);
    setSkillInput("");
  };

  const removeSkill = (name) => set("skills", form.skills.filter(s => s !== name));

  const next = (e) => { e.preventDefault(); setStep(s => s + 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Welcome to TeamForge! 🔥");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen page-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TeamForge</span>
          </div>
          <p className="text-slate-400 text-sm">Step {step} of {TOTAL_STEPS}</p>
          <div className="flex gap-2 justify-center mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`h-1.5 w-16 rounded-full transition-colors ${i + 1 <= step ? "bg-purple-500" : "bg-[#2A2A4A]"}`} />
            ))}
          </div>
        </div>

        <form onSubmit={step < TOTAL_STEPS ? next : handleSubmit} className="card space-y-4">

          {/* Step 1 — Basic Info */}
          {step === 1 && <>
            <h2 className="font-semibold text-lg">Basic Information</h2>
            {[
              { label: "Full Name", key: "full_name", type: "text", placeholder: "Your name", required: true },
              { label: "Email", key: "email", type: "email", placeholder: "you@college.edu", required: true },
              { label: "Phone", key: "phone", type: "tel", placeholder: "10-digit number", required: true },
              { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters", required: true },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
                <input type={f.type} required={f.required} className="input" placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
              </div>
            ))}
          </>}

          {/* Step 2 — Academic Details */}
          {step === 2 && <>
            <h2 className="font-semibold text-lg">Academic Details</h2>
            {[
              { label: "Institution / College", key: "institution", placeholder: "e.g. Anna University", required: true },
              { label: "Roll Number", key: "roll_number", placeholder: "e.g. 22CS001 (optional)" },
              { label: "LinkedIn URL", key: "linkedin_url", placeholder: "https://linkedin.com/in/..." },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
                <input type="text" required={!!f.required} className="input" placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Department</label>
                <select className="input" value={form.department} onChange={e => set("department", e.target.value)} required>
                  <option value="">Select</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Year</label>
                <select className="input" value={form.year_of_study} onChange={e => set("year_of_study", e.target.value)} required>
                  <option value="">Select</option>
                  {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Commitment Level</label>
              <div className="flex gap-2">
                {[{ val: "serious", label: "🔥 Serious" }, { val: "learning", label: "📚 Learning" }, { val: "fun", label: "😄 Fun" }].map(c => (
                  <button type="button" key={c.val} onClick={() => set("commitment_level", c.val)}
                    className={`flex-1 text-xs px-2 py-2 rounded-lg border transition-colors ${form.commitment_level === c.val ? "border-purple-500 bg-purple-900/20 text-purple-300" : "border-[#2A2A4A] text-slate-400"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Bio <span className="text-slate-600">(optional)</span></label>
              <textarea className="input resize-none" rows={2} placeholder="Tell teammates about yourself..."
                value={form.bio} onChange={e => set("bio", e.target.value)} />
            </div>
          </>}

          {/* Step 3 — Skills */}
          {step === 3 && <>
            <h2 className="font-semibold text-lg">Your Skills</h2>
            <p className="text-slate-400 text-sm">Add skills you bring to a team.</p>
            <div className="flex gap-2">
              <input className="input text-sm flex-1" placeholder="Type a skill and press Enter..."
                value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))} />
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary text-sm px-4">Add</button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.map(s => (
                  <span key={s} className="badge-purple flex items-center gap-1 text-sm">
                    {s} <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-400"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 16).map(s => (
                  <button type="button" key={s} onClick={() => addSkill(s)}
                    className="text-xs px-2 py-1 rounded-full bg-[#16213E] border border-[#2A2A4A] text-slate-400 hover:border-purple-500 hover:text-purple-300 transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </>}

          {/* Step 4 — Interests */}
          {step === 4 && <>
            <h2 className="font-semibold text-lg">Your Interests</h2>
            <p className="text-slate-400 text-sm">Pick domains you are passionate about.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTEREST_LIST.map(cat => (
                <button type="button" key={cat} onClick={() => toggleInterest(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.interests.includes(cat)
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-[#16213E] border-[#2A2A4A] text-slate-400"}`}>
                  {DOMAIN_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          </>}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">Back</button>
            )}
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {step < TOTAL_STEPS ? "Continue" : loading ? "Creating..." : "Create Profile 🚀"}
            </button>
          </div>

          {step === 1 && (
            <p className="text-center text-sm text-slate-400">
              Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
