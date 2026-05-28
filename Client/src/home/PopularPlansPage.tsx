import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../hooks/usePlans";
import { useServices } from "../hooks/useServices";


const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .plan-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .plan-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(37,99,235,0.14) !important; }
  .explore-btn { transition: all 0.18s ease; }
  .explore-btn:hover { background: #1D4ED8 !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(37,99,235,0.35) !important; }
  .view-all-btn:hover { background: #EEF2FF !important; }
`;

const BLUE = "#2563EB";
const NAVY = "#0F172A";
const MUTED = "#64748B";
const WHITE = "#FFFFFF";
const SURFACE = "#F8FAFF";
const BLUE_LIGHT = "#EEF2FF";

const PopularPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { data: services = [], isLoading: servicesLoading } = useServices();

  if (plansLoading || servicesLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #EEF2FF",
            borderTop: "3px solid #2563EB",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  // 🔥 Map services (optional fallback)
  const serviceMap: Record<string, any> = {};
  services.forEach((s) => {
    serviceMap[s._id] = s;
  });

  return (
    <section style={s.root}>
      <style>{css}</style>

      <div style={s.inner}>
        {/* Header */}
        <div style={s.headRow}>
          <div>
            <p style={s.eyebrow}>Curated For You</p>
            <h2 style={s.heading}>
              <span style={{ color: BLUE }}>Rapport's</span> Popular Plans
            </h2>
          </div>

         <button
  style={s.viewAll}
  className="view-all-btn"
  onClick={() => navigate("/simstore")}
>
  View All Plans →
</button>
        </div>

        {/* Grid */}
        <div style={s.grid}>
          {plans.slice(0, 6).map((plan: any, i: number) => {
            // ✅ Correct operator (same as PlanDetails)
            const operator =
              plan.operatorId || serviceMap[plan.operatorId?._id] || {};

            return (
              <div
                key={plan._id}
                style={{ ...s.card, animationDelay: `${i * 100}ms` }}
                className="plan-card"
              >
                {/* Header */}
                <div style={s.cardHead}>
                  <div style={s.opBadge}>
                    {operator?.logo ? (
                      <img
                        src={operator.logo}
                        alt=""
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 24 }}>📶</span>
                    )}

                    <div>
                      <p style={s.opName}>
                        {operator?.name || "Operator"}
                      </p>
                      <p style={s.opType}>
                        {plan.planTypeId?.name || "Prepaid"}
                      </p>
                    </div>
                  </div>

                  <div style={s.priceWrap}>
                    <span style={s.rupee}>₹</span>
                    <span style={s.priceNum}>
                      {plan.salePrice || plan.price}
                    </span>
                  </div>
                </div>

                {/* Data */}
                <div style={s.dataSection}>
                  <div style={s.dataRow}>
                    <span style={s.dataLabel}>{plan.data}</span>
                    <span style={s.dataValidity}>
                      📅 {plan.validity} Days
                    </span>
                  </div>

                  {/* <div style={s.bar}>
                    <div
                      style={{
                        ...s.barFill,
                        width:
                          plan.data === "Unlimited"
                            ? "100%"
                            : plan.data?.includes("2")
                            ? "70%"
                            : "50%",
                      }}
                    />
                  </div> */}
                </div>

                <div style={s.divider} />

                {/* Benefits */}
                <div style={s.benefits}>
                  {plan.benefits?.slice(0, 3).map((b: string, j: number) => (
                    <span key={j} style={s.chip}>
                      {b}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <button
                  style={s.exploreBtn}
                  className="explore-btn"
                  onClick={() =>
                    navigate(`/plan-details/${plan._id}`, {
                      state: plan,
                    })
                  }
                >
                  Explore Plan →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const s: Record<string, React.CSSProperties> = {
  root: {
    background: SURFACE,
    padding: "88px 24px",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  inner: { maxWidth: 1200, margin: "0 auto" },

  headRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 48,
    flexWrap: "wrap",
    gap: 16,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    color: BLUE,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  heading: {
    fontSize: "clamp(1.8rem,3vw,2.6rem)",
    fontWeight: 900,
    color: NAVY,
  },

  viewAll: {
    background: WHITE,
    border: `1.5px solid ${BLUE}`,
    color: BLUE,
    padding: "10px 22px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },

  card: {
    background: WHITE,
    borderRadius: 22,
    border: "1.5px solid rgba(37,99,235,0.08)",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    boxShadow: "0 4px 24px rgba(37,99,235,0.06)",
    animation: "fadeUp 0.5s ease both",
  },

  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  opBadge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  opName: {
    fontWeight: 800,
    fontSize: 16,
    color: NAVY,
  },

  opType: {
    fontSize: 11,
    color: MUTED,
    fontWeight: 600,
  },

  priceWrap: {
    display: "flex",
    alignItems: "flex-start",
  },

  rupee: {
    fontSize: 16,
    fontWeight: 700,
    color: BLUE,
    marginTop: 5,
  },

  priceNum: {
    fontSize: 40,
    fontWeight: 900,
    color: NAVY,
  },

  dataSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  dataRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  dataLabel: {
    fontSize: 15,
    fontWeight: 700,
    color: BLUE,
  },

  dataValidity: {
    fontSize: 12,
    color: MUTED,
  },

  bar: {
    height: 5,
    background: "#E2E8F0",
    borderRadius: 99,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2563EB, #6366F1)",
    borderRadius: 99,
  },

  divider: {
    height: 1,
    background: "#F1F5F9",
  },

  benefits: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },

  chip: {
    fontSize: 11,
    fontWeight: 700,
    background: BLUE_LIGHT,
    color: BLUE,
    padding: "4px 10px",
    borderRadius: 20,
  },

  exploreBtn: {
    background: BLUE,
    color: WHITE,
    border: "none",
    borderRadius: 12,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  },
};

export default PopularPlansPage;