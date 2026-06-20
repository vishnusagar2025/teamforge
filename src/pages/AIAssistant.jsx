import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import { aiService } from "../services/teamService";
import { Bot, Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import { DOMAIN_ICONS } from "../data/constants";
import toast from "react-hot-toast";

export default function AIAssistant() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teammates, setTeammates] = useState([]);
  const [loadingTeammates, setLoadingTeammates] = useState(false);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await aiService.getProjectIdeas();
      setIdeas(res.data);
    } catch {
      toast.error("Could not fetch ideas");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeammates = async () => {
    setLoadingTeammates(true);
    try {
      const res = await aiService.suggestTeammates();
      setTeammates(res.data.slice(0, 5));
    } catch {
      toast.error("Could not fetch suggestions");
    } finally {
      setLoadingTeammates(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
    fetchTeammates();
  }, []);

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
            <Bot size={20} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8 ml-[52px]">
          Personalized suggestions based on your interests and skills.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Ideas */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm">
                <Lightbulb size={15} className="text-amber-400" /> Project Ideas For You
              </h2>
              <button onClick={fetchIdeas} disabled={loading}
                className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : ideas.length === 0 ? (
              <p className="text-slate-500 text-sm">Add interests to your profile to get ideas.</p>
            ) : (
              <div className="space-y-3">
                {ideas.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]
                    hover:border-amber-500/20 transition-colors">
                    <p className="text-sm font-medium text-slate-200">{item.idea}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {DOMAIN_ICONS[item.domain] || "🚀"} {item.domain}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Teammate Suggestions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm">
                <Sparkles size={15} className="text-violet-400" /> Top Teammate Picks
              </h2>
              <button onClick={fetchTeammates} disabled={loadingTeammates}
                className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <RefreshCw size={14} className={loadingTeammates ? "animate-spin" : ""} />
              </button>
            </div>
            {loadingTeammates ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : teammates.length === 0 ? (
              <p className="text-slate-500 text-sm">Complete your profile to get teammate suggestions.</p>
            ) : (
              <div className="space-y-3">
                {teammates.map((item) => (
                  <div key={item.user.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]
                    hover:border-violet-500/20 transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {item.user.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.user.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{item.user.department}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className={`text-xs font-bold ${
                        item.compatibility_score >= 70 ? "text-emerald-400" :
                        item.compatibility_score >= 40 ? "text-amber-400" : "text-slate-400"
                      }`}>{item.compatibility_score}%</span>
                      <span className="text-[10px] text-slate-600">compat</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
