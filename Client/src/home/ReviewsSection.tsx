import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .review-card { animation: fadeIn 0.4s ease both; }
  .dot-btn { transition: all 0.2s; cursor: pointer; border: none; padding: 0; }
  .dot-btn:hover { transform: scale(1.4); }
  .prev-next:hover { background: #EEF2FF !important; border-color: #2563EB !important; color: #2563EB !important; }
`;

const BLUE = "#2563EB";
const NAVY = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const SURFACE = "#F8FAFF";

const reviews = [
  {
    name: "Kavita Singh",
    city: "New Delhi",
    role: "Frequent Traveler",
    text: "Safe and simple service. I activated my SIM within minutes and the network worked perfectly throughout my entire trip to Japan. Never had this kind of reliability before!",
    avatar: "https://i.pravatar.cc/100?img=32",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    role: "Business Traveler",
    text: "Very fast activation and great pricing. Much cheaper than international roaming — I saved over ₹3,000 on a single trip. Will definitely use again for my Europe tour.",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    city: "Bangalore",
    role: "Digital Nomad",
    text: "Excellent experience from start to finish. Easy setup and strong network coverage across 4 countries back-to-back. The 24/7 support team was incredibly helpful.",
    avatar: "https://i.pravatar.cc/100?img=45",
    rating: 5,
  },
];

const ReviewsSection = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, []);

  const r = reviews[idx];

  const goTo = (i: number) => setIdx(i);
  const prev = () => setIdx((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIdx((i) => (i + 1) % reviews.length);

  return (
    <section style={s.root}>
      <style>{css}</style>
      <div style={s.inner}>

        <div style={s.headCenter}>
          <p style={s.eyebrow}>Social Proof</p>
          <h2 style={s.heading}>
            What Our <span style={{ color: BLUE }}>Customers Say</span>
          </h2>
        </div>

        {/* Review card */}
        <div style={s.card} className="review-card" key={idx}>
          <div style={s.quoteIcon}>"</div>

          {/* Stars */}
          <div style={s.stars}>
            {"⭐".repeat(r.rating)}
          </div>

          <p style={s.text}>{r.text}</p>

          <div style={s.reviewer}>
            <img src={r.avatar} alt={r.name} style={s.avatar} />
            <div style={s.reviewerInfo}>
              <p style={s.name}>{r.name}</p>
              <p style={s.role}>{r.role} · {r.city}</p>
            </div>
            <div style={s.verifiedBadge}>
              <span>✓</span> Verified
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={s.controls}>
          <button style={s.prevNext} className="prev-next" onClick={prev}>←</button>

          <div style={s.dots}>
            {reviews.map((_, i) => (
              <button
                key={i}
                style={{ ...s.dot, ...(i === idx ? s.dotActive : {}) }}
                className="dot-btn"
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <button style={s.prevNext} className="prev-next" onClick={next}>→</button>
        </div>

        {/* Stats strip */}
        <div style={s.statsStrip}>
          {[["50K+", "Reviews"], ["4.9", "Avg Rating"], ["98%", "Satisfaction"]].map(([val, lbl]) => (
            <div key={lbl} style={s.statItem}>
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
  root: { background: SURFACE, padding: "88px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  inner: { maxWidth: 700, margin: "0 auto", textAlign: "center" as const },
  headCenter: { marginBottom: 44 },
  eyebrow: { fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 },
  heading: { fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em" },
  card: {
    background: WHITE, borderRadius: 24,
    border: "1.5px solid rgba(37,99,235,0.08)",
    padding: "44px 40px", position: "relative" as const,
    boxShadow: "0 8px 48px rgba(37,99,235,0.10)",
    marginBottom: 28, textAlign: "left" as const,
  },
  quoteIcon: {
    position: "absolute" as const, top: 16, left: 28,
    fontSize: 90, fontWeight: 900,
    color: "rgba(37,99,235,0.06)", lineHeight: 1,
    fontFamily: "Georgia, serif",
    userSelect: "none" as const,
  },
  stars: { fontSize: 16, marginBottom: 18, letterSpacing: 2 },
  text: {
    fontSize: 17, color: MUTED, lineHeight: 1.85,
    fontWeight: 500, marginBottom: 30,
    fontStyle: "italic" as const,
  },
  reviewer: { display: "flex", alignItems: "center", gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: "50%", border: "2.5px solid #2563EB", objectFit: "cover" as const },
  reviewerInfo: { flex: 1 },
  name: { fontWeight: 800, fontSize: 15, color: NAVY, marginBottom: 2 },
  role: { fontSize: 12, color: MUTED, fontWeight: 500 },
  verifiedBadge: {
    display: "flex", alignItems: "center", gap: 4,
    background: "#F0FDF4", color: "#16A34A",
    fontSize: 11, fontWeight: 700,
    padding: "4px 10px", borderRadius: 20,
    border: "1px solid #86EFAC",
  },
  controls: { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 40 },
  prevNext: {
    width: 38, height: 38, borderRadius: "50%",
    border: "1.5px solid rgba(37,99,235,0.2)",
    background: WHITE, cursor: "pointer",
    fontSize: 16, color: NAVY, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.18s",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  } as any,
  dots: { display: "flex", gap: 8, alignItems: "center" },
  dot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "rgba(37,99,235,0.2)",
    transition: "all 0.2s",
  },
  dotActive: { background: BLUE, width: 24, borderRadius: 4 },
  statsStrip: {
    display: "flex", justifyContent: "center",
    gap: 48, padding: "28px 0",
    borderTop: "1px solid rgba(37,99,235,0.08)",
  },
  statItem: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4 },
  statVal: { fontSize: 28, fontWeight: 900, color: BLUE, letterSpacing: "-0.03em" },
  statLbl: { fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: "0.04em" },
};

export default ReviewsSection;
