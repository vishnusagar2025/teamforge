import React, { useState } from "react";
import { profileService } from "../../services/teamService";
import { useAuth } from "../../context/AuthContext";
import AvatarDisplay from "./AvatarDisplay";
import toast from "react-hot-toast";
import { X, Check, Shuffle } from "lucide-react";

const SKIN_TONES = [
  { label: "Light",       val: "#FDDBB4" },
  { label: "Fair",        val: "#F5CBA7" },
  { label: "Medium",      val: "#E8A87C" },
  { label: "Tan",         val: "#C68642" },
  { label: "Brown",       val: "#8D5524" },
  { label: "Deep",        val: "#4A2912" },
];

const HAIR_COLORS = [
  { label: "Black",    val: "#1a1a1a" },
  { label: "Dark",     val: "#3B2314" },
  { label: "Brown",    val: "#6B3A2A" },
  { label: "Auburn",   val: "#A0522D" },
  { label: "Blonde",   val: "#D4A017" },
  { label: "Platinum", val: "#F0E68C" },
  { label: "Red",      val: "#C0392B" },
  { label: "Pink",     val: "#FF6B9D" },
  { label: "Blue",     val: "#3B82F6" },
  { label: "Purple",   val: "#7C3AED" },
  { label: "Green",    val: "#10B981" },
  { label: "White",    val: "#F5F5F5" },
];

const HAIR_STYLES = [
  { id: "short",  label: "Short" },
  { id: "long",   label: "Long" },
  { id: "curly",  label: "Curly" },
  { id: "bun",    label: "Bun" },
  { id: "none",   label: "Bald" },
];

const EYE_STYLES = [
  { id: "normal", label: "Normal" },
  { id: "wide",   label: "Wide" },
  { id: "sleepy", label: "Sleepy" },
  { id: "wink",   label: "Wink" },
];

const EYE_COLORS = [
  { label: "Black",  val: "#1a1a1a" },
  { label: "Brown",  val: "#5C3317" },
  { label: "Navy",   val: "#2E4057" },
  { label: "Green",  val: "#2E7D32" },
  { label: "Blue",   val: "#1565C0" },
  { label: "Gray",   val: "#546E7A" },
];

const MOUTH_STYLES = [
  { id: "smile",   label: "😊 Smile" },
  { id: "grin",    label: "😁 Grin" },
  { id: "neutral", label: "😐 Neutral" },
  { id: "open",    label: "😮 Open" },
];

const ACCESSORIES = [
  { id: "none",     label: "None" },
  { id: "glasses",  label: "👓 Glasses" },
  { id: "hat",      label: "🎩 Hat" },
  { id: "headband", label: "🎀 Headband" },
];

const ACC_COLORS = ["#5b5bd6","#06B6D4","#EF4444","#F59E0B","#10B981","#EC4899","#1a1a1a","#F5F5F5"];

const SHIRT_COLORS = [
  "#5b5bd6","#06B6D4","#EF4444","#10B981","#F59E0B","#EC4899",
  "#1a1a1a","#374151","#ffffff","#7C3AED","#DC2626","#065F46",
];

const BG_PAIRS = [
  ["#7C3AED","#06B6D4"],
  ["#DB2777","#7C3AED"],
  ["#059669","#06B6D4"],
  ["#D97706","#EF4444"],
  ["#2563EB","#7C3AED"],
  ["#0F172A","#1E293B"],
  ["#DC2626","#F59E0B"],
  ["#0891B2","#065F46"],
];

const RANDOM_CONFIGS = [
  { hairStyle: "short", hairColor: "#1a1a1a", skinColor: "#F5CBA7", eyeColor: "#1a1a1a", eyeStyle: "normal", mouthStyle: "smile", accessory: "none", cheeks: true, bgColor1: "#7C3AED", bgColor2: "#06B6D4", shirtColor: "#5b5bd6", accColor: "#5b5bd6" },
  { hairStyle: "long",  hairColor: "#C0392B", skinColor: "#E8A87C", eyeColor: "#2E4057", eyeStyle: "wide",   mouthStyle: "grin",  accessory: "glasses", cheeks: false, bgColor1: "#DB2777", bgColor2: "#7C3AED", shirtColor: "#EC4899", accColor: "#06B6D4" },
  { hairStyle: "curly", hairColor: "#3B2314", skinColor: "#8D5524", eyeColor: "#5C3317", eyeStyle: "normal", mouthStyle: "smile", accessory: "headband", cheeks: true, bgColor1: "#D97706", bgColor2: "#EF4444", shirtColor: "#F59E0B", accColor: "#EC4899" },
  { hairStyle: "bun",   hairColor: "#D4A017", skinColor: "#FDDBB4", eyeColor: "#2E7D32", eyeStyle: "sleepy", mouthStyle: "neutral", accessory: "none", cheeks: true, bgColor1: "#059669", bgColor2: "#06B6D4", shirtColor: "#10B981", accColor: "#5b5bd6" },
];

const DEFAULT_CFG = {
  skinColor: "#F5CBA7", hairColor: "#1a1a1a", hairStyle: "short",
  eyeColor: "#1a1a1a", eyeStyle: "normal", mouthStyle: "smile",
  accessory: "none", accColor: "#5b5bd6",
  bgColor1: "#7C3AED", bgColor2: "#06B6D4",
  shirtColor: "#5b5bd6", cheeks: true,
};

function SwatchRow({ label, items, cfgKey, cfg, set, isColor = true }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map(item => {
          const val = isColor ? item.val : item.id;
          const active = cfg[cfgKey] === val;
          return isColor ? (
            <button key={val} onClick={() => set(cfgKey, val)} title={item.label}
              style={{
                width: 28, height: 28, borderRadius: "50%", background: val, border: "none",
                cursor: "pointer", outline: active ? `3px solid var(--accent)` : "3px solid transparent",
                outlineOffset: 2, transition: "all 0.15s", transform: active ? "scale(1.15)" : "scale(1)"
              }} />
          ) : (
            <button key={val} onClick={() => set(cfgKey, val)}
              style={{
                padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 450,
                border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                background: active ? "rgba(91,91,214,0.12)" : "var(--surface2)",
                color: active ? "#a5b4fc" : "var(--text2)",
                cursor: "pointer", transition: "all 0.12s", fontFamily: "inherit"
              }}>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AvatarBuilder({ onClose }) {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("face");

  const parseConfig = () => {
    try { return user?.avatar_config ? JSON.parse(user.avatar_config) : {}; }
    catch { return {}; }
  };

  const [cfg, setCfg] = useState({ ...DEFAULT_CFG, ...parseConfig() });
  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  const randomize = () => {
    const r = RANDOM_CONFIGS[Math.floor(Math.random() * RANDOM_CONFIGS.length)];
    setCfg({ ...DEFAULT_CFG, ...r });
  };

  const save = async () => {
    setSaving(true);
    try {
      await profileService.updateAvatar(cfg);
      updateUser({ avatar_config: JSON.stringify(cfg) });
      toast.success("Avatar saved!");
      onClose();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const previewUser = { ...user, avatar_config: JSON.stringify(cfg) };

  const TABS = ["face", "hair", "style", "bg"];
  const TAB_LABELS = { face: "Face", hair: "Hair", style: "Style", bg: "Background" };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }}>
      <div style={{
        width: "100%", maxWidth: 460,
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        maxHeight: "92vh", display: "flex", flexDirection: "column"
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Customize your avatar</h2>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={randomize} className="btn btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 12, gap: 5 }} title="Random look">
              <Shuffle size={13} /> Random
            </button>
            <button onClick={onClose} className="btn btn-ghost" style={{ height: 32, width: 32, padding: 0 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 16px", background: "var(--bg)" }}>
          <div style={{
            width: 110, height: 110, borderRadius: "50%", overflow: "hidden",
            boxShadow: "0 0 0 3px var(--accent), 0 0 0 6px rgba(91,91,214,0.15)"
          }}>
            <AvatarDisplay user={previewUser} size={110} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", padding: "0 20px", gap: 4, borderBottom: "1px solid var(--border)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 14px", fontSize: 13, fontWeight: 450,
                border: "none", background: "none", cursor: "pointer",
                color: activeTab === tab ? "var(--text)" : "var(--text3)",
                borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "all 0.12s", fontFamily: "inherit"
              }}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Options */}
        <div style={{ padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>

          {activeTab === "face" && <>
            <SwatchRow label="Skin Tone" items={SKIN_TONES} cfgKey="skinColor" cfg={cfg} set={set} isColor />
            <SwatchRow label="Eye Color" items={EYE_COLORS} cfgKey="eyeColor" cfg={cfg} set={set} isColor />
            <SwatchRow label="Eye Shape" items={EYE_STYLES} cfgKey="eyeStyle" cfg={cfg} set={set} isColor={false} />
            <SwatchRow label="Expression" items={MOUTH_STYLES} cfgKey="mouthStyle" cfg={cfg} set={set} isColor={false} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rosy Cheeks</p>
              <button onClick={() => set("cheeks", !cfg.cheeks)} style={{
                padding: "5px 14px", borderRadius: 7, fontSize: 12,
                border: `1px solid ${cfg.cheeks ? "var(--accent)" : "var(--border)"}`,
                background: cfg.cheeks ? "rgba(91,91,214,0.12)" : "var(--surface2)",
                color: cfg.cheeks ? "#a5b4fc" : "var(--text2)",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s"
              }}>
                {cfg.cheeks ? "✓ On" : "Off"}
              </button>
            </div>
          </>}

          {activeTab === "hair" && <>
            <SwatchRow label="Hair Style" items={HAIR_STYLES} cfgKey="hairStyle" cfg={cfg} set={set} isColor={false} />
            <SwatchRow label="Hair Color" items={HAIR_COLORS} cfgKey="hairColor" cfg={cfg} set={set} isColor />
          </>}

          {activeTab === "style" && <>
            <SwatchRow label="Accessory" items={ACCESSORIES} cfgKey="accessory" cfg={cfg} set={set} isColor={false} />
            {cfg.accessory !== "none" && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Accessory Color</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ACC_COLORS.map(c => (
                    <button key={c} onClick={() => set("accColor", c)}
                      style={{
                        width: 28, height: 28, borderRadius: "50%", background: c, border: "none",
                        cursor: "pointer", outline: cfg.accColor === c ? "3px solid var(--accent)" : "3px solid transparent",
                        outlineOffset: 2, transition: "all 0.15s", transform: cfg.accColor === c ? "scale(1.15)" : "scale(1)"
                      }} />
                  ))}
                </div>
              </div>
            )}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Shirt Color</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {SHIRT_COLORS.map(c => (
                  <button key={c} onClick={() => set("shirtColor", c)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: c, border: "1px solid var(--border)",
                      cursor: "pointer", outline: cfg.shirtColor === c ? "3px solid var(--accent)" : "3px solid transparent",
                      outlineOffset: 2, transition: "all 0.15s", transform: cfg.shirtColor === c ? "scale(1.15)" : "scale(1)"
                    }} />
                ))}
              </div>
            </div>
          </>}

          {activeTab === "bg" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Background Gradient</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {BG_PAIRS.map(([c1, c2]) => {
                  const active = cfg.bgColor1 === c1 && cfg.bgColor2 === c2;
                  return (
                    <button key={c1+c2} onClick={() => { set("bgColor1", c1); set("bgColor2", c2); }}
                      style={{
                        width: "100%", aspectRatio: "1",
                        background: `linear-gradient(135deg,${c1},${c2})`,
                        border: active ? "3px solid white" : "3px solid transparent",
                        borderRadius: 10, cursor: "pointer",
                        outline: active ? "2px solid var(--accent)" : "none",
                        outlineOffset: 2, transition: "all 0.15s"
                      }} />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, height: 38 }}>Cancel</button>
          <button onClick={save} disabled={saving} className="btn btn-primary" style={{ flex: 2, height: 38 }}>
            <Check size={14} /> {saving ? "Saving..." : "Save avatar"}
          </button>
        </div>
      </div>
    </div>
  );
}
