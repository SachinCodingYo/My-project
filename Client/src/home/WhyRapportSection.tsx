import React from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .feature-card { transition: background 0.22s ease, transform 0.22s ease; }
  .feature-card:hover { background: rgba(255,255,255,0.10) !important; transform: translateY(-4px); }
`;

const NAVY = "#0F172A";
const WHITE = "#FFFFFF";

const features = [
  {
    emoji: "⭐",
    title: "4.9 Star App Rating",
    desc: "Loved by millions of travelers worldwide for unmatched reliability and ease of use.",
    stat: "4.9 / 5",
  },
  {
    emoji: "💰",
    title: "90% Cheaper Than Roaming",
    desc: "Save massively on international roaming with our affordable global data plans.",
    stat: "Save 90%",
  },
  {
    emoji: "🔐",
    title: "100% Secure Connection",
    desc: "Encrypted, private connections ensuring your data stays safe everywhere you travel.",
    stat: "256-bit SSL",
  },
];

const WhyRapportSection = () => (
  <section style={s.root}>
    <style>{css}</style>
    <div style={s.inner}>

      {/* Left column */}
      <div style={s.left}>
        <p style={s.eyebrow}>Why Us</p>
        <h2 style={s.heading}>
          Why Choose<br />
          <span style={{ color: "#60A5FA" }}>Rapport</span>?
        </h2>
        <p style={s.sub}>
          We're not just another SIM provider. We're your trusted travel companion
          across 190+ countries.
        </p>

        <div style={s.checkList}>
          {["190+ Countries Covered", "Instant Activation", "24/7 Live Support", "No Hidden Charges"].map((item) => (
            <div key={item} style={s.checkItem}>
              <span style={s.checkIcon}>✓</span>
              <span style={s.checkLabel}>{item}</span>
            </div>
          ))}
        </div>

        <div style={s.trustedRow}>
          <p style={s.trustedLabel}>Trusted by</p>
          <div style={s.avatarStack}>
            {["https://i.pravatar.cc/40?img=1","https://i.pravatar.cc/40?img=2","https://i.pravatar.cc/40?img=3","https://i.pravatar.cc/40?img=4"].map((src, i) => (
              <img key={i} src={src} alt="" style={{ ...s.avatar, left: i * 28 }} />
            ))}
          </div>
          <span style={s.trustedCount}>2M+ Travelers</span>
        </div>
      </div>

      {/* Right cards */}
      <div style={s.cards}>
        {features.map((f, i) => (
          <div
            key={i}
            style={{ ...s.card, animationDelay: `${i * 100}ms` }}
            className="feature-card"
          >
            <div style={s.cardTop}>
              <div style={s.emojiWrap}>{f.emoji}</div>
              <span style={s.statBadge}>{f.stat}</span>
            </div>
            <h3 style={s.cardTitle}>{f.title}</h3>
            <p style={s.cardDesc}>{f.desc}</p>
            <div style={s.cardBar}>
              <div style={{ ...s.cardBarFill, width: i === 0 ? "98%" : i === 1 ? "90%" : "100%" }} />
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

const s: Record<string, React.CSSProperties> = {
  root: {
    background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
    padding: "88px 24px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  inner: {
    maxWidth: 1200, margin: "0 auto",
    display: "grid", gridTemplateColumns: "1fr 1.6fr",
    gap: 72, alignItems: "center",
  },
  left: {},
  eyebrow: {
    fontSize: 12, fontWeight: 700, color: "#60A5FA",
    letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 14,
  },
  heading: {
    fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 900,
    color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 18,
  },
  sub: { fontSize: 15, color: "#94A3B8", lineHeight: 1.7, fontWeight: 500, marginBottom: 36 },
  checkList: { display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 40 },
  checkItem: { display: "flex", alignItems: "center", gap: 12 },
  checkIcon: {
    width: 22, height: 22, borderRadius: "50%",
    background: "rgba(96,165,250,0.15)", border: "1px solid #60A5FA",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 800, color: "#60A5FA", flexShrink: 0,
  } as any,
  checkLabel: { fontSize: 14, fontWeight: 600, color: "#CBD5E1" },
  trustedRow: { display: "flex", alignItems: "center", gap: 16 },
  trustedLabel: { fontSize: 13, color: "#94A3B8", fontWeight: 500 },
  avatarStack: { position: "relative" as const, width: 100, height: 36 },
  avatar: {
    position: "absolute" as const, top: 0,
    width: 32, height: 32, borderRadius: "50%",
    border: "2px solid #1E3A8A", objectFit: "cover",
  } as any,
  trustedCount: { fontSize: 14, fontWeight: 700, color: WHITE },
  cards: { display: "flex", flexDirection: "column" as const, gap: 16 },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 20, padding: "28px 28px 24px",
    backdropFilter: "blur(10px)",
    animation: "fadeUp 0.5s ease both",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  emojiWrap: { fontSize: 32, lineHeight: 1 },
  statBadge: {
    background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)",
    color: "#93C5FD", fontSize: 12, fontWeight: 700,
    padding: "4px 12px", borderRadius: 20,
  },
  cardTitle: { fontSize: 17, fontWeight: 800, color: WHITE, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: "#94A3B8", lineHeight: 1.7, fontWeight: 500, marginBottom: 16 },
  cardBar: { height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" },
  cardBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #60A5FA, #6366F1)",
    borderRadius: 99,
  },
};

export default WhyRapportSection;
