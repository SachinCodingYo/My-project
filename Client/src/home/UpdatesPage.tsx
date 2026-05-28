import React from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .blog-card { transition: transform 0.22s ease, box-shadow 0.22s ease; cursor: pointer; }
  .blog-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(37,99,235,0.12) !important; }
  .read-more-btn { transition: all 0.18s; background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .read-more-btn:hover { opacity: 0.75; letter-spacing: 0.02em; }
  .view-all-btn { transition: background 0.18s; font-family: 'Plus Jakarta Sans', sans-serif; }
  .view-all-btn:hover { background: #EEF2FF !important; }
`;

const BLUE = "#2563EB";
const NAVY = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const SURFACE = "#F8FAFF";

const blogList = [
  {
    id: "1", tag: "5G",
    emoji: "📡", title: "5G Expansion in India",
    desc: "Telecom companies are rapidly expanding 5G coverage across major cities in India.",
    date: "Mar 20, 2026",
    readTime: "3 min read",
    bandBg: "#EFF6FF", accent: "#2563EB",
  },
  {
    id: "2", tag: "Plans",
    emoji: "📋", title: "Best Prepaid Plans 2026",
    desc: "Affordable prepaid plans with OTT benefits, unlimited data, and exclusive rewards.",
    date: "Mar 18, 2026",
    readTime: "5 min read",
    bandBg: "#F0FDF4", accent: "#16A34A",
  },
  {
    id: "3", tag: "Guide",
    emoji: "🔁", title: "How to Port Your Number Easily",
    desc: "A simple step-by-step guide for mobile number portability with zero downtime.",
    date: "Mar 15, 2026",
    readTime: "4 min read",
    bandBg: "#FFF7ED", accent: "#EA580C",
  },
  {
    id: "4", tag: "Offers",
    emoji: "🎁", title: "Upcoming Telecom Offers",
    desc: "Festive cashback deals, bonus data benefits, and referral bonuses coming soon.",
    date: "Mar 12, 2026",
    readTime: "2 min read",
    bandBg: "#FDF4FF", accent: "#9333EA",
  },
];

const UpdatesPage = () => {
  const navigate = useNavigate();

  return (
    <section style={s.root}>
      <style>{css}</style>
      <div style={s.inner}>

        {/* Head */}
        <div style={s.headRow}>
          <div>
            <p style={s.eyebrow}>Stay Informed</p>
            <h2 style={s.heading}>
              <span style={{ color: BLUE }}>Latest Updates</span> from Operators
            </h2>
            <p style={s.sub}>Telecom news, fresh offers, and industry highlights.</p>
          </div>
          <button style={s.viewAll} className="view-all-btn">
            View All Articles →
          </button>
        </div>

        {/* Blog grid */}
        <div style={s.grid}>
          {blogList.map((blog, i) => (
            <div
              key={blog.id}
              style={{ ...s.card, animationDelay: `${i * 80}ms` }}
              className="blog-card"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              {/* Top band */}
              <div style={{ ...s.band, background: blog.bandBg }}>
                <span style={{ ...s.tagChip, background: blog.accent }}>{blog.tag}</span>
                <span style={{ fontSize: 44 }}>{blog.emoji}</span>
              </div>

              {/* Body */}
              <div style={s.body}>
                <div style={s.meta}>
                  <span style={s.metaItem}>📅 {blog.date}</span>
                  <span style={s.metaDot} />
                  <span style={s.metaItem}>⏱ {blog.readTime}</span>
                </div>

                <h4 style={s.title}>{blog.title}</h4>
                <p style={s.desc}>{blog.desc}</p>

                <button
                  style={{ ...s.readMore, color: blog.accent }}
                  className="read-more-btn"
                  onClick={(e) => { e.stopPropagation(); navigate(`/blog/${blog.id}`); }}
                >
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const s: Record<string, React.CSSProperties> = {
  root: { background: WHITE, padding: "88px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  inner: { maxWidth: 1200, margin: "0 auto" },
  headRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-end", marginBottom: 48,
    flexWrap: "wrap" as const, gap: 20,
  },
  eyebrow: { fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 },
  heading: { fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: 8 },
  sub: { fontSize: 14, color: MUTED, fontWeight: 500 },
  viewAll: {
    background: WHITE, border: "1.5px solid #2563EB",
    color: BLUE, padding: "10px 22px", borderRadius: 10,
    fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 },
  card: {
    background: WHITE, borderRadius: 20,
    border: "1.5px solid rgba(37,99,235,0.08)",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(37,99,235,0.06)",
    animation: "fadeUp 0.5s ease both",
    display: "flex", flexDirection: "column" as const,
  },
  band: {
    height: 130, display: "flex",
    justifyContent: "space-between", alignItems: "center",
    padding: "0 22px", flexShrink: 0,
  },
  tagChip: {
    color: WHITE, fontSize: 11, fontWeight: 800,
    padding: "5px 13px", borderRadius: 20,
    letterSpacing: "0.06em", textTransform: "uppercase" as const,
  },
  body: { padding: "20px 22px 26px", display: "flex", flexDirection: "column" as const, flex: 1 },
  meta: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  metaItem: { fontSize: 11, color: MUTED, fontWeight: 500 },
  metaDot: { width: 3, height: 3, borderRadius: "50%", background: MUTED },
  title: { fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 10, lineHeight: 1.35 },
  desc: { fontSize: 13, color: MUTED, lineHeight: 1.75, marginBottom: 18, fontWeight: 500, flex: 1 },
  readMore: { fontSize: 13, fontWeight: 800, padding: 0 },
};

export default UpdatesPage;
