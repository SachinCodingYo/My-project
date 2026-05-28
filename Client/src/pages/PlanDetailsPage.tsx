import { useNavigate, useParams } from "react-router-dom";
import { usePlanById } from "../hooks/useEsim";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  min-height: 100%;
  background: #F5F7FA;
  font-family: 'Inter', sans-serif;
  color: #111827;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Root ─── */
.pd-root {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: 60px;
}

/* ─── Nav ─── */
.pd-nav {
  position: sticky; top: 0; z-index: 40;
  height: 56px; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(245,247,250,0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #E5E7EB;
}
.pd-back {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px;
  border: 1px solid #E5E7EB; background: #fff;
  font-size: 13px; font-weight: 600; color: #6B7280;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: all 0.14s;
}
.pd-back:hover { color: #2563EB; border-color: #BFDBFE; background: #EFF6FF; }
.pd-nav-pill {
  padding: 5px 12px; border-radius: 20px;
  background: #EFF6FF; border: 1px solid #BFDBFE;
  font-size: 11px; font-weight: 700; color: #2563EB;
  letter-spacing: 0.03em;
}

/* ─── Page wrapper — NOT full width ─── */
.pd-page {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ─── HERO ─── */
.pd-hero {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  animation: fadeUp 0.35s ease both;
}

.pd-hero-top {
  padding: 22px 22px 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #F3F4F6;
}

.pd-plan-label {
  font-size: 11px; font-weight: 600;
  color: #9CA3AF; letter-spacing: 0.05em;
  text-transform: uppercase; margin-bottom: 6px;
}
.pd-plan-name {
  font-size: 22px; font-weight: 800;
  color: #111827; line-height: 1.2; margin-bottom: 4px;
}
.pd-plan-network {
  font-size: 13px; font-weight: 500; color: #6B7280;
}

.pd-price-right { text-align: right; flex-shrink: 0; }
.pd-price-label {
  font-size: 11px; font-weight: 600;
  color: #9CA3AF; letter-spacing: 0.05em;
  text-transform: uppercase; margin-bottom: 4px;
}
.pd-price {
  font-size: 36px; font-weight: 800;
  color: #2563EB; line-height: 1;
}
.pd-price-sym { font-size: 20px; font-weight: 700; }
.pd-currency {
  font-size: 11px; font-weight: 500;
  color: #9CA3AF; margin-top: 3px;
}

/* ─── Stats strip ─── */
.pd-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.pd-stat {
  padding: 16px 18px;
  border-right: 1px solid #F3F4F6;
}
.pd-stat:last-child { border-right: none; }
.pd-stat-icon {
  width: 28px; height: 28px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; margin-bottom: 8px;
}
.pd-stat-lbl {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9CA3AF; margin-bottom: 3px;
}
.pd-stat-val { font-size: 15px; font-weight: 700; color: #111827; }
.pd-stat-unit { font-size: 10px; color: #D1D5DB; font-weight: 500; margin-top: 1px; }

/* ─── Card ─── */
.pd-card {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  animation: fadeUp 0.35s ease both;
}
.pd-card-head {
  padding: 14px 20px;
  border-bottom: 1px solid #F3F4F6;
  display: flex; align-items: center; gap: 9px;
}
.pd-card-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.pd-card-title { font-size: 13px; font-weight: 700; color: #111827; }
.pd-card-sub { font-size: 11px; color: #9CA3AF; font-weight: 500; margin-top: 1px; }

/* ─── Rows ─── */
.pd-rows { padding: 4px 0; }
.pd-row {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #F9FAFB;
  transition: background 0.1s;
}
.pd-row:last-child { border-bottom: none; }
.pd-row:hover { background: #FAFAFA; }
.pd-row-key {
  font-size: 13px; font-weight: 500; color: #6B7280;
}
.pd-row-val {
  font-size: 13px; font-weight: 600; color: #111827;
  background: #F3F4F6; border: 1px solid #E5E7EB;
  border-radius: 6px; padding: 3px 10px;
}
.pd-row-val-green { background: #ECFDF5; border-color: #A7F3D0; color: #059669; }
.pd-row-val-blue  { background: #EFF6FF; border-color: #BFDBFE; color: #2563EB; }

/* ─── Countries ─── */
.pd-countries {
  padding: 16px 20px;
  display: flex; flex-wrap: wrap; gap: 7px;
}
.pd-country {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 8px;
  background: #F9FAFB; border: 1px solid #E5E7EB;
  font-size: 12.5px; font-weight: 600; color: #374151;
  transition: all 0.12s; cursor: default;
}
.pd-country:hover {
  border-color: #BFDBFE; background: #EFF6FF; color: #2563EB;
}

/* ─── Comms ─── */
.pd-comm-grid { display: grid; grid-template-columns: 1fr 1fr; }
.pd-comm {
  padding: 20px 22px; text-align: center;
  border-right: 1px solid #F3F4F6;
}
.pd-comm:last-child { border-right: none; }
.pd-comm-num { font-size: 32px; font-weight: 800; color: #111827; line-height: 1; }
.pd-comm-lbl {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: #9CA3AF; margin-top: 5px;
}
.pd-comm-unit { font-size: 11px; color: #D1D5DB; font-weight: 500; margin-top: 2px; }

/* ─── FUP ─── */
.pd-fup {
  margin: 14px 20px 16px;
  padding: 12px 14px; border-radius: 10px;
  background: #FFFBEB; border: 1px solid #FDE68A;
  display: flex; gap: 10px; align-items: flex-start;
}
.pd-fup-badge {
  padding: 2px 7px; border-radius: 5px;
  background: #FEF3C7; border: 1px solid #FDE68A;
  color: #92400E; font-size: 10px; font-weight: 700;
  letter-spacing: 0.05em; flex-shrink: 0; margin-top: 1px;
}
.pd-fup p { font-size: 12.5px; line-height: 1.6; color: #78350F; font-weight: 500; }

/* ─── Tags ─── */
.pd-tags { padding: 14px 20px; display: flex; flex-wrap: wrap; gap: 6px; }
.pd-tag {
  padding: 5px 11px; border-radius: 7px;
  font-size: 12px; font-weight: 600; cursor: default;
}
.pd-tag-blue  { background: #EFF6FF; border: 1px solid #BFDBFE; color: #2563EB; }
.pd-tag-green { background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; }
.pd-tag-slate { background: #F3F4F6; border: 1px solid #E5E7EB; color: #4B5563; }

/* ─── BUY BUTTON SECTION ─── */
.pd-buy-section {
  background: #fff;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  animation: fadeUp 0.35s ease both;
}
.pd-buy-info {}
.pd-buy-total-lbl {
  font-size: 11px; font-weight: 600;
  color: #9CA3AF; text-transform: uppercase;
  letter-spacing: 0.05em; margin-bottom: 3px;
}
.pd-buy-total-price {
  font-size: 26px; font-weight: 800;
  color: #111827; line-height: 1;
}
.pd-buy-total-sym { font-size: 16px; font-weight: 700; color: #6B7280; }
.pd-buy-sub {
  font-size: 11.5px; font-weight: 500;
  color: #9CA3AF; margin-top: 3px;
}
.pd-buy-btn {
  flex-shrink: 0;
  padding: 12px 28px;
  border: none; border-radius: 10px;
  background: #2563EB; color: #fff;
  font-size: 14px; font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 10px rgba(37,99,235,0.25);
  white-space: nowrap;
}
.pd-buy-btn:hover {
  background: #1D4ED8;
  box-shadow: 0 4px 16px rgba(37,99,235,0.35);
  transform: translateY(-1px);
}
.pd-buy-btn:active { transform: scale(0.98); }

/* ─── Loading / Error ─── */
.pd-center {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
  background: #F5F7FA; font-family: 'Inter', sans-serif;
}
.pd-spinner {
  width: 36px; height: 36px; border-radius: 50%;
  border: 3px solid #E5E7EB; border-top-color: #2563EB;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
.pd-err {
  text-align: center; max-width: 320px;
  background: #fff; border: 1px solid #E5E7EB;
  border-radius: 16px; padding: 36px 28px;
}
.pd-err h2 { font-size: 17px; font-weight: 700; margin: 10px 0 6px; }
.pd-err p  { font-size: 13px; color: #9CA3AF; margin-bottom: 18px; }
.pd-err-btn {
  padding: 10px 22px; border-radius: 8px; border: none;
  background: #2563EB; color: #fff;
  font-size: 13px; font-weight: 700; cursor: pointer;
  font-family: 'Inter', sans-serif;
}

/* ─── Responsive ─── */
@media (max-width: 600px) {
  .pd-nav { padding: 0 14px; }
  .pd-page { padding: 16px 12px 40px; }
  .pd-hero-top { flex-direction: column; }
  .pd-price-right { text-align: left; }
  .pd-stats { grid-template-columns: repeat(2, 1fr); }
  .pd-stat:nth-child(odd)  { border-right: 1px solid #F3F4F6; }
  .pd-stat:nth-child(even) { border-right: none; }
  .pd-stat { border-bottom: 1px solid #F3F4F6; }
  .pd-stat:nth-last-child(-n+2) { border-bottom: none; }
  .pd-buy-section { flex-direction: column; align-items: stretch; }
  .pd-buy-btn { text-align: center; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const StatCell = ({ icon, bg, label, value, unit }: {
  icon: string; bg: string; label: string;
  value?: string | number | null; unit?: string;
}) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="pd-stat">
      <div className="pd-stat-icon" style={{ background: bg }}>{icon}</div>
      <div className="pd-stat-lbl">{label}</div>
      <div className="pd-stat-val">{value}</div>
      {unit && <div className="pd-stat-unit">{unit}</div>}
    </div>
  );
};

const Row = ({ label, value, variant = "normal" }: {
  label: string;
  value?: string | number | null;
  variant?: "normal" | "green" | "blue";
}) => {
  if (value === undefined || value === null || value === "") return null;
  const cls =
    variant === "green" ? "pd-row-val pd-row-val-green" :
    variant === "blue"  ? "pd-row-val pd-row-val-blue"  : "pd-row-val";
  return (
    <div className="pd-row">
      <span className="pd-row-key">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const PlanDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: plan, isLoading } = usePlanById(id);

  if (isLoading) return (
    <>
      <style>{css}</style>
      <div className="pd-center">
        <div style={{ textAlign: "center" }}>
          <div className="pd-spinner" />
          <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>Loading plan…</p>
        </div>
      </div>
    </>
  );

  if (!plan) return (
    <>
      <style>{css}</style>
      <div className="pd-center">
        <div className="pd-err">
          <div style={{ fontSize: 38 }}>🔍</div>
          <h2>Plan not found</h2>
          <p>This plan may no longer be available.</p>
          <button className="pd-err-btn" onClick={() => navigate(-1)}>← Go back</button>
        </div>
      </div>
    </>
  );

  const networkTag = plan.network?.includes("5G")
    ? "5G Network"
    : plan.network?.includes("4G")
    ? "4G LTE"
    : null;

  return (
    <>
      <style>{css}</style>
      <div className="pd-root">

        {/* Nav */}
        <nav className="pd-nav">
          <button className="pd-back" onClick={() => navigate(-1)}>← Back to plans</button>
          <span className="pd-nav-pill">eSIM Plan</span>
        </nav>

        <div className="pd-page">

          {/* ── HERO ── */}
          <div className="pd-hero">
            <div className="pd-hero-top">
              <div>
                <div className="pd-plan-label">Plan name</div>
                <div className="pd-plan-name">{plan.name}</div>
                <div className="pd-plan-network">{plan.network}</div>
              </div>
              <div className="pd-price-right">
                <div className="pd-price-label">Price</div>
                <div className="pd-price">
                  <span className="pd-price-sym">₹</span>{plan.price}
                </div>
                {plan.currency && <div className="pd-currency">{plan.currency}</div>}
              </div>
            </div>

            <div className="pd-stats">
              <StatCell icon="📦" bg="#EFF6FF" label="Data"
                value={plan.isUnlimited ? "Unlimited" : plan.dataLimit} />
              <StatCell icon="📅" bg="#F0FDF4" label="Validity"
                value={plan.validityDays} unit="days" />
              <StatCell icon="📞" bg="#FFFBEB" label="Calls"
                value={plan.callInSeconds} unit="sec" />
              <StatCell icon="💬" bg="#FAF5FF" label="SMS"
                value={plan.sms} unit="/ day" />
            </div>
          </div>

          {/* ── COUNTRIES ── */}
          {plan.countries?.length > 0 && (
            <div className="pd-card" style={{ animationDelay: "50ms" }}>
              <div className="pd-card-head">
                <div className="pd-card-icon" style={{ background: "#EFF6FF" }}>🌍</div>
                <div>
                  <div className="pd-card-title">Coverage Countries</div>
                  <div className="pd-card-sub">
                    {plan.countries.length} countr{plan.countries.length === 1 ? "y" : "ies"} supported
                  </div>
                </div>
              </div>
              <div className="pd-countries">
                {plan.countries.map((c: any) => (
                  <div key={c._id} className="pd-country">🏳️ {c.name}</div>
                ))}
              </div>
            </div>
          )}

          {/* ── PLAN DETAILS ── */}
          <div className="pd-card" style={{ animationDelay: "80ms" }}>
            <div className="pd-card-head">
              <div className="pd-card-icon" style={{ background: "#F0FDF4" }}>📋</div>
              <div>
                <div className="pd-card-title">Plan Details</div>
                <div className="pd-card-sub">Full breakdown</div>
              </div>
            </div>
            <div className="pd-rows">
              <Row label="Data"
                value={plan.isUnlimited ? "Unlimited" : plan.dataLimit}
                variant={plan.isUnlimited ? "green" : "blue"} />
              <Row label="Validity"
                value={plan.validityDays != null ? `${plan.validityDays} days` : null} />
              <Row label="Network" value={plan.network} />
              <Row label="Coverage" value={plan.coverage} />
              <Row label="Data Type"
                value={plan.isUnlimited ? "Unlimited" : "Fixed"}
                variant={plan.isUnlimited ? "green" : "normal"} />
              {plan.dataInMb != null && (
                <Row label="Data in MB" value={`${plan.dataInMb} MB`} />
              )}
            </div>
          </div>

          {/* ── CALLS & SMS ── */}
          {(plan.callInSeconds != null || plan.sms != null) && (
            <div className="pd-card" style={{ animationDelay: "110ms" }}>
              <div className="pd-card-head">
                <div className="pd-card-icon" style={{ background: "#FFFBEB" }}>📞</div>
                <div>
                  <div className="pd-card-title">Calls & SMS</div>
                  <div className="pd-card-sub">Included in this plan</div>
                </div>
              </div>
              <div className="pd-comm-grid">
                {plan.callInSeconds != null && (
                  <div className="pd-comm">
                    <div className="pd-comm-num">{plan.callInSeconds}</div>
                    <div className="pd-comm-lbl">Call Quota</div>
                    <div className="pd-comm-unit">seconds</div>
                  </div>
                )}
                {plan.sms != null && (
                  <div className="pd-comm">
                    <div className="pd-comm-num">{plan.sms}</div>
                    <div className="pd-comm-lbl">SMS / Day</div>
                    <div className="pd-comm-unit">messages</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── FUP ── */}
          {plan.fupPolicy && (
            <div className="pd-card" style={{ animationDelay: "135ms" }}>
              <div className="pd-card-head">
                <div className="pd-card-icon" style={{ background: "#FFFBEB" }}>⚡</div>
                <div>
                  <div className="pd-card-title">Fair Usage Policy</div>
                  <div className="pd-card-sub">Speed limits after threshold</div>
                </div>
              </div>
              <div className="pd-fup">
                <span className="pd-fup-badge">FUP</span>
                <p>{plan.fupPolicy}</p>
              </div>
            </div>
          )}

          {/* ── HIGHLIGHTS ── */}
          <div className="pd-card" style={{ animationDelay: "160ms" }}>
            <div className="pd-card-head">
              <div className="pd-card-icon" style={{ background: "#F5F3FF" }}>✨</div>
              <div>
                <div className="pd-card-title">Highlights</div>
                <div className="pd-card-sub">Key features at a glance</div>
              </div>
            </div>
            <div className="pd-tags">
              {plan.isUnlimited && <span className="pd-tag pd-tag-green">♾️ Unlimited Data</span>}
              {networkTag && <span className="pd-tag pd-tag-blue">🚀 {networkTag}</span>}
              {plan.coverage && <span className="pd-tag pd-tag-slate">🌍 {plan.coverage}</span>}
              {plan.validityDays != null && (
                <span className="pd-tag pd-tag-slate">📅 {plan.validityDays} Day Validity</span>
              )}
              {plan.countries?.length > 0 && (
                <span className="pd-tag pd-tag-blue">
                  🗺️ {plan.countries.length} Countr{plan.countries.length === 1 ? "y" : "ies"}
                </span>
              )}
              <span className="pd-tag pd-tag-slate">📱 eSIM Ready</span>
              <span className="pd-tag pd-tag-slate">⚡ Instant Activation</span>
            </div>
          </div>

          {/* ── BUY NOW ── */}
          <div className="pd-buy-section" style={{ animationDelay: "185ms" }}>
            <div className="pd-buy-info">
              <div className="pd-buy-total-lbl">Total</div>
              <div className="pd-buy-total-price">
                <span className="pd-buy-total-sym">₹</span>{plan.price}
              </div>
              <div className="pd-buy-sub">
                {plan.isUnlimited
                  ? "Unlimited data"
                  : plan.dataLimit
                  ? plan.dataLimit
                  : ""}
                {plan.validityDays != null
                  ? ` · ${plan.validityDays} day validity`
                  : ""}
              </div>
            </div>
           <button
  className="pd-buy-btn"
  onClick={() => navigate(`/esim-buy-now/${plan._id}`)}
>
  Buy Now
</button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PlanDetailsPage;