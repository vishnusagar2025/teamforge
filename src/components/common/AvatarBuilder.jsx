import React, { useState } from "react";
import { profileService } from "../../services/teamService";
import { useAuth } from "../../context/AuthContext";
import AvatarDisplay from "./AvatarDisplay";
import toast from "react-hot-toast";
import { X, Check } from "lucide-react";

const SKIN_COLORS = ["#FDDBB4", "#F5CBA7", "#E8A87C", "#C68642", "#8D5524", "#4A2912"];
const HAIR_COLORS = ["#1a1a1a", "#3B2314", "#6B3A2A", "#A0522D", "#D4A017", "#F0E68C", "#FF6B6B", "#6C3EF4"];
const EYE_COLORS = ["#1a1a1a", "#3B2314", "#2E4057", "#4CAF50", "#2196F3"];
const BG_COLORS = [
  "linear-gradient(135deg,#7C3AED,#06B6D4)",
  "linear-gradient(135deg,#DB2777,#7C3AED)",
  "linear-gradient(135deg,#059669,#06B6D4)",
  "linear-gradient(135deg,#D97706,#EF4444)",
  "linear-gradient(135deg,#2563EB,#7C3AED)",
  "linear-gradient(135deg,#1a1a2e,#16213e)",
];
const ACCESSORIES = [
  { id: "none", label: "None" },
  { id: "glasses", label: "👓 Glasses" },
  { id: "hat", label: "🎩 Hat" },
];
const ACC_COLORS = ["#6C3EF4", "#06B6D4", "#EF4444", "#F59E0B", "#10B981", "#1a1a1a"];

export default function AvatarBuilder({ onClose }) {
  const { user, updateUser } = useAuth();

  const parseConfig = () => {
    try { return user?.avatar_config ? JSON.parse(user.avatar_config) : {}; }
    catch { return {}; }
  };

  const [cfg, setCfg] = useState({
    bgColor: "linear-gradient(135deg,#7C3AED,#06B6D4)",
    skinColor: "#F5CBA7",
    hairColor: "#1a1a1a",
    eyeColor: "#1a1a1a",
    hair: true,
    accessory: "none",
    accessoryColor: "#6C3EF4",
    ...parseConfig(),
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await profileService.updateAvatar(cfg);
      updateUser({ avatar_config: JSON.stringify(cfg) });
      toast.success("Avatar saved!");
      onClose();
    } catch { toast.error("Failed to save avatar"); }
    finally { setSaving(false); }
  };

  const previewUser = { ...user, avatar_config: JSON.stringify(cfg) };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Customize Avatar</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Live Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AvatarDisplay user={previewUser} size={100} className="avatar-ring" />
          </div>
        </div>

        <div className="space-y-5">
          {/* Background */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">Background</p>
            <div className="flex flex-wrap gap-2">
              {BG_COLORS.map(c => (
                <button key={c} onClick={() => set("bgColor", c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${cfg.bgColor === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Skin */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">Skin Tone</p>
            <div className="flex gap-2">
              {SKIN_COLORS.map(c => (
                <button key={c} onClick={() => set("skinColor", c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${cfg.skinColor === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Hair */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-400">Hair Color</p>
              <button onClick={() => set("hair", !cfg.hair)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all ${cfg.hair ? "border-violet-500/40 text-violet-300 bg-violet-500/10" : "border-white/10 text-slate-500"}`}>
                {cfg.hair ? "Showing" : "Hidden"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {HAIR_COLORS.map(c => (
                <button key={c} onClick={() => set("hairColor", c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${cfg.hairColor === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Eyes */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">Eye Color</p>
            <div className="flex gap-2">
              {EYE_COLORS.map(c => (
                <button key={c} onClick={() => set("eyeColor", c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${cfg.eyeColor === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Accessory */}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">Accessory</p>
            <div className="flex gap-2 flex-wrap">
              {ACCESSORIES.map(a => (
                <button key={a.id} onClick={() => set("accessory", a.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${cfg.accessory === a.id ? "border-violet-500/50 bg-violet-500/15 text-violet-300" : "border-white/10 text-slate-400 hover:border-white/20"}`}>
                  {a.label}
                </button>
              ))}
            </div>
            {cfg.accessory !== "none" && (
              <div className="flex gap-2 mt-2">
                {ACC_COLORS.map(c => (
                  <button key={c} onClick={() => set("accessoryColor", c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${cfg.accessoryColor === c ? "border-white scale-110" : "border-transparent"}`}
                    style={{ background: c }} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-white/[0.06]">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">
            <Check size={16} /> {saving ? "Saving..." : "Save Avatar"}
          </button>
        </div>
      </div>
    </div>
  );
}
