import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { projectService } from "../services/teamService";
import { Plus, FolderKanban } from "lucide-react";
import { DOMAIN_ICONS } from "../data/constants";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const STATUS_COLORS = { planning:"badge-yellow", building:"badge-blue", completed:"badge-green" };

  useEffect(() => {
    projectService.getProjects().then(r => setProjects(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link to="/projects/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16}/> Add Project
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderKanban size={40} className="text-slate-600 mx-auto mb-3"/>
            <p className="text-slate-400 mb-4">No projects yet. Be the first!</p>
            <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16}/> Add Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => (
              <div key={p.id} className="card hover:border-purple-500/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className={`${STATUS_COLORS[p.status] || "badge-yellow"} text-[10px]`}>{p.status}</span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{p.description}</p>
                {p.domain && (
                  <span className="badge-blue text-xs">{DOMAIN_ICONS[p.domain] || "🚀"} {p.domain}</span>
                )}
                <p className="text-slate-500 text-xs mt-2">by {p.creator}</p>
                {p.is_looking_for_members && (
                  <div className="mt-3 pt-3 border-t border-[#2A2A4A]">
                    <span className="badge-green text-[10px]">+ Looking for members</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
