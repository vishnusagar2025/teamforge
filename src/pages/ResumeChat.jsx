import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import api from "../services/api";
import {
  Send, Bot, User as UserIcon, Sparkles, Users, BookOpen,
  GraduationCap, Code2, Star, ChevronDown, ChevronUp,
  Briefcase, MessageCircle, RefreshCw, ExternalLink
} from "lucide-react";

/* ── Dept colour map ─────────────────────────────────────── */
const DEPT_COLORS = {
  "Computer Science Engineering":          { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.35)", text: "#a78bfa" },
  "AI & Machine Learning":                 { bg: "rgba(59,130,246,0.15)",  border: "rgba(59,130,246,0.35)",  text: "#60a5fa" },
  "AI & Data Science":                     { bg: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.35)",   text: "#22d3ee" },
  "Information Technology":               { bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.35)",  text: "#34d399" },
  "Electronics & Communication Engineering": { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", text: "#fbbf24" },
  "Electrical & Electronics Engineering": { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.35)",   text: "#f87171" },
  "Cyber Security":                        { bg: "rgba(236,72,153,0.15)",  border: "rgba(236,72,153,0.35)",  text: "#f472b6" },
  "CS & Business Systems":                { bg: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.35)",  text: "#c084fc" },
  "Computer & Communication Engineering": { bg: "rgba(14,165,233,0.15)",  border: "rgba(14,165,233,0.35)",  text: "#38bdf8" },
  "Mechanical Engineering":               { bg: "rgba(107,114,128,0.15)", border: "rgba(107,114,128,0.35)", text: "#9ca3af" },
};

const getDeptStyle = (dept) =>
  DEPT_COLORS[dept] || { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", text: "#a78bfa" };

const SKILL_COLORS = [
  "rgba(139,92,246,0.2)", "rgba(59,130,246,0.2)", "rgba(16,185,129,0.2)",
  "rgba(245,158,11,0.2)", "rgba(236,72,153,0.2)", "rgba(6,182,212,0.2)",
];

/* ── Quick suggestion chips ──────────────────────────────── */
const QUICK_CHIPS = [
  "Team of 4 for AI/ML hackathon",
  "2 Python devs + 1 React + 1 ECE",
  "Cybersecurity team of 3",
  "Full-stack team with Node.js and React",
  "IoT project team with ECE and Python",
  "Data Science team of 5",
];

/* ── Formatted bot text (supports **bold** and bullet lists) */
function BotText({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        // Bullet
        if (line.startsWith("•")) {
          return (
            <div key={i} className="flex gap-2 items-start text-sm text-slate-300">
              <span className="text-purple-400 mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatBold(line.slice(1).trim()) }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-slate-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
        );
      })}
    </div>
  );
}

function formatBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}

/* ── Candidate card ──────────────────────────────────────── */
function CandidateCard({ candidate, index }) {
  const [expanded, setExpanded] = useState(false);
  const deptStyle = getDeptStyle(candidate.department);
  const initials = candidate.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const gradients = [
    "from-violet-600 to-indigo-600",
    "from-blue-600 to-cyan-600",
    "from-emerald-600 to-teal-600",
    "from-amber-600 to-orange-600",
    "from-pink-600 to-rose-600",
    "from-purple-600 to-violet-600",
    "from-cyan-600 to-blue-600",
    "from-green-600 to-emerald-600",
  ];

  const score = candidate.match_score;
  const scoreColor = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#94a3b8";

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        borderColor: deptStyle.border,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Card header */}
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-white text-sm truncate">{candidate.full_name}</h4>
            {/* Match score */}
            <div className="shrink-0 flex flex-col items-end">
              <span className="text-xs font-bold" style={{ color: scoreColor }}>{score}%</span>
              <span className="text-[10px] text-slate-600">match</span>
            </div>
          </div>

          {/* Dept badge */}
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{ background: deptStyle.bg, color: deptStyle.text, border: `1px solid ${deptStyle.border}` }}
          >
            {candidate.department}
          </span>

          {/* Roll number */}
          {candidate.roll_number && (
            <p className="text-[11px] text-slate-500 mt-1">{candidate.roll_number}</p>
          )}
        </div>
      </div>

      {/* Skills row */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, expanded ? candidate.skills.length : 4).map((skill, si) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-full text-[11px] font-medium text-slate-300"
            style={{ background: SKILL_COLORS[si % SKILL_COLORS.length], border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {skill}
          </span>
        ))}
        {!expanded && candidate.skills.length > 4 && (
          <span className="text-[11px] text-slate-500">+{candidate.skills.length - 4} more</span>
        )}
      </div>

      {/* Expandable: bio */}
      {expanded && candidate.bio && (
        <div className="px-4 pb-3">
          <p className="text-[12px] text-slate-400 leading-relaxed italic">"{candidate.bio}"</p>
        </div>
      )}

      {/* Footer actions */}
      <div
        className="px-4 py-2.5 flex items-center justify-between border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Less" : "More details"}
        </button>
        <a
          href={`/users/${candidate.id}`}
          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={11} />
          View Profile
        </a>
      </div>
    </div>
  );
}

/* ── Team result panel ───────────────────────────────────── */
function TeamResult({ team }) {
  if (!team || team.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Users size={14} className="text-purple-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Suggested Team ({team.length} members)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {team.map((candidate, i) => (
          <CandidateCard key={candidate.id} candidate={candidate} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Message bubble ──────────────────────────────────────── */
function Message({ msg }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
        isBot
          ? "bg-gradient-to-br from-violet-600 to-indigo-600"
          : "bg-gradient-to-br from-slate-700 to-slate-600"
      }`}>
        {isBot ? <Bot size={14} className="text-white" /> : <UserIcon size={14} className="text-white" />}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isBot ? "" : "flex flex-col items-end"}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isBot
              ? "rounded-tl-sm"
              : "rounded-tr-sm"
          }`}
          style={
            isBot
              ? {
                  background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 100%)",
                  border: "1px solid rgba(139,92,246,0.2)",
                }
              : {
                  background: "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.15) 100%)",
                  border: "1px solid rgba(59,130,246,0.25)",
                }
          }
        >
          {isBot ? (
            <BotText text={msg.text} />
          ) : (
            <p className="text-sm text-slate-200">{msg.text}</p>
          )}
        </div>

        {/* Team results below bot message */}
        {isBot && msg.team && msg.team.length > 0 && (
          <div className="mt-1 w-full">
            <TeamResult team={msg.team} />
          </div>
        )}

        <p className="text-[10px] text-slate-600 mt-1.5 px-1">{msg.time}</p>
      </div>
    </div>
  );
}

/* ── Typing indicator ────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl shrink-0 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
        <Bot size={14} className="text-white" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 100%)",
          border: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-purple-400"
              style={{
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Stats strip ─────────────────────────────────────────── */
function StatsStrip({ stats }) {
  if (!stats) return null;
  return (
    <div
      className="flex flex-wrap gap-3 p-3 rounded-xl mb-4"
      style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)" }}
    >
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Users size={12} className="text-purple-400" />
        <span><span className="text-white font-semibold">{stats.total_candidates}</span> candidates</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <GraduationCap size={12} className="text-cyan-400" />
        <span><span className="text-white font-semibold">{Object.keys(stats.departments || {}).length}</span> departments</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Code2 size={12} className="text-emerald-400" />
        <span>Top skill: <span className="text-white font-semibold">{stats.top_skills?.[0]?.skill || "—"}</span></span>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function ResumeChat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey! I'm TeamForge Bot.\n\nTell me what kind of team you're looking for and I'll find the best candidates from our pool of 100 engineering resumes.\n\nTry something like:\n• \"Team of 4 for an AI/ML hackathon\"\n• \"2 Python devs, 1 React, 1 ECE student\"\n• \"Cybersecurity team with Linux and Networking skills\"",
      team: [],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load stats
  useEffect(() => {
    api.get("/resume-chat/stats").then(r => setStats(r.data)).catch(() => {});
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msgText, team: [], time: now() }]);
    setLoading(true);

    try {
      const res = await api.post("/resume-chat/message", { message: msgText });
      const data = res.data;
      setMessages(prev => [
        ...prev,
        { role: "bot", text: data.text, team: data.team || [], time: now() },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I couldn't connect to the server. Please make sure the backend is running.",
          team: [],
          time: now(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "bot",
      text: "Chat cleared! Tell me what kind of team you're looking for.",
      team: [],
      time: now(),
    }]);
  };

  return (
    <div className="min-h-screen page-bg flex flex-col">
      <Navbar />

      {/* Keyframes for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 pt-20 pb-4 flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between mb-4 pt-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Resume Team Finder</h1>
                <p className="text-xs text-slate-400">AI-powered chatbot · 100 engineering profiles</p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Stats strip */}
        <StatsStrip stats={stats} />

        {/* Quick chips */}
        <div className="flex gap-2 flex-wrap mb-4">
          {QUICK_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#c4b5fd",
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-5 mb-4"
          style={{
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
            minHeight: "400px",
            maxHeight: "calc(100vh - 380px)",
          }}
        >
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="flex gap-3 p-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the team you need... (e.g. 'Team of 4 for AI hackathon with Python and React')"
            rows={2}
            disabled={loading}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm resize-none outline-none leading-relaxed"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="self-end w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            }}
          >
            {loading ? (
              <RefreshCw size={16} className="text-white animate-spin" />
            ) : (
              <Send size={16} className="text-white" />
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-2">
          <MessageCircle size={10} className="inline mr-1" />
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
