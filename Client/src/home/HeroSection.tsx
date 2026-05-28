import { px } from "framer-motion/dom";
import { useState } from "react";
import {hero2} from "../assets";
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse2 { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .search-btn:hover { background: #1D4ED8 !important; }
  .hero-pill { transition: box-shadow 0.2s; }
  .hero-pill:hover { box-shadow: 0 4px 20px rgba(37,99,235,0.15) !important; }
`;

const BLUE = "#2563EB";
const NAVY = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";

const HeroSection = () => {
  const [query, setQuery] = useState("");

  const pills = [
    { emoji: "📶", label: "Instant 4G/5G Activation" },
    { emoji: "🔒", label: "100% Internet Connectivity" },
    { emoji: "⏰", label: "24/7 Live Support" },
  ];

  return (
    <section style={s.root}>
      <style>{globalCSS}</style>

      <div style={s.blob1} aria-hidden />
      <div style={s.blob2} aria-hidden />
      <div style={s.grid} aria-hidden />

      <div style={s.inner}>
        {/* Eyebrow */}
        <div style={s.eyebrow} className="fade-up">
          <span style={s.liveDot} />
          <span style={s.eyebrowText}>#1 Global SIM Provider</span>
        </div>

        {/* Heading */}
        <h1 style={s.heading} className="fade-up">
          Travel smarter with&nbsp;
          <span style={{ color: BLUE }}>Rapport</span>
          <br />prepaid plans.
        </h1>

        <p style={s.sub} className="fade-up">
          Instant activation in 190+ countries. No hidden fees. Stay connected everywhere.
        </p>

        {/* Pills */}
        <div style={s.pills} className="fade-up">
          {pills.map((p, i) => (
            <div key={i} style={s.pill} className="hero-pill">
              <span style={s.pillEmoji}>{p.emoji}</span>
              <span style={s.pillLabel}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={s.searchWrap} className="fade-up">
          <div style={s.searchBox}>
            <span style={{ padding: "0 16px", fontSize: 20 }}>🌍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or region..."
              style={s.input}
            />
            <button style={s.searchBtn} className="search-btn">Find Plans →</button>
          </div>
          <p style={s.hint}>Popular: India, USA, UAE, Japan, Singapore</p>
        </div>

        {/* Stats */}
        <div style={s.stats} className="fade-up">
          {[["190+", "Countries"], ["2M+", "Happy Travelers"], ["4.9★", "App Rating"]].map(([val, lbl]) => (
            <div key={lbl} style={s.stat}>
              <span style={s.statVal}>{val}</span>
              <span style={s.statLbl}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const s: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    background: `url(${hero2})`,
    backgroundSize: "cover",
    overflow: "hidden",
    padding: "100px 24px 80px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  blob1: {
    position: "absolute", top: -120, right: -80,
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: -80, left: -100,
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  inner: { position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", textAlign: "center" },
  eyebrow: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: WHITE, border: "1px solid rgba(37,99,235,0.15)",
    borderRadius: 30, padding: "6px 16px",
    marginBottom: 28, boxShadow: "0 2px 12px rgba(37,99,235,0.10)",
  },
  liveDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 3px rgba(34,197,94,0.25)",
    animation: "pulse2 2s infinite",
    display: "inline-block",
  },
  eyebrowText: { fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.06em", textTransform: "uppercase" as const },
  heading: {
    fontSize: "clamp(2rem, 5vw, 3.6rem)",
    fontWeight: 900, color: NAVY,
    lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: 20,
  },
  sub: { fontSize: 17, color: MUTED, lineHeight: 1.7, marginBottom: 36, fontWeight: 500 },
  pills: { display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: 12, marginBottom: 44 },
  pill: {
    display: "flex", alignItems: "center", gap: 8,
    background: WHITE, border: "1px solid rgba(37,99,235,0.12)",
    borderRadius: 30, padding: "8px 18px",
    boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
  },
  pillEmoji: {
    width: 30, height: 30, background: BLUE, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
  } as any,
  pillLabel: { fontSize: 13, fontWeight: 600, color: NAVY },
  searchWrap: { maxWidth: 580, margin: "0 auto 48px" },
  searchBox: {
    display: "flex", alignItems: "center",
    background: WHITE, borderRadius: 16,
    border: "2px solid #2563EB", overflow: "hidden",
    boxShadow: "0 4px 32px rgba(37,99,235,0.15)",
  },
  input: {
    flex: 1, border: "none", outline: "none",
    fontSize: 15, fontWeight: 500, color: NAVY,
    padding: "16px 8px", background: "transparent",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  searchBtn: {
    background: BLUE, color: WHITE, border: "none",
    padding: "16px 24px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", whiteSpace: "nowrap" as const,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: "background 0.2s", margin: "2px",
    borderRadius: 11,
  },
  hint: { fontSize: 12, color: MUTED, marginTop: 10 },
  stats: { display: "flex", justifyContent: "center", gap: 48 },
  stat: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 2 },
  statVal: { fontSize: 26, fontWeight: 900, color: BLUE, letterSpacing: "-0.03em" },
  statLbl: { fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: "0.04em" },
};

export default HeroSection;
