import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { ArrowRight, Users, Zap, Search, Shield, Github, ChevronRight } from "lucide-react";

const FEATURES = [
  { icon: <Zap size={16} />, title: "AI Compatibility", desc: "Scores match based on skills, interests and commitment — not just keywords." },
  { icon: <Search size={16} />, title: "Smart Search", desc: "Filter by institution, department, skill, domain and availability." },
  { icon: <Users size={16} />, title: "Team Builder", desc: "AI auto-assembles a balanced team from skill requirements you define." },
  { icon: <Shield size={16} />, title: "Commitment Levels", desc: "Know upfront if someone is serious, learning or just having fun." },
];

export default function Landing() {
  return (
    <div className="page" style={{ color: "var(--text)" }}>

      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={28} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ height: 36 }}>
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px 80px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(91,91,214,0.08)", border: "1px solid rgba(91,91,214,0.2)",
          borderRadius: 99, padding: "4px 12px", marginBottom: 32,
          fontSize: 12, color: "#a5b4fc", fontWeight: 500
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />
          AI-powered team formation for students
        </div>

        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
          Find teammates who{" "}
          <span className="gradient-text">actually show up.</span>
        </h1>

        <p style={{ color: "var(--text2)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px", fontWeight: 400 }}>
          TeamForge matches students by skill, interest, and commitment level — so you stop wasting time on unreliable collaborators.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create your profile <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign in
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[["500+", "Students"], ["120+", "Teams formed"], ["95%", "Match accuracy"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div className="divider" />
      </div>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <p className="label" style={{ textAlign: "center", marginBottom: 12 }}>Features</p>
        <h2 style={{ textAlign: "center", marginBottom: 48, fontSize: "1.6rem", letterSpacing: "-0.03em" }}>
          Everything you need to build a great team
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding: "20px 20px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(91,91,214,0.1)", border: "1px solid rgba(91,91,214,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#a78bfa", marginBottom: 14
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div className="divider" />
      </div>
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px" }}>
        <p className="label" style={{ textAlign: "center", marginBottom: 12 }}>How it works</p>
        <h2 style={{ textAlign: "center", marginBottom: 40, fontSize: "1.6rem", letterSpacing: "-0.03em" }}>
          From signup to building in minutes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { n: "1", t: "Create your profile", d: "Add skills, interests and commitment level. Takes 2 minutes." },
            { n: "2", t: "Get matched by AI", d: "Compatibility scores based on shared interests and complementary skills." },
            { n: "3", t: "Join or create a team", d: "Send a request or post your team. Build something real." },
          ].map((s, i) => (
            <div key={s.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(91,91,214,0.1)", border: "1px solid rgba(91,91,214,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600, color: "#a78bfa"
                }}>{s.n}</div>
                {i < 2 && <div style={{ width: 1, height: 32, background: "var(--border)", marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: i < 2 ? 28 : 0, paddingTop: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div className="divider" />
      </div>
      <section style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px 96px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
          Ready to forge your team?
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
          Join students building real projects with committed teammates.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create your profile for free <ArrowRight size={15} />
        </Link>
      </section>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <Logo size={22} />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>© 2025 TeamForge</span>
          <a href="https://github.com/vishnusagar2025/teamforge" target="_blank" rel="noreferrer"
            style={{ color: "var(--text3)" }} className="btn btn-ghost" >
            <Github size={15} /> GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
