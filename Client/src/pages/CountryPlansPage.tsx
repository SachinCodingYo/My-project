import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlans } from "../hooks/useEsim";

// ─── Design tokens — light theme ─────────────────────────────────────────────
const C = {
  bg:        "#F0F4FF",
  surface:   "#FFFFFF",
  sidebar:   "#FAFBFF",
  card:      "#FFFFFF",
  cardHov:   "#F5F8FF",
  border:    "#E4EAF4",
  borderHi:  "#3B82F6",
  blue:      "#2563EB",
  blueSoft:  "rgba(37,99,235,0.08)",
  blueGlow:  "rgba(37,99,235,0.12)",
  cyan:      "#0891B2",
  cyanSoft:  "rgba(8,145,178,0.08)",
  green:     "#059669",
  greenSoft: "rgba(5,150,105,0.08)",
  red:       "#DC2626",
  redSoft:   "rgba(220,38,38,0.07)",
  muted:     "#94A3B8",
  sub:       "#64748B",
  text:      "#0F172A",
  textSoft:  "#334155",
  white:     "#FFFFFF",
};

// ─── Filter config ────────────────────────────────────────────────────────────
const PRICE_OPTS = [
  { label: "Any",     value: ""  },
  { label: "< ₹300",  value: 300 },
  { label: "< ₹500",  value: 500 },
  { label: "< ₹999",  value: 999 },
];
const VALIDITY_OPTS = [
  { label: "Any",     value: ""  },
  { label: "1 day",   value: 1   },
  { label: "7 days",  value: 7   },
  { label: "15 days", value: 15  },
  { label: "30 days", value: 30  },
];
const NETWORK_OPTS = [
  { label: "Any", value: ""   },
  { label: "4G",  value: "4G" },
  { label: "5G",  value: "5G" },
];

// ─── Global CSS ───────────────────────────────────────────────────────────────
const css = `
 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${C.bg}; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Root layout ── */
  .esim-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
   font-family: 'Inter', sans-serif;
    background: ${C.bg};
    color: ${C.text};
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 272px;
    min-width: 272px;
    height: 100vh;
    overflow-y: auto;
    background: ${C.sidebar};
    border-right: 1.5px solid ${C.border};
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  /* ── Main column ── */
  .main-col {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: ${C.bg};
  }

  /* ── Top bar ── */
  .topbar {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(240,244,255,0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1.5px solid ${C.border};
    padding: 13px 26px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  /* ── Plans grid ── */
  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    padding: 22px 26px 0;
  }

  /* ── Plan card ── */
  .plan-card {
    background: ${C.card};
    border: 1.5px solid ${C.border};
   border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: border-color .18s, box-shadow .18s, transform .18s, background .18s;
    position: relative;
    overflow: hidden;
    animation: fadeSlideUp .38s ease both;
  }

  .detail-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px;
}

.detail-box span {
  display: block;
  font-size: 11px;
  color: #64748B;
  margin-bottom: 4px;
  font-weight: 500;
}

.detail-box strong {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}
  .plan-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, ${C.blueGlow} 0%, transparent 55%);
    opacity: 0;
    transition: opacity .22s;
    pointer-events: none;
    border-radius: 16px;
  }
  .plan-card:hover {
    border-color: ${C.borderHi};
    background: ${C.cardHov};
   
    box-shadow: 0 8px 32px rgba(37,99,235,.12), 0 0 0 1px rgba(37,99,235,.1);
  }
  .plan-card:hover::after { opacity: 1; }
  .plan-card:hover .card-arrow {
    background: ${C.blue} !important;
    border-color: ${C.blue} !important;
    color: #fff !important;
  }

  /* ── Filter pill ── */
  .fpill {
    border: 1.5px solid ${C.border};
    border-radius: 9px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
   font-family: 'Inter', sans-serif;
    transition: all .13s;
    white-space: nowrap;
    background: ${C.white};
    color: ${C.sub};
  }
  .fpill:hover { border-color: #93C5FD; color: ${C.blue}; background: #EFF6FF; }
  .fpill-on {
    background: ${C.blue} !important;
    border-color: ${C.blue} !important;
    color: #fff !important;
    box-shadow: 0 2px 10px rgba(37,99,235,.22);
  }

  /* ── Toggle ── */
  .toggle-track {
    width: 42px; height: 24px; border-radius: 12px;
    background: #E2E8F0;
    border: 1.5px solid #CBD5E1;
    position: relative; cursor: pointer;
    transition: background .18s, border-color .18s;
    flex-shrink: 0;
  }
  .toggle-track.on { background: ${C.blue}; border-color: ${C.blue}; }
  .toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: #fff;
    transition: transform .18s;
    box-shadow: 0 1px 4px rgba(0,0,0,.18);
  }
  .toggle-track.on .toggle-thumb { transform: translateX(18px); }

  /* ── Skeleton ── */
  .skel {
    background: linear-gradient(90deg, #E8EFF8 25%, #F5F8FF 50%, #E8EFF8 75%);
    background-size: 700px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 16px;
    height: 200px;
    border: 1.5px solid ${C.border};
  }

  /* ── Pagination ── */
  .pg-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid ${C.border};
    background: ${C.white};
    color: ${C.sub};
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all .14s;
   font-family: 'Inter', sans-serif;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .pg-btn:hover:not(:disabled) {
    border-color: ${C.blue};
    color: ${C.blue};
    background: #EFF6FF;
    box-shadow: 0 2px 8px rgba(37,99,235,.12);
  }
  .pg-btn.pg-active {
    background: ${C.blue};
    border-color: ${C.blue};
    color: #fff;
    box-shadow: 0 4px 14px rgba(37,99,235,.3);
  }
  .pg-btn:disabled { opacity: .35; cursor: not-allowed; }

  /* ── Misc ── */
  .back-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid ${C.border};
    background: ${C.white};
    color: ${C.sub};
    font-size: 16px;
    cursor: pointer;
    transition: all .14s;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .back-btn:hover { border-color: ${C.blue}; color: ${C.blue}; background: #EFF6FF; }

  .sort-sel {
    background: ${C.white};
    border: 1.5px solid ${C.border};
    border-radius: 10px;
    color: ${C.text};
    font-size: 12px;
    font-weight: 600;
   font-family: 'Inter', sans-serif;
    padding: 7px 30px 7px 11px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    transition: border-color .14s;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .sort-sel:focus { outline: none; border-color: ${C.blue}; }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid ${C.border};
    border-top-color: ${C.blue};
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Sidebar section label ── */
  .sec-label {
    font-size: 10px;
    font-weight: 700;
    color: ${C.muted};
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: 9px;
    display: block;
  }

  /* ── Clear btn ── */
  .clear-btn {
    width: 100%;
    background: ${C.redSoft};
    border: 1.5px solid rgba(220,38,38,.18);
    border-radius: 10px;
    padding: 9px;
    font-size: 12px;
    font-weight: 700;
    color: ${C.red};
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all .14s;
  }
  .clear-btn:hover { background: rgba(220,38,38,.13); }

  @media (max-width: 840px) {
    .sidebar { display: none; }
    .plans-grid { grid-template-columns: 1fr; padding: 14px 14px 0; }
    .topbar { padding: 11px 14px; }
  }
`;

// ─── PAGE SIZE ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ─── Sub-components ───────────────────────────────────────────────────────────
const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <div className={`toggle-track${on ? " on" : ""}`} onClick={onToggle}>
    <div className="toggle-thumb" />
  </div>
);

const PillGroup = ({
  label, opts, value, onChange,
}: {
  label: string;
  opts: { label: string; value: any }[];
  value: any;
  onChange: (v: any) => void;
}) => (
  <div style={{ marginBottom: 20 }}>
    <span className="sec-label">{label}</span>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {opts.map((o) => (
        <button
          key={o.label}
          className={`fpill${value === o.value ? " fpill-on" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {value === o.value && o.value !== "" ? "✓ " : ""}
          {o.label}
        </button>
      ))}
    </div>
  </div>
);

const SkeletonCard = ({ i }: { i: number }) => (
  <div className="skel" style={{ animationDelay: `${i * 80}ms` }} />
);

const StatChip = ({ icon, label, val }: { icon: string; label: string; val?: string }) =>
  val ? (
    <div style={{
      background: C.bg,
      border: `1.5px solid ${C.border}`,
      borderRadius: 11,
      padding: "8px 11px",
      flex: 1,
    }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>
        {icon} {label}
      </p>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.textSoft }}>{val}</p>
    </div>
  ) : null;

const PlanCard = ({
  plan,
  index,
  onClick,
}: {
  plan: any;
  index: number;
  onClick: () => void;
}) => {
  return (
    <div
      className="plan-card"
      onClick={onClick}
      style={{
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
          gap: 12,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: C.text,
              lineHeight: 1.4,
              marginBottom: 5,
            }}
          >
            {plan.name}
          </h3>

          <p
            style={{
              fontSize: 13,
              color: C.sub,
              fontWeight: 400,
            }}
          >
            {plan.network}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: C.blue,
              lineHeight: 1,
            }}
          >
            ₹{plan.price}
          </p>

          <p
            style={{
              fontSize: 11,
              color: C.muted,
              marginTop: 4,
            }}
          >
            {plan.currency}
          </p>
        </div>
      </div>

      {/* Main details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <div className="detail-box">
          <span>Data</span>
          <strong>{plan.dataLimit}</strong>
        </div>

        <div className="detail-box">
          <span>Validity</span>
          <strong>{plan.validityDays} Days</strong>
        </div>

        <div className="detail-box">
          <span>Coverage</span>
          <strong>{plan.coverage}</strong>
        </div>

        <div className="detail-box">
          <span>Type</span>
          <strong>
            {plan.isUnlimited ? "Unlimited" : "Limited"}
          </strong>
        </div>
      </div>

      {/* Country */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 14,
        }}
      >
        {plan.countries?.map((country: any) => (
          <div
            key={country._id}
            style={{
              background: "#EFF6FF",
              color: C.blue,
              border: "1px solid #BFDBFE",
              padding: "5px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {country.name}
          </div>
        ))}
      </div>

      {/* FUP */}
      {plan.fupPolicy && (
        <div
          style={{
            background: "#FEFCE8",
            border: "1px solid #FDE68A",
            borderRadius: 10,
            padding: 10,
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              lineHeight: 1.5,
              color: "#854D0E",
            }}
          >
            {plan.fupPolicy}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${C.border}`,
          paddingTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            fontSize: 12,
            color: C.sub,
          }}
        >
          <span>SMS: {plan.sms}</span>
          <span>Calls: {plan.callInSeconds}s</span>
        </div>

        <button 
          onClick={(e) => {
    e.stopPropagation();
    onClick();
  }}
          style={{
            border: "none",
            background: C.blue,
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View Plan
        </button>
      </div>
    </div>
  );
};
// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({
  currentPage, totalPages, onPage, isLoading,
}: {
  currentPage: number;
  totalPages: number;
  onPage: (p: number) => void;
  isLoading: boolean;
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };

  add(1);
  if (currentPage > 3) pages.push("…");
  for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) add(p);
  if (currentPage < totalPages - 2) pages.push("…");
  if (totalPages > 1) add(totalPages);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 5, padding: "28px 0 44px",
    }}>
      <button className="pg-btn" disabled={currentPage === 1 || isLoading} onClick={() => onPage(currentPage - 1)}>
        ‹
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ell-${i}`} style={{ color: C.muted, fontSize: 14, padding: "0 3px" }}>…</span>
        ) : (
          <button
            key={p}
            className={`pg-btn${currentPage === p ? " pg-active" : ""}`}
            disabled={isLoading}
            onClick={() => onPage(p as number)}
          >
            {p}
          </button>
        )
      )}

      <button className="pg-btn" disabled={currentPage === totalPages || isLoading} onClick={() => onPage(currentPage + 1)}>
        ›
      </button>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const CountryPlansPage = () => {
  const navigate        = useNavigate();
  const { countryCode } = useParams<{ countryCode: string }>();

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [maxPrice,    setMaxPrice]    = useState<number | "">("");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [validity,    setValidity]    = useState<number | "">("");
  const [network,     setNetwork]     = useState("");
  const [sortBy,      setSortBy]      = useState("price_asc");
  const [page,        setPage]        = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  const resetPage = () => setPage(1);

  const handleMaxPrice  = (v: any) => { setMaxPrice(v);          resetPage(); };
  const handleValidity  = (v: any) => { setValidity(v);          resetPage(); };
  const handleNetwork   = (v: any) => { setNetwork(v);           resetPage(); };
  const handleUnlimited = ()       => { setIsUnlimited(u => !u); resetPage(); };
  const handleSort      = (v: string) => { setSortBy(v);         resetPage(); };

  const clearFilters = useCallback(() => {
    setMaxPrice(""); setIsUnlimited(false);
    setValidity(""); setNetwork("");
    setSortBy("price_asc"); setPage(1);
  }, []);

  const hasActive = maxPrice !== "" || isUnlimited || validity !== "" || network !== "";

  // ── Params ───────────────────────────────────────────────────────────────────
  const params: Record<string, any> = {
    country: countryCode,
    sortBy,
    limit: PAGE_SIZE,
    page,
    ...(maxPrice    !== "" && { maxPrice }),
    ...(isUnlimited         && { isUnlimited: true }),
    ...(validity    !== "" && { validity }),
    ...(network     !== "" && { network }),
  };

  const { data, isLoading, isFetching } = usePlans(params);

  const plans      = Array.isArray(data) ? data : (data?.results ?? []);
  const total      = data?.total ?? plans.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const flagUrl = countryCode
    ? `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`
    : null;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="esim-root">

        {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
        <aside className="sidebar">

          {/* Header */}
          <div style={{
            padding: "22px 20px 18px",
            borderBottom: `1.5px solid ${C.border}`,
          }}>
            {/* Country identity */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button
                className="back-btn"
                onClick={() => navigate(-1)}
                style={{ width: 32, height: 32, fontSize: 14 }}
              >
                ←
              </button>
              {flagUrl && (
                <div style={{
                  width: 38, height: 27, borderRadius: 6, overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,.14)", flexShrink: 0,
                }}>
                  <img src={flagUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div>
                <p style={{
                  fontSize: 16, fontWeight: 800, color: C.text,
                  fontFamily: "'Syne', sans-serif", lineHeight: 1,
                }}>
                  {countryCode}
                </p>
                <p style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 2 }}>eSIM Plans</p>
              </div>
            </div>

            {/* Stats card */}
            <div style={{
              background: C.blueSoft,
              border: `1.5px solid rgba(37,99,235,.15)`,
              borderRadius: 12,
              padding: "12px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: ".07em" }}>
                  Total plans
                </p>
                <p style={{
                  fontSize: 24, fontWeight: 800, color: C.blue,
                  fontFamily: "'Syne', sans-serif", lineHeight: 1.1, marginTop: 2,
                }}>
                  {isLoading ? "—" : total}
                </p>
              </div>
              <div style={{
                fontSize: 28,
                filter: "drop-shadow(0 2px 6px rgba(37,99,235,.2))",
              }}>
                📶
              </div>
            </div>
          </div>

          {/* Filter body */}
          <div style={{ padding: "20px 20px 0", flex: 1 }}>

            {/* Sort */}
            <div style={{ marginBottom: 22 }}>
              <span className="sec-label">Sort by</span>
              <select
                className="sort-sel"
                style={{ width: "100%" }}
                value={sortBy}
                onChange={e => handleSort(e.target.value)}
              >
                <option value="price_asc">Price — Low to High</option>
                <option value="price_desc">Price — High to Low</option>
              </select>
            </div>

            <PillGroup label="Price"    opts={PRICE_OPTS}   value={maxPrice}  onChange={handleMaxPrice} />
            <PillGroup label="Validity" opts={VALIDITY_OPTS} value={validity}  onChange={handleValidity} />
            <PillGroup label="Network"  opts={NETWORK_OPTS}  value={network}   onChange={handleNetwork}  />

            {/* Unlimited toggle */}
            <div style={{ marginBottom: 22 }}>
              <span className="sec-label">Data type</span>
              <div
                onClick={handleUnlimited}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: isUnlimited ? C.blueSoft : C.white,
                  border: `1.5px solid ${isUnlimited ? "rgba(37,99,235,.25)" : C.border}`,
                  borderRadius: 11, padding: "11px 13px",
                  cursor: "pointer", transition: "all .15s",
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Unlimited Data</p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>High-speed + throttled</p>
                </div>
                <Toggle on={isUnlimited} onToggle={handleUnlimited} />
              </div>
            </div>

            {/* Clear */}
            {hasActive && (
              <button className="clear-btn" onClick={clearFilters}>
                ✕ Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
        <div className="main-col" ref={mainRef}>

          {/* Top bar */}
          <div className="topbar">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontSize: 16, fontWeight: 800, color: C.text,
                fontFamily: "'Syne', sans-serif",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {countryCode} eSIM Plans
              </h1>
              <p style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 1 }}>
                {isLoading
                  ? "Loading…"
                  : `${total} plan${total !== 1 ? "s" : ""} · Page ${page} of ${totalPages}`}
              </p>
            </div>

            {/* Active filter chips */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {maxPrice !== "" && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: C.blue,
                  background: C.blueSoft, border: "1.5px solid rgba(37,99,235,.18)",
                  padding: "4px 9px", borderRadius: 7,
                }}>
                  &lt;₹{maxPrice}
                </span>
              )}
              {isUnlimited && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: C.cyan,
                  background: C.cyanSoft, border: "1.5px solid rgba(8,145,178,.18)",
                  padding: "4px 9px", borderRadius: 7,
                }}>
                  Unlimited
                </span>
              )}
              {validity !== "" && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: C.green,
                  background: C.greenSoft, border: "1.5px solid rgba(5,150,105,.18)",
                  padding: "4px 9px", borderRadius: 7,
                }}>
                  {validity}d
                </span>
              )}
              {network !== "" && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#7C3AED",
                  background: "rgba(124,58,237,.08)", border: "1.5px solid rgba(124,58,237,.18)",
                  padding: "4px 9px", borderRadius: 7,
                }}>
                  {network}
                </span>
              )}
            </div>

            {isFetching && !isLoading && <div className="spinner" />}
          </div>

          {/* ── Grid / States ── */}
          {isLoading ? (
            <div className="plans-grid" style={{ paddingBottom: 40 }}>
              {[...Array(9)].map((_, i) => <SkeletonCard key={i} i={i} />)}
            </div>
          ) : plans.length > 0 ? (
            <>
              <div className="plans-grid">
                {plans.map((plan: any, i: number) => (
                  <PlanCard
                    key={plan._id}
                    plan={plan}
                    index={i}
                    onClick={() => navigate(`/plan/${plan._id}`)}
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPage={setPage}
                isLoading={isFetching}
              />
            </>
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: 40, textAlign: "center",
            }}>
              <div style={{ fontSize: 54, marginBottom: 16, opacity: .35 }}>📶</div>
              <h3 style={{
                fontSize: 20, fontWeight: 800, color: C.text,
                fontFamily: "'Syne', sans-serif", marginBottom: 8,
              }}>
                No plans match
              </h3>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.65 }}>
                Try adjusting the filters in the sidebar.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  background: C.blue, color: "#fff", border: "none",
                  borderRadius: 12, padding: "11px 24px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: "0 4px 16px rgba(37,99,235,.28)",
                }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CountryPlansPage;