import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/common/Logo";
import toast from "react-hot-toast";
import { X, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { INTEREST_LIST, DEPARTMENTS, YEARS, SKILL_SUGGESTIONS, DOMAIN_ICONS } from "../data/constants";

const STEPS = ["Account", "Academic", "Skills", "Interests"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "",
    roll_number: "", institution: "", department: "", year_of_study: "",
    linkedin_url: "", commitment_level: "serious", bio: "",
    interests: [], skills: [],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleInterest = (cat) => set("interests", form.interests.includes(cat) ? form.interests.filter(c => c !== cat) : [...form.interests, cat]);
  const addSkill = (name) => { const n = name.trim(); if (!n || form.skills.includes(n)) return; set("skills", [...form.skills, n]); setSkillInput(""); };
  const removeSkill = (name) => set("skills", form.skills.filter(s => s !== name));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success("Welcome to TeamForge!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  const pwStrength = form.password.length >= 8 ? (form.password.match(/[A-Z]/) && form.password.match(/[0-9]/) ? 3 : 2) : form.password.length > 0 ? 1 : 0;

  return (
    <div className="page" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={32} />
          </div>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>
            Create your account
          </h1>
          <p className="muted">Find committed teammates for your next project</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", fontSize: 11, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < step ? "#34d399" : i === step ? "var(--accent)" : "var(--surface3)",
                  color: i <= step ? "#fff" : "var(--text3)",
                  transition: "all 0.2s"
                }}>
                  {i < step ? <Check size={11} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 500 : 400, color: i === step ? "var(--text)" : "var(--text3)" }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 1, background: i < step ? "#34d399" : "var(--border2)" }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>

            {/* Step 0 — Account */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Full name</label>
                  <input className="input" placeholder="Your full name" required value={form.full_name} onChange={e => set("full_name", e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Email</label>
                  <input type="email" className="input" placeholder="you@college.edu" required value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Phone</label>
                  <input type="tel" className="input" placeholder="10-digit number" required value={form.phone} onChange={e => set("phone", e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} className="input" placeholder="Min 6 characters"
                      required style={{ paddingRight: 40 }} value={form.password} onChange={e => set("password", e.target.value)} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", padding: 0 }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {form.password.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                      {[1, 2, 3].map(l => (
                        <div key={l} style={{
                          flex: 1, height: 3, borderRadius: 99,
                          background: l <= pwStrength ? (pwStrength === 3 ? "#34d399" : pwStrength === 2 ? "#fbbf24" : "#f87171") : "var(--surface3)",
                          transition: "background 0.2s"
                        }} />
                      ))}
                      <span style={{ fontSize: 11, color: pwStrength === 3 ? "#34d399" : pwStrength === 2 ? "#fbbf24" : "#f87171", marginLeft: 4 }}>
                        {["", "Weak", "Good", "Strong"][pwStrength]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1 — Academic */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Institution</label>
                  <input className="input" placeholder="e.g. Anna University" required value={form.institution} onChange={e => set("institution", e.target.value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Department</label>
                    <select className="input" required value={form.department} onChange={e => set("department", e.target.value)}>
                      <option value="">Select</option>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Year</label>
                    <select className="input" required value={form.year_of_study} onChange={e => set("year_of_study", e.target.value)}>
                      <option value="">Select</option>
                      {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Roll number <span style={{ color: "var(--text3)" }}>(optional)</span></label>
                  <input className="input" placeholder="e.g. 22CS001" value={form.roll_number} onChange={e => set("roll_number", e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>LinkedIn <span style={{ color: "var(--text3)" }}>(optional)</span></label>
                  <input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={e => set("linkedin_url", e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Commitment level</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[{ val: "serious", label: "🔥 Serious" }, { val: "learning", label: "📚 Learning" }, { val: "fun", label: "😄 Fun" }].map(c => (
                      <button type="button" key={c.val} onClick={() => set("commitment_level", c.val)}
                        style={{
                          flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: 12, fontWeight: 450,
                          border: `1px solid ${form.commitment_level === c.val ? "rgba(91,91,214,0.5)" : "var(--border)"}`,
                          background: form.commitment_level === c.val ? "rgba(91,91,214,0.1)" : "var(--surface2)",
                          color: form.commitment_level === c.val ? "#a5b4fc" : "var(--text2)",
                          cursor: "pointer", transition: "all 0.12s", fontFamily: "inherit"
                        }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>Bio <span style={{ color: "var(--text3)" }}>(optional)</span></label>
                  <textarea className="input" placeholder="Tell teammates about yourself..." rows={2}
                    value={form.bio} onChange={e => set("bio", e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 2 — Skills */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14 }}>Add technical skills you bring to a team.</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="input" style={{ flex: 1 }} placeholder="e.g. React, Python..."
                      value={skillInput} onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))} />
                    <button type="button" onClick={() => addSkill(skillInput)} className="btn btn-secondary" style={{ flexShrink: 0 }}>Add</button>
                  </div>
                </div>
                {form.skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {form.skills.map(s => (
                      <span key={s} className="badge-purple" style={{ cursor: "default" }}>
                        {s}
                        <button type="button" onClick={() => removeSkill(s)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", display: "flex", marginLeft: 2 }}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div>
                  <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>Quick add</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 16).map(s => (
                      <button type="button" key={s} onClick={() => addSkill(s)} className="chip" style={{ fontSize: 12 }}>
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Interests */}
            {step === 3 && (
              <div>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Pick domains you're passionate about.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {INTEREST_LIST.map(cat => (
                    <button type="button" key={cat} onClick={() => toggleInterest(cat)}
                      className={`chip ${form.interests.includes(cat) ? "chip-active" : ""}`}
                      style={{ fontSize: 12 }}>
                      {DOMAIN_ICONS[cat]} {cat}
                      {form.interests.includes(cat) && <Check size={11} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="btn btn-secondary" style={{ flex: 1, height: 40 }}>
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, height: 40, fontSize: 14 }}>
                {step < STEPS.length - 1 ? <>Continue <ArrowRight size={14} /></> : loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </div>

        {step === 0 && (
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text3)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
