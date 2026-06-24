import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, KeyRound, ShieldCheck } from "lucide-react";

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: "Too weak",    color: "#ef4444" };
  if (score === 2) return { score: 2, label: "Weak",       color: "#f97316" };
  if (score === 3) return { score: 3, label: "Fair",       color: "#eab308" };
  if (score === 4) return { score: 4, label: "Strong",     color: "#22c55e" };
  return             { score: 5, label: "Very strong", color: "#10b981" };
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontSize: 12, color: "#f87171" }}>
      <AlertCircle size={12} /> {msg}
    </div>
  );
}

// Steps: 0 = enter email+phone, 1 = enter new password
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ email: "", phone: "", new_password: "", confirm_password: "" });

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const pwStrength = getPasswordStrength(form.new_password);

  // Step 0 — verify email + phone
  const handleVerify = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email address";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      errs.phone = "Enter the phone number used during registration";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await api.post("/auth/verify-identity", {
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/[\s\-()]/g, ""),
      });
      toast.success("Identity verified! Set your new password.");
      setStep(1);
    } catch (err) {
      const msg = err.response?.data?.error || "Could not verify identity";
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
      else if (msg.toLowerCase().includes("phone")) setErrors({ phone: msg });
      else toast.error(msg);
    } finally { setLoading(false); }
  };

  // Step 1 — set new password
  const handleReset = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.new_password.length < 8) errs.new_password = "Password must be at least 8 characters";
    if (!/[A-Za-z]/.test(form.new_password)) errs.new_password = "Must contain a letter";
    if (!/[0-9]/.test(form.new_password)) errs.new_password = "Must contain a number";
    if (pwStrength.score < 2) errs.new_password = "Password is too weak";
    if (form.new_password !== form.confirm_password) errs.confirm_password = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/[\s\-()]/g, ""),
        new_password: form.new_password,
      });
      toast.success("Password reset successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed. Please try again.");
    } finally { setLoading(false); }
  };

  const inputStyle = (field) => ({
    outline: "none",
    borderColor: errors[field] ? "#ef4444" : undefined,
    boxShadow: errors[field] ? "0 0 0 3px rgba(239,68,68,0.12)" : undefined,
  });

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={32} />
          </div>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>
            {step === 0 ? "Forgot password?" : "Set new password"}
          </h1>
          <p className="muted">
            {step === 0
              ? "Enter your email and phone number to verify your identity"
              : "Choose a strong password for your account"}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {["Verify Identity", "New Password"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", fontSize: 11, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: i < step ? "#22c55e" : i === step ? "var(--accent)" : "var(--surface3)",
                color: i <= step ? "#fff" : "var(--text3)", transition: "all 0.2s"
              }}>
                {i < step ? <Check size={12} /> : i === 0 ? <ShieldCheck size={12} /> : <KeyRound size={12} />}
              </div>
              <span style={{ fontSize: 12, color: i === step ? "var(--text)" : "var(--text3)", fontWeight: i === step ? 500 : 400 }}>
                {label}
              </span>
              {i === 0 && <div style={{ width: 20, height: 1, background: step > 0 ? "#22c55e" : "var(--border2)" }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24 }}>

          {/* ── Step 0: Verify Identity ── */}
          {step === 0 && (
            <form onSubmit={handleVerify}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
                    Email address
                  </label>
                  <input type="email" className="input" placeholder="you@college.edu"
                    value={form.email} onChange={e => set("email", e.target.value)}
                    style={inputStyle("email")} />
                  <FieldError msg={errors.email} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
                    Phone number <span style={{ color: "var(--text3)", fontWeight: 400 }}>(used during registration)</span>
                  </label>
                  <input type="tel" className="input" placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 15))}
                    style={inputStyle("phone")} />
                  <FieldError msg={errors.phone} />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 40, fontSize: 14, marginTop: 4 }}>
                  {loading ? "Verifying..." : <><ShieldCheck size={14} /> Verify Identity</>}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 1: New Password ── */}
          {step === 1 && (
            <form onSubmit={handleReset}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
                    New password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} className="input"
                      placeholder="Min 8 characters" style={{ paddingRight: 40, ...inputStyle("new_password") }}
                      value={form.new_password} onChange={e => set("new_password", e.target.value)} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", padding: 0
                    }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {form.new_password.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
                        {[1,2,3,4,5].map(l => (
                          <div key={l} style={{
                            flex: 1, height: 3, borderRadius: 99,
                            background: l <= pwStrength.score ? pwStrength.color : "var(--surface3)",
                            transition: "background 0.2s"
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: pwStrength.color }}>{pwStrength.label}</span>
                    </div>
                  )}
                  <FieldError msg={errors.new_password} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
                    Confirm new password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input type={showConfirm ? "text" : "password"} className="input"
                      placeholder="Re-enter new password"
                      style={{ paddingRight: 40, ...inputStyle("confirm_password") }}
                      value={form.confirm_password} onChange={e => set("confirm_password", e.target.value)} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", padding: 0
                    }}>
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    {form.confirm_password && form.new_password === form.confirm_password && (
                      <Check size={14} style={{ position: "absolute", right: 36, top: "50%", transform: "translateY(-50%)", color: "#22c55e" }} />
                    )}
                  </div>
                  <FieldError msg={errors.confirm_password} />
                </div>

                {/* Password checklist */}
                {form.new_password.length > 0 && (
                  <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                    {[
                      { ok: form.new_password.length >= 8,          text: "At least 8 characters" },
                      { ok: /[A-Za-z]/.test(form.new_password),     text: "Contains a letter" },
                      { ok: /[0-9]/.test(form.new_password),        text: "Contains a number" },
                      { ok: /[^A-Za-z0-9]/.test(form.new_password), text: "Contains a symbol (!@#$...)" },
                    ].map(r => (
                      <div key={r.text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: r.ok ? "#22c55e" : "var(--text3)" }}>
                        <Check size={11} style={{ opacity: r.ok ? 1 : 0.3 }} /> {r.text}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button type="button" onClick={() => setStep(0)} className="btn btn-secondary" style={{ flex: 1, height: 40 }}>
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2, height: 40, fontSize: 14 }}>
                    {loading ? "Resetting..." : <><KeyRound size={14} /> Reset Password</>}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text3)" }}>
          Remember your password?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
