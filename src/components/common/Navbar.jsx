import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import { Users, Search, Bell, LogOut, Home, FolderKanban, Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = () => { logout(); navigate("/"); };

  const navLinks = [
    { to:"/dashboard", icon:<Home size={18}/>, label:"Home" },
    { to:"/find-people", icon:<Search size={18}/>, label:"Find People" },
    { to:"/find-teams", icon:<Users size={18}/>, label:"Find Teams" },
    { to:"/projects", icon:<FolderKanban size={18}/>, label:"Projects" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F1A]/90 backdrop-blur border-b border-[#2A2A4A]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white"/>
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TeamForge</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to) ? "bg-purple-600/20 text-purple-300" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell size={20}/>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1A1A2E] border border-[#2A2A4A] hover:border-purple-500 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
              {user?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-slate-300">{user?.full_name?.split(" ")[0]}</span>
          </Link>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18}/>
          </button>
        </div>

        <button className="md:hidden p-2 text-slate-400" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1 bg-[#0F0F1A] border-b border-[#2A2A4A]">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5">
              {link.icon} {link.label}
            </Link>
          ))}
          <Link to="/notifications" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-300">
            <Bell size={18}/> Notifications {unreadCount > 0 && <span className="badge-purple">{unreadCount}</span>}
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-red-400 w-full">
            <LogOut size={18}/> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
