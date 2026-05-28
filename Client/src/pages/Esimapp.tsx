import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";
import { STATIC_COUNTRIES, REGIONS, normaliseCountry, type EsimCountry, type EsimRegion } from "../data/esimData";

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

  .esim-page { min-height:100vh; background:${WHITE}; font-family:'Plus Jakarta Sans',sans-serif; }

  .esim-hero {
    background:linear-gradient(160deg,#EFF6FF 0%,#F8FAFF 55%,#EEF2FF 100%);
    border-bottom:1.5px solid ${BORDER};
    padding:56px 24px 44px; text-align:center;
  }

  .esim-tab {
    padding:10px 24px; border-radius:30px; font-size:13px; font-weight:700;
    border:1.5px solid ${BLUE}; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; transition:all .17s;
  }
  .esim-tab.active { background:${BLUE}; color:#fff; box-shadow:0 4px 18px rgba(37,99,235,.22); }
  .esim-tab:not(.active) { background:none; color:${BLUE}; }
  .esim-tab:not(.active):hover { background:#EFF6FF; }

  .esim-search {
    width:100%; padding:12px 16px 12px 42px; border-radius:14px;
    border:1.5px solid ${BORDER}; font-size:14px; font-weight:500; color:${NAVY};
    background:${WHITE}; font-family:'Plus Jakarta Sans',sans-serif;
    transition:border-color .15s, box-shadow .15s;
  }
  .esim-search:focus { outline:none; border-color:${BLUE}; box-shadow:0 0 0 3px rgba(37,99,235,.10); }
  .esim-search::placeholder { color:#B0BAC9; }

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

  .r-card {
    background:${BG}; border-radius:18px; border:1.5px solid rgba(37,99,235,.08);
    padding:18px 24px; display:flex; align-items:center; gap:18px;
    box-shadow:0 2px 8px rgba(37,99,235,.04);
    cursor:pointer; animation:fadeUp .32s ease both; transition:all .18s;
  }
  .r-card:hover { background:#EEF2FF; border-color:${BLUE}; transform:translateX(4px); box-shadow:0 6px 24px rgba(37,99,235,.10); }
  .r-card:hover .r-btn { background:#1d4ed8!important; }

  .view-more-btn {
    background:none; border:1.5px solid rgba(37,99,235,.2); color:${BLUE};
    padding:10px 28px; border-radius:30px; font-size:13px; font-weight:700;
    cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif;
    transition:background .15s, border-color .15s;
  }
  .view-more-btn:hover { background:#EFF6FF; border-color:${BLUE}; }

  .esim-section { max-width:1200px; margin:0 auto; padding:44px 24px 80px; }

  @media(max-width:600px) {
    .esim-hero { padding:38px 16px 32px; }
    .esim-section { padding:28px 14px 60px; }
  }
`;

const CountryCard = ({ country, index, onClick }: { country: EsimCountry; index: number; onClick: () => void }) => (
  <div className="c-card" onClick={onClick} style={{ animationDelay: `${index * 38}ms` }}>
    <div style={{ width: 54, height: 38, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.12)", flexShrink: 0 }}>
      <img
        src={country.flag}
        alt={country.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`; }}
      />
    </div>
    <p style={{ fontSize: 13, fontWeight: 800, color: NAVY, lineHeight: 1.3 }}>{country.name}</p>
    <p style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>{country.price}</p>
    <button className="sim-btn">Get SIM →</button>
  </div>
);

const RegionCard = ({ r, index, onClick }: { r: EsimRegion; index: number; onClick: () => void }) => (
  <div className="r-card" onClick={onClick} style={{ animationDelay: `${index * 50}ms` }}>
    <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{r.emoji}</div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 3 }}>{r.name}</p>
      <p style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{r.codes.length} countries</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: BLUE }}>From {r.price}</p>
      <button className="r-btn" style={{
        background: BLUE, color: "#fff", border: "none", borderRadius: 10,
        padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer",
        boxShadow: "0 3px 10px rgba(37,99,235,.25)",
        fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "background .15s",
      }}>Select →</button>
    </div>
  </div>
);

export default function EsimApp() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState<"countries" | "regions">("countries");
  const [search, setSearch]   = useState("");
  const [showAll, setShowAll] = useState(false);

  // initialData = static list → renders INSTANTLY, API refreshes in background
  const { data: apiData } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await apiClient.get("/countries");
      return res.data.data;
    },
    initialData: STATIC_COUNTRIES,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const allCountries: EsimCountry[] =
    Array.isArray(apiData) && apiData.length > 0 && apiData !== STATIC_COUNTRIES
      ? apiData.map(normaliseCountry)
      : STATIC_COUNTRIES;

  const filtered = allCountries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const visible  = showAll ? filtered : filtered.slice(0, 12);
  const hasMore  = filtered.length > 12 && !search;

  useEffect(() => { setShowAll(false); }, [tab, search]);

  return (
    <>
      <style>{CSS}</style>
      <div className="esim-page">

        {/* Hero */}
        <div className="esim-hero">
          <p style={{ fontSize: 11, fontWeight: 800, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            Connect Globally
          </p>
          <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.15 }}>
            Choose Your <span style={{ color: BLUE }}>Destination</span>
          </h1>
          <p style={{ fontSize: 15, color: MUTED, fontWeight: 500, marginBottom: 32 }}>
            Instant prepaid eSIM plans — no store visit, no SIM swap.
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
            <button className={`esim-tab${tab === "countries" ? " active" : ""}`} onClick={() => setTab("countries")}>
              🌍&nbsp; Popular Countries
            </button>
            <button className={`esim-tab${tab === "regions" ? " active" : ""}`} onClick={() => setTab("regions")}>
              🗺️&nbsp; Regional Plans
            </button>
          </div>

          {/* Search */}
          {tab === "countries" && (
            <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🔍</span>
              <input
                className="esim-search"
                type="text"
                placeholder="Search country…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "#E2E8F0", border: "none", borderRadius: "50%",
                  width: 20, height: 20, cursor: "pointer", fontSize: 11, color: MUTED,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="esim-section">

          {/* Countries */}
          {tab === "countries" && (
            <>
              {search && (
                <p style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 18, textAlign: "center" }}>
                  {filtered.length} countr{filtered.length !== 1 ? "ies" : "y"} found
                </p>
              )}
              {visible.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
                  <p style={{ fontSize: 38, marginBottom: 10 }}>🌍</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 6 }}>No results for "{search}"</p>
                  <p style={{ fontSize: 13 }}>Try a different country name.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 18 }}>
                    {visible.map((c, i) => (
                      <CountryCard
                        key={c.code}
                        country={c}
                        index={i}
                        onClick={() => navigate(`/country/${c.code}`)}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 34 }}>
                      <button className="view-more-btn" onClick={() => setShowAll(v => !v)}>
                        {showAll ? "↑ Show Less" : `↓ View All ${allCountries.length} Countries`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Regions */}
          {tab === "regions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {REGIONS.map((r, i) => (
                <RegionCard
                  key={r.name}
                  r={r}
                  index={i}
                  onClick={() => navigate(`/region/${encodeURIComponent(r.name)}`)}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}