import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { ArrowRight, Users, Zap, Search, Shield, Star, Github, Linkedin } from "lucide-react";

const STATS = [
  { value: "500+", label: "Students" },
  { value: "120+", label: "Teams Formed" },
  { value: "40+", label: "Hackathons" },
  { value: "95%", label: "Match Rate" },
];

const FEATURES = [
  {
    icon: <Zap size={20} className="text-violet-400" />,
    title: "AI Match Score",
    desc: "Get a compatibility score based on shared interests, complementary skills and commitment level.",
    color: "from-violet-500/10 to-transparent",
    border: "border-violet-500/20",
  },
  {
    icon: <Search size={20} className="text-cyan-400" />,
    title: "Smart Discovery",
    desc: "Filter by institution, department, year, skills and domain. Find exactly who you need.",
    color: "from-cyan-500/10 to-transparent",
    border: "border-cyan-500/20",
  },
  {
    icon: <Users size={20} className="text-emerald-400" />,
    title: "Team Boards",
    desc: "Post your team with required roles. Serious people find serious teams — fast.",
    color: "from-emerald-500/10 to-transparent",
    border: "border-emerald-500/20",
  },
  {
    icon: <Shield size={20} className="text-amber-400" />,
    title: "Commitment Filter",
    desc: "Filter by 🔥 Serious, 📚 Learning, or 😄 Fun. No more flaky teammates.",
    color: "from-amber-500/10 to-transparent",
    border: "border-amber-500/20",
  },
];

const STEPS = [
  { num: "01", title: "Create your profile", desc: "Add skills, interests, and your commitment level in 2 minutes." },
  { num: "02", title: "Get matched", desc: "Our AI scores your compatibility with others based on skills and interests." },
  { num: "03", title: "Build together", desc: "Join a team or create one. Start building your hackathon project." },
];

export default function Landing() {
  return (
    <div className="min-h-screen page-bg text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-600/6 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo size={36} />
        <nav className="hidden md:flex items-center gap-1">
          {["Features", "How it works"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started <ArrowRight size={14} /></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8">
          <Star size={12} className="fill-violet-400 text-violet-400" />
          Built from a real hackathon struggle
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
          Find teammates who{" "}
          <span className="gradient-text">actually show up</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop chasing unreliable people. TeamForge matches you with committed students
          by skill, interest, and dedication — so you can build something real.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link to="/register" className="btn-primary text-base px-8 py-3">
            Build Your Team <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3">
            Sign In
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {STATS.map(s => (
            <div key={s.label} className="card py-4 px-3 text-center">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <p className="section-label text-center mb-3">Features</p>
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to forge a great team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className={`card border ${f.border} bg-gradient-to-br ${f.color} flex gap-4 group hover:-translate-y-0.5 transition-all duration-200`}>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <p className="section-label text-center mb-3">How it works</p>
        <h2 className="text-3xl font-bold text-center mb-12">From signup to building — in minutes</h2>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-400 font-bold text-sm">{s.num}</span>
              </div>
              <div className="card flex-1 py-4">
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute ml-6 mt-12 w-px h-4 bg-violet-500/20" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <div className="card border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5 text-center py-12">
          <h2 className="text-3xl font-bold mb-3">Ready to forge your team?</h2>
          <p className="text-slate-400 mb-8">Join students building real projects with committed teammates.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3">
            Create Your Profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <p className="text-slate-600 text-sm">© 2025 TeamForge. Built for every student who got betrayed by uncommitted teammates.</p>
          <div className="flex gap-4">
            <a href="https://github.com/vishnusagar2025/teamforge" target="_blank" rel="noreferrer"
              className="text-slate-600 hover:text-white transition-colors">
              <Github size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
