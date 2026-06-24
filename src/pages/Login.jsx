import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/common/Logo";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slowMsg, setSlowMsg] = useState(""); // cold start message
  const [elapsed, setElapsed] = useState(0);

  // Show a "waking up server..." message if login takes > 4 seconds
  useEffect(() => {
    let interval;
    if (loading) {
      setElapsed(0);
      interval = setInterval(() => {
        setElapsed(s => {
          const next = s + 1;
          if (next === 4)  setSlowMsg("Connecting to server...");
          if (next === 10) setSlowMsg("Waking up the server (first request may take ~30s)...");
          if (next === 25) setSlowMsg("Almost there, server is starting up...");
          if (next === 50) setSlowMsg("Taking longer than usual. Please wait...");
          return next;
        });
      }, 1000);
    } else {
      setSlowMsg("");
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        toast.error("Server took too long to respond. Please try again.");
      } else {
        toast.error(err.response?.data?.error || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size={32} />
          </div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Sign in to TeamForge
          </h1>
          <p className="muted">Welcome back. Let's build something great.</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
                Email address
              </label>
              <input type="email" required className="input" placeholder="you@college.edu"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required className="input"
                  placeholder="••••••••" style={{ paddingRight: 40 }}
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text3)",
                    display: "flex", padding: 0
                  }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
              style={{ width: "100%", height: 42, position: "relative", overflow: "hidden" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite", display: "inline-block"
                  }} />
                  Signing in...
                </span>
              ) : (
                <>Continue <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Cold start warning */}
          {slowMsg && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 8,
              background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)",
              display: "flex", alignItems: "flex-start", gap: 8
            }}>
              <Zap size={14} style={{ color: "#eab308", marginTop: 1, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 12, color: "#eab308", fontWeight: 500, marginBottom: 2 }}>
                  Server warming up
                </p>
                <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.4 }}>
                  {slowMsg} The free server takes 30–60s to start after inactivity. This only happens once.
                </p>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text3)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
