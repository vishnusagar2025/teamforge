import React from "react";
import logo from "../../assets/logo.png";

export default function Logo({ size = 32, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logo}
        alt="TeamForge"
        style={{ width: size, height: size }}
        className="rounded-xl object-contain"
      />
      {showText && (
        <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          TeamForge
        </span>
      )}
    </div>
  );
}
