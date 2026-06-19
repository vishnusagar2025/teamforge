import React from "react";

const GRADIENT_PAIRS = [
  ["#7C3AED", "#06B6D4"],
  ["#DB2777", "#7C3AED"],
  ["#059669", "#06B6D4"],
  ["#D97706", "#EF4444"],
  ["#2563EB", "#7C3AED"],
  ["#DC2626", "#F59E0B"],
];

function getGradient(name) {
  const idx = (name?.charCodeAt(0) || 0) % GRADIENT_PAIRS.length;
  return GRADIENT_PAIRS[idx];
}

export default function AvatarDisplay({ user, size = 40, className = "" }) {
  const config = (() => {
    try { return user?.avatar_config ? JSON.parse(user.avatar_config) : null; }
    catch { return null; }
  })();

  const [c1, c2] = getGradient(user?.full_name);
  const initial = user?.full_name?.[0]?.toUpperCase() || "?";
  const fontSize = Math.round(size * 0.38);

  if (config) {
    return (
      <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
        {/* Base face */}
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: config.bgColor || `linear-gradient(135deg, ${c1}, ${c2})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize, fontWeight: 700, color: "#fff", overflow: "hidden",
          position: "relative",
        }}>
          {/* Hair */}
          {config.hair && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "45%", borderRadius: "50% 50% 0 0",
              background: config.hairColor || "#1a1a1a",
            }} />
          )}
          {/* Skin */}
          <div style={{
            position: "absolute", bottom: 0, left: "10%", right: "10%",
            height: "65%", borderRadius: "40% 40% 50% 50%",
            background: config.skinColor || "#F5CBA7",
          }} />
          {/* Eyes */}
          <div style={{ position: "absolute", top: "38%", left: "25%", width: size * 0.12, height: size * 0.12, borderRadius: "50%", background: config.eyeColor || "#1a1a1a" }} />
          <div style={{ position: "absolute", top: "38%", right: "25%", width: size * 0.12, height: size * 0.12, borderRadius: "50%", background: config.eyeColor || "#1a1a1a" }} />
          {/* Smile */}
          <div style={{
            position: "absolute", bottom: "22%", left: "30%", right: "30%",
            height: size * 0.08, borderRadius: "0 0 50% 50%",
            borderBottom: `2px solid ${config.eyeColor || "#1a1a1a"}`,
          }} />
          {/* Accessory overlay */}
          {config.accessory === "glasses" && (
            <div style={{
              position: "absolute", top: "35%", left: "20%", right: "20%",
              height: size * 0.16, border: `2px solid ${config.accessoryColor || "#6C3EF4"}`,
              borderRadius: 4, background: "transparent",
            }} />
          )}
          {config.accessory === "hat" && (
            <div style={{
              position: "absolute", top: 0, left: "15%", right: "15%",
              height: "30%", background: config.accessoryColor || "#6C3EF4",
              borderRadius: "4px 4px 0 0",
            }} />
          )}
        </div>
      </div>
    );
  }

  // Default: gradient + initial
  return (
    <div className={`shrink-0 flex items-center justify-center font-bold text-white ${className}`}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        fontSize, flexShrink: 0,
      }}>
      {initial}
    </div>
  );
}
