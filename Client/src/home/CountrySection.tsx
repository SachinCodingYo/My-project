import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Country {
  name: string;
  code: string;
  price: string;
  flag: string;
}

interface Region {
  name: string;
  price: string;
  emoji: string;
  countries: string;
  codes: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────
const countries: Country[] = [
   { name: "India", code: "IN", price: "₹199", flag: "https://flagcdn.com/in.svg" },
  { name: "United Arab Emirates", code: "AE", price: "₹400", flag: "https://flagcdn.com/ae.svg" },
  { name: "United States of America", code: "US", price: "₹540", flag: "https://flagcdn.com/us.svg" },
  { name: "Germany", code: "DE", price: "₹420", flag: "https://flagcdn.com/de.svg" },
  { name: "France", code: "FR", price: "₹410", flag: "https://flagcdn.com/fr.svg" },
  { name: "Afghanistan", code: "AF", price: "₹180", flag: "https://flagcdn.com/af.svg" },
  { name: "Canada", code: "CA", price: "₹430", flag: "https://flagcdn.com/ca.svg" },
  { name: "China", code: "CN", price: "₹360", flag: "https://flagcdn.com/cn.svg" },
 
  { name: "Russia", code: "RU", price: "₹370", flag: "https://flagcdn.com/ru.svg" },
];

const POPULAR = ["AE", "US", "DE", "FR", "AF", "CA", "CN", "IN", "RU"];

const regions: Region[] = [
  {
    name: "Asia",
    price: "₹999",
    emoji: "🌏",
    countries: "3 countries",
    codes: ["AE", "CN", "IN"],
  },
  {
    name: "Europe",
    price: "₹1499",
    emoji: "🌍",
    countries: "2 countries",
    codes: ["DE", "FR"],
  },
  {
    name: "Americas",
    price: "₹1699",
    emoji: "🗽",
    countries: "2 countries",
    codes: ["CA", "US"],
  },
];

// ... rest of the file stays exactly the same

const BLUE = "#2563EB";
const NAVY = "#0F172A";
const MUTED = "#64748B";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .c-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .c-card:hover { transform: translateY(-5px); box-shadow: 0 14px 40px rgba(37,99,235,0.14) !important; }
  .c-card:hover .sim-btn { background: #2563EB !important; color: #fff !important; }
  .sim-btn { transition: all 0.15s; }
  .r-card { transition: all 0.18s; }
  .r-card:hover { background: #EEF2FF !important; border-color: #2563EB !important; transform: translateX(4px); }
  .tab-btn { transition: all 0.18s; }
  .search-input:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
`;

// ─── Country Card ─────────────────────────────────────────────────────────────
const CountryCard = ({ c, index, onClick }: { c: Country; index: number; onClick: () => void }) => (
  <div
    className="c-card"
    onClick={onClick}
    style={{
      background: "#F8FAFF", borderRadius: 20,
      border: "1.5px solid rgba(37,99,235,0.08)",
      padding: "22px 14px", textAlign: "center" as const,
      display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 9,
      boxShadow: "0 2px 10px rgba(37,99,235,0.04)",
      animation: "fadeUp 0.35s ease both",
      animationDelay: `${index * 45}ms`,
      cursor: "pointer",
    }}
  >
    <div style={{ width: 54, height: 38, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
      <img src={c.flag} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <p style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{c.name}</p>
    <p style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>From {c.price}</p>
    <button
      className="sim-btn"
      style={{
        marginTop: 2, background: "none", border: "1.5px solid #2563EB",
        color: BLUE, borderRadius: 8, padding: "6px 13px",
        fontSize: 11, fontWeight: 700, cursor: "pointer",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      Get SIM →
    </button>
  </div>
);

// ─── Region Card ─────────────────────────────────────────────────────────────
const RegionCard = ({
  r,
  index,
  onClick,
}: {
  r: Region;
  index: number;
  onClick: () => void;
}) => (
  <div
    className="r-card"
    onClick={onClick}
    style={{
      background: "#F8FAFF", borderRadius: 18,
      border: "1.5px solid rgba(37,99,235,0.08)",
      padding: "18px 24px", display: "flex", alignItems: "center", gap: 18,
      boxShadow: "0 2px 8px rgba(37,99,235,0.04)",
      animation: "fadeUp 0.35s ease both",
      animationDelay: `${index * 60}ms`,
      cursor: "pointer",
    }}
  >
    <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{r.emoji}</div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 3 }}>{r.name}</p>
      <p style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{r.countries}</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 8 }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>From {r.price}</p>
      <button
        style={{
          background: BLUE, color: "#FFFFFF", border: "none",
          borderRadius: 10, padding: "8px 18px",
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 3px 10px rgba(37,99,235,0.25)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Select →
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CountrySection = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"countries" | "regions">("countries");
  const [showAll, setShowAll] = useState(false);

  
  

  // ✅ Filter client-side — never call API on keystroke
  const filteredCountries = countries;

 // ✅ Popular countries first
const popularCountries = filteredCountries.filter((c) =>
  POPULAR.includes(c.code)
);

// ✅ Other countries
const otherCountries = filteredCountries.filter(
  (c) => !POPULAR.includes(c.code)
);

// ✅ Show only popular initially
const visibleCountries =
  showAll
    ? [...popularCountries, ...otherCountries]
    : popularCountries;

  const visibleRegions = showAll ? regions : regions.slice(0, 4);

  // Reset showAll when tab changes
  useEffect(() => setShowAll(false), [tab]);

  const handleCountryClick = (code: string) => {
  navigate(`/country/${code}`);
  };
  const handleRegionClick = (regionName: string) => {
  navigate(`/region/${encodeURIComponent(regionName)}`);
};

  return (
    <section style={{ background: "#FFFFFF", padding: "80px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Head */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          
          <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Choose Your <span style={{ color: BLUE }}>Destination</span>
          </h2>
          <p style={{ fontSize: 15, color: MUTED, fontWeight: 500 }}>
            Instant prepaid eSIM plans — no store visit, no SIM swap.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          {(["countries", "regions"] as const).map((t) => (
            <button
              key={t}
              className="tab-btn"
            onClick={() => { setTab(t); }}
              style={{
                padding: "10px 24px", borderRadius: 30, fontSize: 13, fontWeight: 700,
                border: "1.5px solid #2563EB", background: tab === t ? BLUE : "none",
                color: tab === t ? "#FFFFFF" : BLUE, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: tab === t ? "0 4px 18px rgba(37,99,235,0.22)" : "none",
              }}
            >
              {t === "countries" ? "🌍  Popular Countries" : "🗺️  Regional Plans"}
            </button>
          ))}
        </div>

       

        {/* Countries grid */}
        {tab === "countries" && (
          <>
            {visibleCountries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: MUTED }}>
                <p style={{ fontSize: 32, marginBottom: 10 }}>🌍</p>
               <p style={{ fontWeight: 700, fontSize: 15 }}>
  No countries available
</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 18 }}>
                {visibleCountries.map((c, i) => (
                  <CountryCard
                    key={c.code}
                    c={c}
                    index={i}
                    onClick={() => handleCountryClick(c.code)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Regions list */}
        {tab === "regions" && (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 13 }}>
            {visibleRegions.map((r, i) => (
            <RegionCard
  key={r.name}
  r={r}
  index={i}
  onClick={() => handleRegionClick(r.name)}
/>
            ))}
          </div>
        )}

        {/* View more / less — hide if searching */}
        {otherCountries.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 34 }}>
            <button
              onClick={() => setShowAll((v) => !v)}
              style={{
                background: "none", border: "1.5px solid rgba(37,99,235,0.2)",
                color: BLUE, padding: "10px 28px", borderRadius: 30,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "background 0.15s",
              }}
            >
              {showAll ? "↑ Show Less" : "↓ View All"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default CountrySection;