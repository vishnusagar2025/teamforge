import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import AvatarDisplay from "../components/common/AvatarDisplay";
import { aiService } from "../services/teamService";
import { Zap, Users, RefreshCw, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const SKILL_CATEGORIES = [
  { id: "frontend", label: "🌐 Frontend" },
  { id: "backend", label: "⚙️ Backend" },
  { id: "ml", label: "🤖 AI/ML" },
  { id: "mobile", label: "📱 Mobile" },
  { id: "devops", label: "☁️ DevOps" },
  { id: "database", label: "🗄️ Database" },
  { id: "hardware", label: "🔌 Hardware" },
  { id: "design", label: "🎨 Design" },
  { id: "security", label: "🔐 Security" },
];

export default function AITeamBuilder() {
  const [selected, setSelected] = useState([]);
  const [maxSize, setMaxSize] = useState(4);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = (id) =>
    setSelected((p) => (p.includes(id) ? p.filter((c) => c !== id) : [...p, id]));

  const build = async () => {
    if (selected.length === 0) {
      toast.error("Select at least one skill category");
      return;
    }
    setLoading(true);
    try {
      const res = await aiService.buildTeam({ categories: selected, max_size: maxSize });
      setResult(res.data);
    } catch {
      toast.error("Failed to build team. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Zap size={20} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold">AI Team Builder</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8 ml-[52px]">
          Tell us what skills your team needs. We'll find the best-fit people.
        </p>

        <div className="card mb-4">
          <h2 className="font-semibold mb-4 text-sm">1. What skill areas do you need?</h2>
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className={`px-3 py-2 rounded-xl text-sm border transition-all ${
                  selected.includes(cat.id)
                    ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="font-semibold mb-4 text-sm">2. How many members? (including yourself)</h2>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setMaxSize(n)}
                className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all ${
                  maxSize === n
                    ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                    : "border-white/10 text-slate-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button onClick={build} disabled={loading} className="btn-primary w-full mb-8 py-3">
          {loading ? (
            <><RefreshCw size={16} className="animate-spin" /> Building team...</>
          ) : (
            <><Zap size={16} /> Build My Team</>
          )}
        </button>

        {result && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Users size={16} className="text-cyan-400" /> Suggested Team
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {result.covered_categories?.map((c) => (
                  <span key={c} className="badge-green text-[10px]">✓ {c}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {result.suggested_team?.map((member, i) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <AvatarDisplay user={member} size={40} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {member.full_name}
                      {i === 0 && <span className="ml-2 badge-yellow text-[10px]">You</span>}
                    </p>
                    <p className="text-slate-500 text-xs">{member.department} · {member.institution}</p>
                  </div>
                  {i > 0 && (
                    <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
