import React from "react";

const GRADIENTS = [
  ["#7C3AED","#06B6D4"], ["#DB2777","#7C3AED"], ["#059669","#06B6D4"],
  ["#D97706","#EF4444"], ["#2563EB","#7C3AED"], ["#DC2626","#F59E0B"],
  ["#0891B2","#7C3AED"], ["#65A30D","#06B6D4"],
];

function getGradient(name) {
  return GRADIENTS[(name?.charCodeAt(0) || 65) % GRADIENTS.length];
}

// SVG-based cartoon face — proper Snapchat-style
function AvatarSVG({ cfg, size }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  const hairStyles = {
    short:   `M${cx-s*0.32} ${cy-s*0.05} Q${cx} ${cy-s*0.48} ${cx+s*0.32} ${cy-s*0.05} Q${cx+s*0.28} ${cy-s*0.38} ${cx} ${cy-s*0.44} Q${cx-s*0.28} ${cy-s*0.38} ${cx-s*0.32} ${cy-s*0.05}Z`,
    long:    `M${cx-s*0.32} ${cy-s*0.05} Q${cx} ${cy-s*0.48} ${cx+s*0.32} ${cy-s*0.05} L${cx+s*0.34} ${cy+s*0.28} Q${cx+s*0.3} ${cy+s*0.32} ${cx+s*0.22} ${cy+s*0.2} L${cx-s*0.22} ${cy+s*0.2} Q${cx-s*0.3} ${cy+s*0.32} ${cx-s*0.34} ${cy+s*0.28}Z`,
    curly:   `M${cx-s*0.3} ${cy-s*0.05} Q${cx-s*0.38} ${cy-s*0.42} ${cx} ${cy-s*0.46} Q${cx+s*0.38} ${cy-s*0.42} ${cx+s*0.3} ${cy-s*0.05} Q${cx+s*0.36} ${cy-s*0.2} ${cx+s*0.3} ${cy-s*0.05} Q${cx-s*0.36} ${cy-s*0.2} ${cx-s*0.3} ${cy-s*0.05}Z`,
    bun:     null, // rendered separately
    none:    null,
  };

  const eyeShapes = {
    normal: (ex, ey) => <ellipse cx={ex} cy={ey} rx={s*0.055} ry={s*0.06} fill={cfg.eyeColor || "#1a1a1a"} />,
    wide:   (ex, ey) => <ellipse cx={ex} cy={ey} rx={s*0.07} ry={s*0.07} fill={cfg.eyeColor || "#1a1a1a"} />,
    sleepy: (ex, ey) => <ellipse cx={ex} cy={ey} rx={s*0.055} ry={s*0.035} fill={cfg.eyeColor || "#1a1a1a"} />,
    wink:   (ex, ey, isLeft) => isLeft
      ? <ellipse cx={ex} cy={ey} rx={s*0.055} ry={s*0.06} fill={cfg.eyeColor || "#1a1a1a"} />
      : <path d={`M${ex-s*0.055} ${ey} Q${ex} ${ey-s*0.04} ${ex+s*0.055} ${ey}`} stroke={cfg.eyeColor || "#1a1a1a"} strokeWidth={s*0.022} fill="none" strokeLinecap="round"/>,
  };

  const mouthShapes = {
    smile:   <path d={`M${cx-s*0.14} ${cy+s*0.14} Q${cx} ${cy+s*0.24} ${cx+s*0.14} ${cy+s*0.14}`} stroke={cfg.eyeColor || "#1a1a1a"} strokeWidth={s*0.025} fill="none" strokeLinecap="round"/>,
    grin:    <path d={`M${cx-s*0.16} ${cy+s*0.13} Q${cx} ${cy+s*0.26} ${cx+s*0.16} ${cy+s*0.13}`} stroke={cfg.eyeColor || "#1a1a1a"} strokeWidth={s*0.025} fill={cfg.skinColor || "#F5CBA7"} strokeLinecap="round"/>,
    neutral: <path d={`M${cx-s*0.1} ${cy+s*0.18} L${cx+s*0.1} ${cy+s*0.18}`} stroke={cfg.eyeColor || "#1a1a1a"} strokeWidth={s*0.022} fill="none" strokeLinecap="round"/>,
    open:    <ellipse cx={cx} cy={cy+s*0.18} rx={s*0.1} ry={s*0.07} fill={cfg.eyeColor || "#1a1a1a"}/>,
  };

  const eyeStyle = cfg.eyeStyle || "normal";
  const mouthStyle = cfg.mouthStyle || "smile";
  const hairStyle = cfg.hairStyle || "short";

  const lx = cx - s * 0.16;
  const rx = cx + s * 0.16;
  const ey = cy - s * 0.02;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg-${s}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cfg.bgColor1 || "#7C3AED"} />
          <stop offset="100%" stopColor={cfg.bgColor2 || "#06B6D4"} />
        </linearGradient>
        <clipPath id={`circle-${s}`}>
          <circle cx={cx} cy={cy} r={s*0.5} />
        </clipPath>
      </defs>

      {/* Background */}
      <circle cx={cx} cy={cy} r={s*0.5} fill={`url(#bg-${s})`} />

      <g clipPath={`url(#circle-${s})`}>
        {/* Neck */}
        <rect x={cx-s*0.1} y={cy+s*0.28} width={s*0.2} height={s*0.2} fill={cfg.skinColor || "#F5CBA7"} rx={s*0.04}/>

        {/* Face */}
        <ellipse cx={cx} cy={cy+s*0.02} rx={s*0.28} ry={s*0.32} fill={cfg.skinColor || "#F5CBA7"} />

        {/* Rosy cheeks */}
        {cfg.cheeks && <>
          <ellipse cx={lx-s*0.04} cy={cy+s*0.1} rx={s*0.07} ry={s*0.04} fill="rgba(255,100,100,0.18)" />
          <ellipse cx={rx+s*0.04} cy={cy+s*0.1} rx={s*0.07} ry={s*0.04} fill="rgba(255,100,100,0.18)" />
        </>}

        {/* Eyebrows */}
        <path d={`M${lx-s*0.07} ${ey-s*0.1} Q${lx} ${ey-s*0.14} ${lx+s*0.07} ${ey-s*0.1}`}
          stroke={cfg.hairColor || "#1a1a1a"} strokeWidth={s*0.022} fill="none" strokeLinecap="round" opacity="0.8"/>
        <path d={`M${rx-s*0.07} ${ey-s*0.1} Q${rx} ${ey-s*0.14} ${rx+s*0.07} ${ey-s*0.1}`}
          stroke={cfg.hairColor || "#1a1a1a"} strokeWidth={s*0.022} fill="none" strokeLinecap="round" opacity="0.8"/>

        {/* Eyes */}
        {(eyeShapes[eyeStyle] || eyeShapes.normal)(lx, ey, true)}
        {(eyeShapes[eyeStyle] || eyeShapes.normal)(rx, ey, false)}

        {/* Eye shine */}
        <circle cx={lx+s*0.025} cy={ey-s*0.025} r={s*0.015} fill="white" opacity="0.8"/>
        <circle cx={rx+s*0.025} cy={ey-s*0.025} r={s*0.015} fill="white" opacity="0.8"/>

        {/* Nose */}
        <path d={`M${cx-s*0.025} ${cy+s*0.06} Q${cx} ${cy+s*0.1} ${cx+s*0.025} ${cy+s*0.06}`}
          stroke={cfg.skinColor ? shadeColor(cfg.skinColor, -25) : "#D4956A"}
          strokeWidth={s*0.018} fill="none" strokeLinecap="round"/>

        {/* Mouth */}
        {mouthShapes[mouthStyle] || mouthShapes.smile}

        {/* Hair back layer */}
        {hairStyle !== "none" && hairStyles[hairStyle] && (
          <path d={hairStyles[hairStyle]} fill={cfg.hairColor || "#1a1a1a"} />
        )}

        {/* Bun */}
        {hairStyle === "bun" && <>
          <ellipse cx={cx} cy={cy-s*0.38} rx={s*0.12} ry={s*0.11} fill={cfg.hairColor || "#1a1a1a"}/>
          <path d={`M${cx-s*0.32} ${cy-s*0.05} Q${cx} ${cy-s*0.3} ${cx+s*0.32} ${cy-s*0.05}`} fill={cfg.hairColor || "#1a1a1a"}/>
        </>}

        {/* Hat */}
        {cfg.accessory === "hat" && <>
          <rect x={cx-s*0.3} y={cy-s*0.45} width={s*0.6} height={s*0.04} fill={cfg.accColor || "#5b5bd6"} rx={s*0.02}/>
          <rect x={cx-s*0.18} y={cy-s*0.44} width={s*0.36} height={s*0.2} fill={cfg.accColor || "#5b5bd6"} rx={s*0.04}/>
        </>}

        {/* Glasses */}
        {cfg.accessory === "glasses" && <>
          <circle cx={lx} cy={ey} r={s*0.09} stroke={cfg.accColor || "#5b5bd6"} strokeWidth={s*0.022} fill="rgba(120,180,255,0.12)"/>
          <circle cx={rx} cy={ey} r={s*0.09} stroke={cfg.accColor || "#5b5bd6"} strokeWidth={s*0.022} fill="rgba(120,180,255,0.12)"/>
          <line x1={lx+s*0.09} y1={ey} x2={rx-s*0.09} y2={ey} stroke={cfg.accColor || "#5b5bd6"} strokeWidth={s*0.018}/>
          <line x1={lx-s*0.09} y1={ey} x2={lx-s*0.14} y2={ey+s*0.02} stroke={cfg.accColor || "#5b5bd6"} strokeWidth={s*0.018}/>
          <line x1={rx+s*0.09} y1={ey} x2={rx+s*0.14} y2={ey+s*0.02} stroke={cfg.accColor || "#5b5bd6"} strokeWidth={s*0.018}/>
        </>}

        {/* Headband */}
        {cfg.accessory === "headband" && (
          <path d={`M${cx-s*0.32} ${cy-s*0.12} Q${cx} ${cy-s*0.42} ${cx+s*0.32} ${cy-s*0.12}`}
            stroke={cfg.accColor || "#f472b6"} strokeWidth={s*0.045} fill="none" strokeLinecap="round"/>
        )}

        {/* Body */}
        <ellipse cx={cx} cy={cy+s*0.6} rx={s*0.32} ry={s*0.22} fill={cfg.shirtColor || "#5b5bd6"} />
      </g>

      {/* Border ring */}
      <circle cx={cx} cy={cy} r={s*0.49} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={s*0.02}/>
    </svg>
  );
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace("#",""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
}

export default function AvatarDisplay({ user, size = 40, className = "" }) {
  const cfg = (() => {
    try { return user?.avatar_config ? JSON.parse(user.avatar_config) : null; }
    catch { return null; }
  })();

  const [c1, c2] = getGradient(user?.full_name);
  const initial = user?.full_name?.[0]?.toUpperCase() || "?";
  const fontSize = Math.round(size * 0.38);

  if (cfg) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }} className={className}>
        <AvatarSVG cfg={cfg} size={size} />
      </div>
    );
  }

  return (
    <div className={className} style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>
      {initial}
    </div>
  );
}
