import { useParams, useNavigate } from "react-router-dom";
import { REGIONS, STATIC_COUNTRIES } from "../data/esimData";

const BLUE   = "#2563EB";
const NAVY   = "#0F172A";
const MUTED  = "#64748B";
const BORDER = "#E8EDF5";
const BG     = "#F8FAFF";
const WHITE  = "#FFFFFF";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .rp-page { min-height:100vh; background:${WHITE}; font-family:'Plus Jakarta Sans',sans-serif; }

  .rp-hero {
    background:linear-gradient(160deg,#EFF6FF 0%,#F8FAFF 55%,#EEF2FF 100%);
    border-bottom:1.5px solid ${BORDER};
    padding:48px 24px 40px;
  }

  .back-btn {
    display:inline-flex; align-items:center; gap:7px;
    background:none; border:1.5px solid ${BORDER}; color:${MUTED};
    padding:8px 16px; border-radius:30px;
    font-size:13px; font-weight:700; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    transition:all .15s; margin-bottom:24px;
  }
  .back-btn:hover { border-color:${BLUE}; color:${BLUE}; background:#EFF6FF; }

  .c-card {
    background:${BG}; border-radius:20px; border:1.5px solid rgba(37,99,235,.08);
    padding:22px 14px; text-align:center;
    display:flex; flex-direction:column; align-items:center; gap:9px;
    box-shadow:0 2px 10px rgba(37,99,235,.04);
    cursor:pointer; animation:fadeUp .32s ease both;
    transition:transform .2s ease, box-shadow .2s ease, border-color .2s;
  }
  .c-card:hover { transform:translateY(-5px); box-shadow:0 14px 40px rgba(37,99,235,.14); border-color:rgba(37,99,235,.18); }
  .c-card:hover .sim-btn { background:${BLUE}!important; color:#fff!important; }
  .sim-btn {
    transition:all .15s; margin-top:2px; background:none;
    border:1.5px solid ${BLUE}; color:${BLUE}; border-radius:8px;
    padding:6px 13px; font-size:11px; font-weight:700; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
  }

  @media(max-width:600px) {
    .rp-hero { padding:32px 16px 28px; }
  }
`;

export default function RegionPage() {
  const { regionName } = useParams<{ regionName: string }>();
  const navigate       = useNavigate();

  const decoded = decodeURIComponent(regionName ?? "");
  const region  = REGIONS.find(r => r.name === decoded);

  const regionCountries = STATIC_COUNTRIES.filter(c =>
    region?.codes.includes(c.code)
  );

  if (!region) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🗺️</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 8 }}>Region not found</p>
          <button onClick={() => navigate(-1)} style={{
            background: BLUE, color: "#fff", border: "none", borderRadius: 12,
            padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="rp-page">

        {/* Hero */}
        <div className="rp-hero">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <span style={{ fontSize: 42, lineHeight: 1 }}>{region.emoji}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: BLUE, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                  Regional Plan
                </p>
                <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  {region.name} eSIM Plans
                </h1>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(37,99,235,.09)", color: BLUE, border: "1.5px solid rgba(37,99,235,.18)", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                {region.codes.length} countries
              </span>
              <span style={{ background: "rgba(5,150,105,.08)", color: "#059669", border: "1.5px solid rgba(5,150,105,.18)", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                From {region.price}
              </span>
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
                One eSIM, roam across all countries in this region
              </span>
            </div>
          </div>
        </div>

        {/* Countries grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 22 }}>
            Select a country to view individual plans
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 18 }}>
            {regionCountries.map((c, i) => (
              <div
                key={c.code}
                className="c-card"
                onClick={() => navigate(`/country/${c.code}`)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div style={{ width: 54, height: 38, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.12)", flexShrink: 0 }}>
                  <img
                    src={c.flag}
                    alt={c.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://flagcdn.com/w40/${c.code.toLowerCase()}.png`; }}
                  />
                </div>
                <p style={{ fontSize: 13, fontWeight: 800, color: NAVY, lineHeight: 1.3 }}>{c.name}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>{c.price}</p>
                <button className="sim-btn">View Plans →</button>
              </div>
            ))}
          </div>

          {/* Regional CTA */}
          <div style={{
            marginTop: 48,
            background: "linear-gradient(135deg,#EFF6FF 0%,#EEF2FF 100%)",
            border: "1.5px solid rgba(37,99,235,.14)", borderRadius: 20,
            padding: "28px 32px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 20, flexWrap: "wrap",
          }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 6 }}>
                Get the full {region.name} Plan
              </p>
              <p style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
                One eSIM, roams across all {region.codes.length} countries — no switching needed.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: BLUE }}>From {region.price}</p>
              <button style={{
                background: BLUE, color: "#fff", border: "none",
                borderRadius: 12, padding: "12px 24px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(37,99,235,.28)",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}>
                Buy Regional Plan →
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}