import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/teamService";
import toast from "react-hot-toast";
import { DEPARTMENTS, YEARS } from "../data/constants";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || "", phone: user?.phone || "",
    institution: user?.institution || "", department: user?.department || "",
    year_of_study: user?.year_of_study || "", linkedin_url: user?.linkedin_url || "",
    portfolio_url: user?.portfolio_url || "", commitment_level: user?.commitment_level || "serious",
    bio: user?.bio || "", github_url: user?.github_url || "",
  });

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await profileService.updateProfile(form);
      updateUser(res.data);
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (err) { toast.error(err.response?.data?.error || "Update failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="card space-y-4">
          {[
            {label:"Full Name", key:"full_name", type:"text"},
            {label:"Phone", key:"phone", type:"tel"},
            {label:"Institution", key:"institution", type:"text"},
            {label:"LinkedIn URL", key:"linkedin_url", type:"url"},
            {label:"Portfolio URL", key:"portfolio_url", type:"url"},
            {label:"GitHub URL", key:"github_url", type:"url"},
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm text-slate-400 mb-1.5">{f.label}</label>
              <input type={f.type} className="input" value={form[f.key]} onChange={e => set(f.key, e.target.value)}/>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Department</label>
              <select className="input" value={form.department} onChange={e => set("department", e.target.value)}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Year</label>
              <select className="input" value={form.year_of_study} onChange={e => set("year_of_study", e.target.value)}>
                {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
            <textarea className="input resize-none" rows={3} value={form.bio}
              onChange={e => set("bio", e.target.value)} placeholder="Tell teammates about yourself..."/>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Commitment Level</label>
            <div className="flex gap-3">
              {[{val:"serious",label:"🔥 Serious"},{val:"learning",label:"📚 Learning"},{val:"fun",label:"😄 Fun"}].map(c => (
                <button type="button" key={c.val} onClick={() => set("commitment_level", c.val)}
                  className={`flex-1 py-2 rounded-xl border text-sm transition-colors ${
                    form.commitment_level === c.val ? "border-purple-500 bg-purple-900/20 text-purple-300" : "border-[#2A2A4A] text-slate-400"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/profile")} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
