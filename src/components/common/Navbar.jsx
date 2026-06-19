import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { Users, Search, Bell, LogOut, Home, FolderKanban, Menu, X } from "lucide-react";
import Logo from "./Logo";
import AvatarDisplay from "./AvatarDisplay";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { to: "/dashboard", icon: <Home size={16} />, label: "Home" },
    { to: "/find-people", icon: <Search size={16} />, label: "Find People" },
    { to: "/find-teams", icon: <Users size={16} />, label: "Find Teams" },
    { to: "/projects", icon: <FolderKanban size={16} />, label: "Projects" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/dashboard"><Logo size={30} /></Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive(link.to)
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-violet-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <Link to="/profile" className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/30 transition-all">
            <AvatarDisplay user={user} size={28} />
            <span className="text-sm text-slate-300 font-medium">{user?.full_name?.split(" ")[0]}</span>
          </Link>

          <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all">
            <LogOut size={16} />
          </button>
        </div>

        <button className="md:hidden p-2 text-slate-400 hover:bg-white/5 rounded-lg" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 space-y-0.5 border-t border-white/[0.06]">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive(link.to) ? "bg-violet-500/15 text-violet-300" : "text-slate-300 hover:bg-white/5"}`}>
              {link.icon} {link.label}
            </Link>
          ))}
          <Link to="/notifications" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/5">
            <Bell size={16} /> Notifications
            {unreadCount > 0 && <span className="badge-purple ml-auto">{unreadCount}</span>}
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/5 w-full">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
