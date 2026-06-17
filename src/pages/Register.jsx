import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Zap } from "lucide-react";
import { INTEREST_LIST, DEPARTMENTS, YEARS } from "../data/constants";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name:"", email:"", phone:"", password:"",
    roll_number:"", institution:"", department:"", year_of_study:"",
    linkedin_url:"", commitment_level:"serious", interests:[],
  });

  const set = (k, v) => setForm(p => ({...p, [k]: v}));
  const toggleInterest = (cat) => {
    set("interests", form.interests.includes(cat)
      ? form.interests.filter(c => c !== cat)
      : [...form.interests, cat]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Welcome to TeamForge!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white"/>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TeamForge</span>
          </div>
          <p className="text-slate-400 text-sm">Step {step} of 3</p>
          <div className="flex gap-2 justify-center mt-4">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1.5 w-20 rounded-full transition-colors ${s <= step ? "bg-purple-500" : "bg-[#2A2A4A]"}`}/>
            ))}
          </div>
        </div>

        <form onSubmit={step < 3 ? (e) => { e.preventDefault(); setStep(s => s+1); } : handleSubmit} className="card space-y-4">
          {step === 1 && <>
            <h2 className="font-semibold text-lg">Basic Information</h2>
            {[
              {label:"Full Name", key:"full_name", type:"text", placeholder:"Your name"},
              {label:"Email", key:"email", type:"email", placeholder:"you@college.edu"},
              {label:"Phone", key:"phone", type:"tel", placeholder:"10-digit number"},
              {label:"Password", key:"password", type:"password", placeholder:"Min 6 characters"},
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
                <input type={f.type} required className="input" placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => set(f.key, e.target.value)}/>
              </div>
            ))}
          </>}

          {step === 2 && <>
            <h2 className="font-semibold text-lg">Academic Details</h2>
            {[
              {label:"Institution / College", key:"institution", placeholder:"e.g. Anna University"},
              {label:"Roll Number", key:"roll_number", placeholder:"e.g. 22CS001"},
              {label:"LinkedIn URL", key:"linkedin_url", placeholder:"https://linkedin.com/in/..."},
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
                <input type="text" className="input" placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => set(f.key, e.target.value)}/>
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
                {[{val:"serious",label:"🔥 Serious"},{val:"learning",label:"📚 Learning"},{val:"fun",label:"😄 Fun"}].map(c => (
                  <button type="button" key={c.val} onClick={() => set("commitment_level", c.val)}
                    className={`flex-1 text-xs px-2 py-2 rounded-lg border transition-colors ${
                      form.commitment_level === c.val ? "border-purple-500 bg-purple-900/20 text-purple-300" : "border-[#2A2A4A] text-slate-400"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </>}

          {step === 3 && <>
            <h2 className="font-semibold text-lg">Your Interests</h2>
            <p className="text-slate-400 text-sm">Pick domains you are passionate about.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {INTEREST_LIST.map(cat => (
                <button type="button" key={cat} onClick={() => toggleInterest(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    form.interests.includes(cat)
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-[#16213E] border-[#2A2A4A] text-slate-400"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </>}

          <div className="flex gap-3 pt-2">
            {step > 1 && <button type="button" onClick={() => setStep(s => s-1)} className="btn-secondary flex-1">Back</button>}
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {step < 3 ? "Continue" : loading ? "Creating..." : "Create Profile"}
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
