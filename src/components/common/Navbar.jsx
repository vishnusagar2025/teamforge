import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../hooks/useNotifications";
import { Users, Search, Bell, LogOut, Home, FolderKanban, Menu, X, Bot, Zap, Sun, Moon, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import AvatarDisplay from "./AvatarDisplay";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/dashboard"><Logo size={30} /></Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
            <Home size={15} /> Home
          </Link>
          <Link to="/find-people" className={`nav-link ${isActive("/find-people") ? "active" : ""}`}>
            <Search size={15} /> Find People
          </Link>
          <Link to="/find-teams" className={`nav-link ${isActive("/find-teams") ? "active" : ""}`}>
            <Users size={15} /> Teams
          </Link>
          <Link to="/projects" className={`nav-link ${isActive("/projects") ? "active" : ""}`}>
            <FolderKanban size={15} /> Projects
          </Link>

          {/* AI Dropdown */}
          <div className="relative">
            <button onClick={() => setAiOpen(o => !o)}
              className={`nav-link ${isActive("/ai") ? "active" : ""}`}>
              <Bot size={15} /> AI <ChevronDown size={12} className={`transition-transform ${aiOpen ? "rotate-180" : ""}`} />
            </button>
            {aiOpen && (
              <div className="absolute top-full mt-1 left-0 w-48 card py-1 px-0 shadow-xl z-50"
                onMouseLeave={() => setAiOpen(false)}>
                <Link to="/ai/assistant" onClick={() => setAiOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-violet-500/5 transition-colors"
                  style={{ color: "var(--text2)" }}>
                  <Bot size={14} className="text-cyan-400" /> AI Assistant
                </Link>
                <Link to="/ai/team-builder" onClick={() => setAiOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-violet-500/5 transition-colors"
                  style={{ color: "var(--text2)" }}>
                  <Zap size={14} className="text-violet-400" /> Team Builder
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button onClick={toggle}
            className="p-2 rounded-lg transition-all hover:bg-white/5"
            style={{ color: "var(--text2)" }}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <Link to="/notifications" className="relative p-2 rounded-lg transition-all hover:bg-white/5"
            style={{ color: "var(--text2)" }}>
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-violet-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link to="/profile"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all hover:border-violet-500/30"
            style={{ background: "var(--bg3)", borderColor: "var(--border)" }}>
            <AvatarDisplay user={user} size={26} />
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {user?.full_name?.split(" ")[0]}
            </span>
          </Link>

          <button onClick={handleLogout}
            className="p-2 rounded-lg transition-all hover:bg-red-500/5 text-slate-500 hover:text-red-400">
            <LogOut size={15} />
          </button>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-white/5" style={{ color: "var(--text2)" }}
          onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-3 pb-3 space-y-0.5 border-t" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
          {[
            { to: "/dashboard", icon: <Home size={15} />, label: "Home" },
            { to: "/find-people", icon: <Search size={15} />, label: "Find People" },
            { to: "/find-teams", icon: <Users size={15} />, label: "Teams" },
            { to: "/projects", icon: <FolderKanban size={15} />, label: "Projects" },
            { to: "/ai/assistant", icon: <Bot size={15} />, label: "AI Assistant" },
            { to: "/ai/team-builder", icon: <Zap size={15} />, label: "AI Team Builder" },
            { to: "/notifications", icon: <Bell size={15} />, label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          ].map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
              className={`nav-link w-full ${isActive(link.to) ? "active" : ""}`}>
              {link.icon} {link.label}
            </Link>
          ))}
          <button onClick={toggle} className="nav-link w-full">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={handleLogout} className="nav-link w-full text-red-400 hover:bg-red-500/5">
            <LogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
