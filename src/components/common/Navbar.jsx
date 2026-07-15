import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../hooks/useNotifications";
import { Users, Search, Bell, LogOut, Home, FolderKanban, Menu, X, Bot, Zap, Sun, Moon, MessageSquareText } from "lucide-react";
import Logo from "./Logo";
import AvatarDisplay from "./AvatarDisplay";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const aiRef = useRef(null);
  const { unreadCount } = useNotifications();

  const p = location.pathname;
  const active = (path) => p === path || p.startsWith(path + "/");

  useEffect(() => {
    const handler = (e) => { if (aiRef.current && !aiRef.current.contains(e.target)) setAiOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const NAV = [
    { to: "/dashboard", icon: <Home size={14} />, label: "Home" },
    { to: "/find-people", icon: <Search size={14} />, label: "People" },
    { to: "/find-teams", icon: <Users size={14} />, label: "Teams" },
    { to: "/projects", icon: <FolderKanban size={14} />, label: "Projects" },
  ];

  return (
    <>
      <nav className="navbar" style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 4 }}>

          <Link to="/dashboard" style={{ marginRight: 8 }}>
            <Logo size={26} />
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }} className="hidden-mobile">
            {NAV.map(n => (
              <Link key={n.to} to={n.to}
                className={`nav-item ${active(n.to) ? "active" : ""}`}>
                {n.icon}{n.label}
              </Link>
            ))}

            {/* AI dropdown */}
            <div ref={aiRef} style={{ position: "relative" }}>
              <button onClick={() => setAiOpen(o => !o)}
                className={`nav-item ${p.startsWith("/ai") ? "active" : ""}`}
                style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <Bot size={14} /> AI
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0.5, transition: "transform 0.15s", transform: aiOpen ? "rotate(180deg)" : "" }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              {aiOpen && (
                <div className="card" style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  minWidth: 180, padding: "4px", zIndex: 100,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                }}>
                  {[
                    { to: "/ai/assistant", icon: <Bot size={13} />, label: "AI Assistant" },
                    { to: "/ai/team-builder", icon: <Zap size={13} />, label: "Team Builder" },
                    { to: "/resume-chat", icon: <MessageSquareText size={13} />, label: "Team Finder" },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setAiOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                        borderRadius: 7, fontSize: 13, color: "var(--text2)",
                        transition: "all 0.12s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text2)"; }}>
                      {item.icon}{item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }} className="hidden-mobile">
            <button onClick={toggle} className="btn btn-ghost" style={{ padding: "0 8px", height: 32 }} title={dark ? "Light mode" : "Dark mode"}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link to="/notifications" className="btn btn-ghost" style={{ padding: "0 8px", height: 32, position: "relative" }}>
              <Bell size={15} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute", top: 4, right: 4,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "var(--accent)", color: "#fff",
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </Link>

            <Link to="/profile" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "4px 10px 4px 6px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--surface2)",
              fontSize: 13, fontWeight: 450, color: "var(--text)",
              transition: "all 0.12s", textDecoration: "none"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <AvatarDisplay user={user} size={22} />
              {user?.full_name?.split(" ")[0]}
            </Link>

            <button onClick={() => { logout(); navigate("/"); }}
              className="btn btn-ghost" style={{ padding: "0 8px", height: 32, color: "var(--text3)" }}
              title="Sign out">
              <LogOut size={15} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="btn btn-ghost show-mobile" style={{ marginLeft: "auto", padding: "0 6px", height: 32 }}
            onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 56, left: 0, right: 0, zIndex: 49,
          background: "var(--surface)", borderBottom: "1px solid var(--border)",
          padding: "8px 16px 16px"
        }} className="show-mobile">
          {[...NAV,
            { to: "/ai/assistant", icon: <Bot size={14} />, label: "AI Assistant" },
            { to: "/ai/team-builder", icon: <Zap size={14} />, label: "Team Builder" },
            { to: "/resume-chat", icon: <MessageSquareText size={14} />, label: "Team Finder" },
            { to: "/notifications", icon: <Bell size={14} />, label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          ].map(n => (
            <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)}
              className={`nav-item ${active(n.to) ? "active" : ""}`}
              style={{ width: "100%", marginBottom: 2 }}>
              {n.icon}{n.label}
            </Link>
          ))}
          <div className="divider" style={{ margin: "8px 0" }} />
          <button onClick={toggle} className="nav-item" style={{ width: "100%", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 2 }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? "Light mode" : "Dark mode"}
          </button>
          <button onClick={() => { logout(); navigate("/"); }}
            className="nav-item" style={{ width: "100%", color: "#f87171", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  );
}
