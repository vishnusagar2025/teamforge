import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/common/Logo";
import toast from "react-hot-toast";
import { X, Eye, EyeOff, ArrowRight, Check, AlertCircle, Zap } from "lucide-react";
import { INTEREST_LIST, DEPARTMENTS, YEARS, SKILL_SUGGESTIONS, DOMAIN_ICONS } from "../data/constants";

const STEPS = ["Account", "Academic", "Skills", "Interests"];
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function getPwStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8)  s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: "Too weak",    color: "#ef4444" };
  if (s === 2) return { score: 2, label: "Weak",       color: "#f97316" };
  if (s === 3) return { score: 3, label: "Fair",       color: "#eab308" };
  if (s === 4) return { score: 4, label: "Strong",     color: "#22c55e" };
  return             { score: 5, label: "Very strong", color: "#10b981" };
}

function Err({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontSize: 12, color: "#f87171" }}>
      <AlertCircle size={12} />{msg}
    </div>
  );
}

function Label({ children }) {
  return <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>{children}</label>;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [slowMsg, setSlowMsg] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [errs, setErrs] = useState({});
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", confirm_password: "",
    roll_number: "", institution: "", department: "", year_of_study: "",
    linkedin_url: "", commitment_level: "serious", bio: "",
    interests: [], skills: [],
  });

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrs(e => ({ ...e, [k]: "" })); };
  const toggleInterest = (cat) => set("interests", form.interests.includes(cat) ? form.interests.filter(c => c !== cat) : [...form.interests, cat]);
  const addSkill = (n) => { const t = n.trim(); if (!t || form.skills.includes(t)) return; set("skills", [...form.skills, t]); setSkillInput(""); };
  const removeSkill = (n) => set("skills", form.skills.filter(s => s !== n));

  // Show waking-up message on slow submit (Render free tier cold start)
  useEffect(() => {
    let t;
    if (loading) {
      t = setTimeout(() => setSlowMsg("Connecting to server..."), 4000);
    } else { setSlowMsg(""); }
    return () => clearTimeout(t);
  }, [loading]);

  const pw = getPwStrength(form.password);

  const validate0 = () => {
    const e = {};
    if (form.full_name.trim().length < 2)          e.full_name = "Enter your full name";
    if (!EMAIL_RE.test(form.email.trim()))          e.email = "Enter a valid email address";
    if (!/^[0-9]{10,15}$/.test(form.phone.replace(/[\s\-()]/g, ""))) e.phone = "Enter a valid 10-digit phone number";
    if (form.password.length < 8)                  e.password = "Password must be at least 8 characters";
    if (!/[A-Za-z]/.test(form.password))           e.password = "Password must include a letter";
    if (!/[0-9]/.test(form.password))              e.password = "Password must include a number";
    if (pw.score < 2)                              e.password = "Password is too weak";
    if (form.password !== form.confirm_password)   e.confirm_password = "Passwords do not match";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const validate1 = () => {
    const e = {};
    if (!form.institution.trim()) e.institution = "Institution is required";
    if (!form.department)         e.department  = "Department is required";
    if (!form.year_of_study)      e.year_of_study = "Year is required";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 0 && !validate0()) return;
    if (step === 1 && !validate1()) return;
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = form;
      await register(payload);
      toast.success("Welcome to TeamForge! 🎉");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("email"))    setErrs({ email: msg });
      else if (msg.toLowerCase().includes("phone")) setErrs({ phone: msg });
    } finally { setLoading(false); }
  };

  const borderErr = (f) => errs[f] ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.1)" } : {};

  return (
    <div className="page" style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Logo size={32} /></div>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>Create your account</h1>
          <p className="muted">Find committed teammates for your next project</p>
        </div>

        {/* Step bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", fontSize: 11, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                  background: i < step ? "#22c55e" : i === step ? "var(--accent)" : "var(--surface3)",
                  color: i <= step ? "#fff" : "var(--text3)",
                }}>
                  {i < step ? <Check size={11} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: i === step ? 500 : 400, color: i === step ? "var(--text)" : "var(--text3)" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 16, height: 1, background: i < step ? "#22c55e" : "var(--border2)" }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>

            {/* ── STEP 0: Account ── */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <Label>Full name</Label>
                  <input className="input" placeholder="Your full name" value={form.full_name}
                    onChange={e => set("full_name", e.target.value)} style={borderErr("full_name")} />
                  <Err msg={errs.full_name} />
                </div>

                <div>
                  <Label>Email address</Label>
                  <input type="email" className="input" placeholder="you@college.edu" value={form.email}
                    onChange={e => set("email", e.target.value)} style={borderErr("email")} />
                  <Err msg={errs.email} />
                </div>

                <div>
                  <Label>Phone number</Label>
                  <input type="tel" className="input" placeholder="10-digit number" value={form.phone}
                    onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 15))}
                    style={borderErr("phone")} />
                  <Err msg={errs.phone} />
                </div>

                <div>
                  <Label>Password</Label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} className="input"
                      placeholder="Min 8 chars, include number" style={{ paddingRight: 40, ...borderErr("password") }}
                      value={form.password} onChange={e => set("password", e.target.value)} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", padding: 0 }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {form.password.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {/* Strength bars */}
                      <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
                        {[1,2,3,4,5].map(l => (
                          <div key={l} style={{ flex: 1, height: 3, borderRadius: 99, transition: "background 0.2s", background: l <= pw.score ? pw.color : "var(--surface3)" }} />
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: pw.color, fontWeight: 500 }}>{pw.label}</span>
                      </div>
                      {/* Requirements checklist */}
                      <div style={{ marginTop: 8, background: "var(--surface2)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                          { ok: form.password.length >= 8,         text: "At least 8 characters" },
                          { ok: /[A-Za-z]/.test(form.password),    text: "Contains a letter" },
                          { ok: /[0-9]/.test(form.password),       text: "Contains a number" },
                          { ok: /[^A-Za-z0-9]/.test(form.password),text: "Contains a symbol (!@#...)" },
                        ].map(r => (
                          <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: r.ok ? "#22c55e" : "var(--text3)" }}>
                            <Check size={11} style={{ opacity: r.ok ? 1 : 0.25 }} />{r.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Err msg={errs.password} />
                </div>

                <div>
                  <Label>Confirm password</Label>
                  <div style={{ position: "relative" }}>
                    <input type={showCPw ? "text" : "password"} className="input"
                      placeholder="Re-enter your password"
                      style={{ paddingRight: 40, ...borderErr("confirm_password") }}
                      value={form.confirm_password} onChange={e => set("confirm_password", e.target.value)} />
                    <button type="button" onClick={() => setShowCPw(!showCPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", padding: 0 }}>
                      {showCPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    {form.confirm_password.length > 0 && form.password === form.confirm_password && (
                      <Check size={13} style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", color: "#22c55e" }} />
                    )}
                  </div>
                  <Err msg={errs.confirm_password} />
                </div>
              </div>
            )}

            {/* ── STEP 1: Academic ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <Label>Institution / College</Label>
                  <input className="input" placeholder="e.g. Anna University" value={form.institution}
                    onChange={e => set("institution", e.target.value)} style={borderErr("institution")} />
                  <Err msg={errs.institution} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <Label>Department</Label>
                    <select className="input" value={form.department} onChange={e => set("department", e.target.value)} style={borderErr("department")}>
                      <option value="">Select</option>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <Err msg={errs.department} />
                  </div>
                  <div>
                    <Label>Year</Label>
                    <select className="input" value={form.year_of_study} onChange={e => set("year_of_study", e.target.value)} style={borderErr("year_of_study")}>
                      <option value="">Select</option>
                      {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                    <Err msg={errs.year_of_study} />
                  </div>
                </div>
                <div>
                  <Label>Roll number <span style={{ color: "var(--text3)" }}>(optional)</span></Label>
                  <input className="input" placeholder="e.g. 22CS001" value={form.roll_number} onChange={e => set("roll_number", e.target.value)} />
                </div>
                <div>
                  <Label>LinkedIn <span style={{ color: "var(--text3)" }}>(optional)</span></Label>
                  <input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={e => set("linkedin_url", e.target.value)} />
                </div>
                <div>
                  <Label>Commitment level</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[{ val: "serious", label: "🔥 Serious" }, { val: "learning", label: "📚 Learning" }, { val: "fun", label: "😄 Fun" }].map(c => (
                      <button type="button" key={c.val} onClick={() => set("commitment_level", c.val)} style={{
                        flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 450, fontFamily: "inherit", cursor: "pointer", transition: "all 0.12s",
                        border: `1px solid ${form.commitment_level === c.val ? "rgba(91,91,214,0.5)" : "var(--border)"}`,
                        background: form.commitment_level === c.val ? "rgba(91,91,214,0.1)" : "var(--surface2)",
                        color: form.commitment_level === c.val ? "#a5b4fc" : "var(--text2)",
                      }}>{c.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Bio <span style={{ color: "var(--text3)" }}>(optional)</span></Label>
                  <textarea className="input" placeholder="Tell teammates about yourself..." rows={2}
                    value={form.bio} onChange={e => set("bio", e.target.value)} />
                </div>
              </div>
            )}

            {/* ── STEP 2: Skills ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 13, color: "var(--text2)" }}>Add technical skills you bring to a team.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="input" style={{ flex: 1 }} placeholder="e.g. React, Python..."
                    value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))} />
                  <button type="button" onClick={() => addSkill(skillInput)} className="btn btn-secondary">Add</button>
                </div>
                {form.skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {form.skills.map(s => (
                      <span key={s} className="badge-purple">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", display: "flex", marginLeft: 2 }}>
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
                      <button type="button" key={s} onClick={() => addSkill(s)} className="chip" style={{ fontSize: 12 }}>+ {s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Interests ── */}
            {step === 3 && (
              <div>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>Pick domains you're passionate about.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {INTEREST_LIST.map(cat => (
                    <button type="button" key={cat} onClick={() => toggleInterest(cat)}
                      className={`chip ${form.interests.includes(cat) ? "chip-active" : ""}`} style={{ fontSize: 12 }}>
                      {DOMAIN_ICONS[cat]} {cat} {form.interests.includes(cat) && <Check size={11} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="btn btn-secondary" style={{ flex: 1, height: 40 }}>Back</button>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, height: 40, fontSize: 14 }}>
                {step < STEPS.length - 1 ? <>Continue <ArrowRight size={14} /></> : loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          {/* Cold start warning */}
          {slowMsg && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 8,
              background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)",
              display: "flex", alignItems: "flex-start", gap: 8
            }}>
              <Zap size={14} style={{ color: "#eab308", marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: "#eab308", lineHeight: 1.4 }}>
                Server is waking up — this takes ~30 seconds on first use. Please wait...
              </p>
            </div>
          )}
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
