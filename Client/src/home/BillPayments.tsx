import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .bill-card { transition: box-shadow 0.2s, transform 0.2s; }
  .bill-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(37,99,235,0.10) !important; }
  .item-row { transition: background 0.15s; border-radius: 10px; cursor: pointer; }
  .item-row:hover { background: var(--cat-bg) !important; }
  .item-row:hover .item-name { color: var(--cat-accent) !important; }
`;

const NAVY = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const SURFACE = "#F8FAFF";
const BLUE = "#2563EB";

const categories = [
  {
    title: "Recharge", bg: "#EFF6FF", accent: "#2563EB",
    items: [
      { name: "Mobile", emoji: "📱" },
      { name: "DTH", emoji: "📺" },
      { name: "FASTag", emoji: "🚗" },
    ],
  },
  {
    title: "Utilities", bg: "#F0FDF4", accent: "#16A34A",
    items: [
      { name: "Electricity", emoji: "⚡" },
      { name: "Water", emoji: "💧" },
      { name: "Piped Gas", emoji: "🔥" },
      { name: "Municipal Taxes", emoji: "🏛️" },
    ],
  },
  {
    title: "Internet & TV", bg: "#FFF7ED", accent: "#EA580C",
    items: [
      { name: "Broadband", emoji: "📡" },
      { name: "Cable TV", emoji: "📻" },
      { name: "Landline", emoji: "☎️" },
    ],
  },
  {
    title: "Finance & Services", bg: "#FDF4FF", accent: "#9333EA",
    items: [
      { name: "Credit Card", emoji: "💳" },
      { name: "Insurance", emoji: "🛡️" },
      { name: "Education Fees", emoji: "🎓" },
      { name: "Book Cylinder", emoji: "🫙" },
    ],
  },
];

const BillPayments = () => {
  const navigate = useNavigate();
  const [hoverCTA, setHoverCTA] = useState(false);

  const ctaBtnStyle = {
    marginLeft: "auto",
    background: WHITE,
    color: BLUE,
    border: "none",
    borderRadius: 12,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    flexShrink: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: hoverCTA
      ? "0 8px 24px rgba(0,0,0,0.25)"
      : "0 4px 16px rgba(0,0,0,0.15)",
    transform: hoverCTA ? "translateY(-3px)" : "translateY(0)",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap" as const,
  };

  return (
    <section style={s.root}>
      <style>{css}</style>
      <div style={s.inner}>

        {/* Head */}
        <div style={s.headCenter}>
          <p style={s.eyebrow}>One-Stop Payments</p>
          <h2 style={s.heading}>
            Bill Payments & <span style={{ color: BLUE }}>Recharges</span>
          </h2>
          <p style={s.sub}>Pay all your bills, earn reward points. Zero convenience fee.</p>
        </div>

        {/* Cards */}
        <div style={s.grid}>
          {categories.map((cat, i) => (
            <div
              key={i}
              style={{ ...s.card, animationDelay: `${i * 80}ms` }}
              className="bill-card"
            >
              {/* Category header */}
              <div style={{ ...s.catHeader, background: cat.bg }}>
                <span style={{ ...s.catDot, background: cat.accent }} />
                <h3 style={{ ...s.catTitle, color: cat.accent }}>{cat.title}</h3>
                <span style={{ ...s.catArrow, color: cat.accent }}>›</span>
              </div>

              {/* Items */}
              <div style={s.itemList}>
                {cat.items.map((item, j) => (
                  <div
                    key={j}
                    style={{ ...s.itemRow, ["--cat-bg" as any]: cat.bg, ["--cat-accent" as any]: cat.accent }}
                    className="item-row"
                  >
                    <span style={{ ...s.itemIcon, background: cat.bg }}>
                      {item.emoji}
                    </span>
                    <span style={s.itemName} className="item-name">{item.name}</span>
                    <span style={{ color: cat.accent, fontWeight: 700, fontSize: 18 }}>›</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={s.ctaRow}>
          <div style={s.ctaCard}>
            <span style={s.ctaEmoji}>🎁</span>
            <div>
              <p style={s.ctaTitle}>Earn Reward Points on Every Payment</p>
              <p style={s.ctaSub}>Redeem points for discounts, cashback, and exclusive offers.</p>
            </div>
            <button
              style={ctaBtnStyle}
              onMouseEnter={() => setHoverCTA(true)}
              onMouseLeave={() => setHoverCTA(false)}
              onClick={() => navigate("/rewards")}
            >
              View Rewards →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

const s: Record<string, React.CSSProperties> = {
  root: { background: SURFACE, padding: "88px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  inner: { maxWidth: 1200, margin: "0 auto" },
  headCenter: { textAlign: "center", marginBottom: 52 },
  eyebrow: { fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 },
  heading: { fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: 12 },
  sub: { fontSize: 15, color: MUTED, fontWeight: 500 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, marginBottom: 36 },
  card: {
    background: WHITE, borderRadius: 22,
    border: "1.5px solid rgba(37,99,235,0.08)",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(37,99,235,0.06)",
    animation: "fadeUp 0.5s ease both",
  },
  catHeader: { display: "flex", alignItems: "center", gap: 10, padding: "16px 20px" },
  catDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  catTitle: { flex: 1, fontWeight: 800, fontSize: 15 },
  catArrow: { fontSize: 20, fontWeight: 700 },
  itemList: { padding: "8px 12px 16px" },
  itemRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 10px" },
  itemIcon: { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 } as any,
  itemName: { flex: 1, fontSize: 13, fontWeight: 600, color: NAVY, transition: "color 0.15s" },
  ctaRow: { marginTop: 8 },
  ctaCard: {
    background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
    borderRadius: 20, padding: "28px 32px",
    display: "flex", alignItems: "center", gap: 20,
    flexWrap: "wrap" as const,
    boxShadow: "0 8px 40px rgba(37,99,235,0.25)",
  },
  ctaEmoji: { fontSize: 48, flexShrink: 0 },
  ctaTitle: { fontSize: 18, fontWeight: 800, color: WHITE, marginBottom: 4 },
  ctaSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 },
};

export default BillPayments;