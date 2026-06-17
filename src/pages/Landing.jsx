import React from "react";
import { Link } from "react-router-dom";
import { Zap, Users, Search, Award, ArrowRight, Globe, Cpu, Bot, Code2 } from "lucide-react";

const DOMAINS = [
  { icon: <Globe size={18}/>, label:"Web Development", color:"text-blue-400" },
  { icon: <Cpu size={18}/>, label:"IoT & Robotics", color:"text-green-400" },
  { icon: <Bot size={18}/>, label:"AI / ML", color:"text-purple-400" },
  { icon: <Code2 size={18}/>, label:"App Development", color:"text-orange-400" },
];

const FEATURES = [
  { icon:<Search size={22} className="text-purple-400"/>, title:"Smart Discovery", desc:"Filter by institution, department, year, skills and interests in seconds." },
  { icon:<Zap size={22} className="text-cyan-400"/>, title:"AI Match Score", desc:"Our AI scores compatibility based on shared interests, skills and commitment level." },
  { icon:<Users size={22} className="text-green-400"/>, title:"Team Boards", desc:"Post your team with required roles. Serious people find serious teams." },
  { icon:<Award size={22} className="text-yellow-400"/>, title:"Hackathon Ready", desc:"Built specifically for hackathon team formation — find committed teammates fast." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white">
      <header className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white"/>
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TeamForge</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-700/50 text-purple-300 text-sm mb-8">
          <Zap size={14}/> Built from a real hackathon struggle
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Find teammates who{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">actually show up</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Stop chasing unreliable friends. TeamForge matches you with committed students from your institution — by skill, interest, and dedication level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3">
            Build Your Team <ArrowRight size={18}/>
          </Link>
          <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3">Sign In</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {DOMAINS.map(d => (
            <span key={d.label} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A2E] border border-[#2A2A4A] text-sm ${d.color}`}>
              {d.icon} {d.label}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Why TeamForge?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="card flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0F0F1A] flex items-center justify-center shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-24 px-6">
        <div className="max-w-2xl mx-auto card border-purple-700/50 bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
          <h2 className="text-2xl font-bold mb-3">Ready to forge your team?</h2>
          <p className="text-slate-400 mb-6">Join students building real projects with committed teammates.</p>
          <Link to="/register" className="btn-accent inline-flex items-center gap-2">
            Create Your Profile <ArrowRight size={16}/>
          </Link>
        </div>
      </section>
    </div>
  );
}
