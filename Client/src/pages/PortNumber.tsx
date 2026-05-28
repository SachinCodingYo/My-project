import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaHome, FaPhoneAlt, FaSimCard, FaBusinessTime } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "../hooks/useServices";
import { useOperators } from "../hooks/useOperators";
import { usePlanTypes } from "../hooks/usePlanTypes";
import { usePlans } from "../hooks/usePlans";

// ─── Operator colour tokens ───────────────────────────────────────────────────
const operatorMeta: Record<string, { color: string; accent: string; bg: string }> = {
  jio: { color: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF" },
  airtel: { color: "#DC2626", accent: "#EF4444", bg: "#FEF2F2" },
  vi: { color: "#7C3AED", accent: "#8B5CF6", bg: "#F5F3FF" },
  bsnl: { color: "#16A34A", accent: "#22C55E", bg: "#F0FDF4" },
};
const getOperatorMeta = (name = "") =>
  operatorMeta[name.toLowerCase()] ?? { color: "#2563EB", accent: "#6366F1", bg: "#EEF2FF" };

// ─── Service → route map (same as Esim.tsx) ───────────────────────────────────
const serviceMap: any = {
  "new-connection": {
    path: "/simstore",
    name: "New Connection",
    icon: <FaSimCard />,
  },
  "port-number": {
    path: "/portnumber",
    name: "Port Number",
    icon: <MdSwapHoriz />,
  },
  "fancy-number": {
    path: "/fancynumber",
    name: "Fancy Number",
    icon: <RiVipCrownFill />,
  },
  "business-sim": {
    path: "/businesssim",
    name: "Business SIM",
    icon: <FaBusinessTime />,
  },
  "e-sim": {
    path: "/esim",
    name: "eSIM",
    icon: <FaPhoneAlt />,
  },
};

const orderedSlugs = [
  "new-connection",
  "port-number",
  "fancy-number",
  "business-sim",
  "e-sim",
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton: React.FC<{ width?: string; height?: number; radius?: number }> = ({
  width = "100%", height = 16, radius = 8,
}) => (
  <div style={{
    width, height, borderRadius: radius,
    background: "linear-gradient(90deg,#E0E7FF 25%,#C7D2FE 50%,#E0E7FF 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  }} />
);

// ─── Tag pill ─────────────────────────────────────────────────────────────────
const Tag: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    fontSize: 11.5, fontWeight: 600, color: "#4B5563",
    background: "#EEF2FF", border: "1px solid #C7D2FE",
    borderRadius: 20, padding: "3px 10px",
  }}>
    {icon} {label}
  </span>
);

// ─── Component ────────────────────────────────────────────────────────────────
const PortNumber: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { operator: operatorParam } = useParams<{ operator?: string }>();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<any>(null);

  // ── Data hooks ───────────────────────────────────────────────────────────
  const { data: services = [] } = useServices();
  const { data: operators = [], isLoading: opLoading } = useOperators();
  const { data: planTypes = [], isLoading: ptLoading } = usePlanTypes();

  const filters: any = {};
  if (selectedOperator?._id) filters.operatorId = selectedOperator._id;
  if (selectedPlanType?._id) filters.planTypeId = selectedPlanType._id;

  const { data: plans = [], isLoading: plansLoading } = usePlans(filters);

  // Sync URL param → operator selection
  useEffect(() => {
    if (operatorParam && (operators as any[]).length) {
      const matched = (operators as any[]).find(
        (o) => o.name?.toLowerCase() === operatorParam.toLowerCase()
      );
      if (matched) setSelectedOperator(matched);
    }
  }, [operatorParam, operators]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleOperatorSelect = (op: any) => {
    setSelectedOperator(selectedOperator?._id === op._id ? null : op);
    setSelectedPlanType(null);
  };

  const handlePlanTypeSelect = (pt: any) => {
    setSelectedPlanType(selectedPlanType?._id === pt._id ? null : pt);
  };

  const handleClear = () => {
    setSelectedOperator(null);
    setSelectedPlanType(null);
  };

  // ── Sidebar items (same pattern as Esim.tsx) ─────────────────────────────
  const serviceItems = orderedSlugs.map((slug) => {
    const service = (services as any[]).find((s: any) => s.slug === slug);
    const config = serviceMap[slug];
    return {
      name: config?.name || service?.name,
      path: config?.path || `/service/${slug}`,
      icon: config?.icon || <FaHome />,   // ✅ correct per-item icon
    };
  });

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const loading = plansLoading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <div style={{
        display: "flex", minHeight: "100vh",
        background: "#F0F4FF",
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      }}>

        {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
        <aside style={{
          width: sidebarCollapsed ? 72 : 240,
          minHeight: "100vh",
          background: "linear-gradient(180deg,#1E3A8A 0%,#2563EB 100%)",
          display: "flex", flexDirection: "column",
          padding: "24px 0",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          position: "sticky", top: 0, overflow: "hidden", zIndex: 10,
          boxShadow: "4px 0 24px rgba(37,99,235,0.18)",
        }}>
          {/* Logo */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: sidebarCollapsed ? "0 19px 24px" : "0 22px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 10, overflow: "hidden", whiteSpace: "nowrap",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0,
              background: "rgba(255,255,255,0.18)", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>📶</div>
            {!sidebarCollapsed && (
              <span style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.4px" }}>
                SimConnect
              </span>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "0 10px" }}>
            {serviceItems.length > 0 && (
              <>
                {!sidebarCollapsed && (
                  <p style={{
                    fontSize: 11, color: "rgba(255,255,255,0.6)",
                    padding: "10px 12px", marginTop: 10,
                    textTransform: "uppercase", letterSpacing: 1,
                  }}>Services</p>
                )}

                {serviceItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 12px",
                        borderRadius: 12,
                        marginBottom: 3,
                        textDecoration: "none",
                        background: active ? "rgba(255,255,255,0.18)" : "transparent",
                        color: active ? "#fff" : "rgba(255,255,255,0.6)",
                        fontWeight: active ? 700 : 500,
                        transition: "all 0.18s",
                      }}
                    >
                      <span>{item.icon}</span>
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Skeleton while services load */}
            {serviceItems.length === 0 && !sidebarCollapsed && (
              <div style={{ padding: "8px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={14} />)}
              </div>
            )}
          </nav>

          {/* Collapse toggle */}
          <div style={{ padding: "10px 10px 0" }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
              width: "100%", padding: "10px", borderRadius: 10, cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)", fontSize: 15, transition: "background 0.15s",
            }}>
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>
        </aside>

        {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
        <main style={{
          flex: 1, padding: "28px 26px", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 22, minWidth: 0,
        }}>

          {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(135deg,#1E3A8A 0%,#2563EB 55%,#6366F1 100%)",
              borderRadius: 22, padding: "30px 34px", color: "#fff",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              position: "relative", overflow: "hidden",
              boxShadow: "0 8px 32px rgba(37,99,235,0.28)",
            }}
          >
            <div style={{ position: "absolute", top: -40, right: 120, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -50, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.15)", borderRadius: 20,
                padding: "5px 14px", fontSize: 12, fontWeight: 600,
                marginBottom: 14, border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <MdSwapHoriz style={{ fontSize: 13 }} />
                {operatorParam ? `Porting to ${operatorParam.toUpperCase()}` : "Port Your Number"}
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
                {operatorParam ? `Switch to ${operatorParam.toUpperCase()}` : "Port Your Number"}
              </h1>
              <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 14 }}>
                Switch your operator with fast doorstep delivery ✨
              </p>
            </div>

            <div style={{
              width: 80, height: 80, borderRadius: 20, flexShrink: 0,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34, border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)", position: "relative", zIndex: 1,
            }}>🔄</div>
          </motion.div>

          {/* ── FILTER SECTION ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}
            style={{
              background: "#fff", borderRadius: 20, padding: "22px 24px",
              border: "1px solid #E0E7FF", boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#2563EB,#6366F1)" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Filter Plans</h3>
              </div>
              {(selectedOperator || selectedPlanType) && (
                <button onClick={handleClear} style={{
                  background: "#F1F5FF", border: "1px solid #C7D2FE",
                  color: "#4F46E5", borderRadius: 20, padding: "5px 14px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>✕ Clear All</button>
              )}
            </div>

            {/* STEP 1 — Operator */}
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, color: "#6366F1",
                letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px",
              }}>
                Step 1 — Choose Operator
              </p>

              {opLoading ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} width="80px" height={36} radius={50} />)}
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(operators as any[]).map((op: any) => {
                    const m = getOperatorMeta(op.name);
                    const active = selectedOperator?._id === op._id;
                    return (
                      <button
                        key={op._id}
                        onClick={() => handleOperatorSelect(op)}
                        style={{
                          padding: "9px 22px", borderRadius: 50,
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex", alignItems: "center", gap: 8,
                          border: active ? "none" : `1.5px solid ${m.accent}50`,
                          background: active ? `linear-gradient(135deg,${m.color},${m.accent})` : m.bg,
                          color: active ? "#fff" : m.color,
                          boxShadow: active ? `0 4px 14px ${m.accent}40` : "none",
                          transform: active ? "scale(1.04)" : "scale(1)",
                        }}
                      >
                        {op.logo && (
                          <img src={op.logo} style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "contain" }} alt={op.name} />
                        )}
                        {op.name?.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 2 — Plan Type */}
            <AnimatePresence>
              {selectedOperator && (
                <motion.div
                  key="plantype-filter"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 18 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ borderTop: "1px solid #E0E7FF", paddingTop: 16 }}>
                    <p style={{
                      fontSize: 11, fontWeight: 700, color: "#6366F1",
                      letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px",
                    }}>
                      Step 2 — Choose Plan Type{" "}
                      <span style={{ color: "#94A3B8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
                        (optional)
                      </span>
                    </p>

                    {ptLoading ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} width="90px" height={36} radius={50} />)}
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {(planTypes as any[]).map((pt: any) => {
                          const active = selectedPlanType?._id === pt._id;
                          return (
                            <button
                              key={pt._id}
                              onClick={() => handlePlanTypeSelect(pt)}
                              style={{
                                padding: "9px 22px", borderRadius: 50,
                                fontSize: 13, fontWeight: 700, cursor: "pointer",
                                transition: "all 0.2s",
                                border: active ? "none" : "1.5px solid #C7D2FE",
                                background: active ? "linear-gradient(135deg,#2563EB,#6366F1)" : "#F8FAFF",
                                color: active ? "#fff" : "#4F46E5",
                                boxShadow: active ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                                transform: active ? "scale(1.04)" : "scale(1)",
                              }}
                            >
                              {pt.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter breadcrumb */}
            {(selectedOperator || selectedPlanType) && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  marginTop: 14, padding: "10px 14px",
                  background: "#F8FAFF", borderRadius: 10, border: "1px solid #E0E7FF",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Showing:</span>
                  {selectedOperator && (
                    <span style={{
                      background: getOperatorMeta(selectedOperator.name).bg,
                      color: getOperatorMeta(selectedOperator.name).color,
                      borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600,
                    }}>
                      {selectedOperator.name}
                    </span>
                  )}
                  {selectedPlanType && (
                    <>
                      <span style={{ color: "#CBD5E1", fontSize: 12 }}>›</span>
                      <span style={{
                        background: "#EEF2FF", color: "#4F46E5",
                        borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600,
                      }}>
                        {selectedPlanType.name}
                      </span>
                    </>
                  )}
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>
                    — {loading ? "fetching…" : `${(plans as any[]).length} plan${(plans as any[]).length !== 1 ? "s" : ""} found`}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── PLANS GRID ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#2563EB,#6366F1)" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  {selectedOperator
                    ? `${selectedOperator.name} Plans${selectedPlanType ? ` · ${selectedPlanType.name}` : ""}`
                    : "Available Plans"}
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6366F1", fontWeight: 600 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%",
                      border: "2px solid #C7D2FE", borderTopColor: "#6366F1",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Fetching…
                  </div>
                )}
                {!loading && (plans as any[]).length > 0 && (
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#6366F1",
                    background: "#EEF2FF", padding: "4px 12px", borderRadius: 20,
                  }}>
                    {(plans as any[]).length} plan{(plans as any[]).length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (plans as any[]).length === 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{
                    background: "linear-gradient(90deg,#F0F4FF 25%,#E8EEFF 50%,#F0F4FF 75%)",
                    backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
                    borderRadius: 20, height: 200,
                  }} />
                ))}
              </div>

            ) : !selectedOperator && (plans as any[]).length === 0 && !loading ? (
              /* Prompt — no operator selected yet */
              <div style={{
                background: "#fff", borderRadius: 20, padding: "60px 24px",
                textAlign: "center", border: "1px solid #E0E7FF",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 16, margin: "0 0 6px" }}>
                  Select an Operator to Begin
                </p>
                <p style={{ color: "#94A3B8", fontSize: 13, margin: 0 }}>
                  Choose your current operator above to see available port plans
                </p>
              </div>

            ) : selectedOperator && (plans as any[]).length === 0 && !loading ? (
              /* Empty state */
              <div style={{
                background: "#fff", borderRadius: 20, padding: "60px 24px",
                textAlign: "center", border: "1px solid #E0E7FF",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 16, margin: "0 0 6px" }}>No Plans Found</p>
                <p style={{ color: "#94A3B8", fontSize: 13, margin: "0 0 16px" }}>
                  Try a different filter combination
                </p>
                <button onClick={handleClear} style={{
                  background: "linear-gradient(135deg,#2563EB,#6366F1)", color: "#fff",
                  border: "none", borderRadius: 12, padding: "10px 24px",
                  fontWeight: 700, cursor: "pointer", fontSize: 13,
                }}>Clear Filters</button>
              </div>

            ) : (
              /* Plan cards */
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                {(plans as any[]).map((plan: any, i: number) => {
                  const operatorId =
                    typeof plan.operatorId === "object" ? plan.operatorId?._id : plan.operatorId;
                  const planOperator =
                    (operators as any[]).find((op: any) => op._id === operatorId) ||
                    plan.operatorId || {};
                  const m = getOperatorMeta(planOperator?.name ?? "");
                  const price = plan.salePrice || plan.price;
                  const hasDiscount = plan.salePrice && plan.price && plan.salePrice < plan.price;
                  const discount = hasDiscount
                    ? Math.round(((plan.price - plan.salePrice) / plan.price) * 100)
                    : null;

                  return (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      style={{
                        background: "#fff", borderRadius: 20, padding: "22px 22px 18px",
                        border: "1px solid #E0E7FF",
                        boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
                        display: "flex", flexDirection: "column", gap: 14,
                        transition: "transform 0.18s, box-shadow 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.13)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(37,99,235,0.06)";
                      }}
                    >
                      {/* Card header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: m.bg, display: "flex",
                            alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            {planOperator?.logo
                              ? <img src={planOperator.logo} style={{ width: 26, height: 26, objectFit: "contain" }} alt={planOperator.name} />
                              : <span style={{ fontSize: 18 }}>📶</span>
                            }
                          </div>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: 14, color: "#0F172A", margin: 0 }}>
                              {planOperator?.name || "Operator"}
                            </p>
                            <span style={{
                              fontSize: 11, fontWeight: 600, color: m.color,
                              background: m.bg, borderRadius: 20, padding: "2px 9px",
                            }}>
                              {plan.planTypeId?.name || selectedPlanType?.name || "Plan"}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: "right" }}>
                          {hasDiscount && (
                            <div style={{ fontSize: 11, color: "#94A3B8", textDecoration: "line-through" }}>
                              ₹{plan.price}
                            </div>
                          )}
                          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                            <span style={{ fontSize: 13, color: "#374151", fontWeight: 700 }}>₹</span>
                            <span style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{price}</span>
                          </div>
                          {discount && (
                            <div style={{
                              fontSize: 10, fontWeight: 700, color: "#16A34A",
                              background: "#F0FDF4", borderRadius: 20, padding: "2px 8px", marginTop: 2,
                            }}>{discount}% OFF</div>
                          )}
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid #F1F5FF" }} />

                      {/* Data & Validity */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                          { label: "Data", value: plan.data || "—", color: m.color },
                          { label: "Validity", value: plan.validity ? `${plan.validity}d` : "—", color: "#374151" },
                        ].map((item) => (
                          <div key={item.label} style={{ background: "#F8FAFF", borderRadius: 10, padding: "10px 12px" }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              {item.label}
                            </p>
                            <p style={{ fontSize: 14, fontWeight: 800, color: item.color, margin: 0 }}>{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Calls / SMS row */}
                      {(plan.calls || plan.sms) && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {plan.calls && <Tag icon="📞" label={plan.calls} />}
                          {plan.sms && <Tag icon="✉️" label={`${plan.sms} SMS`} />}
                        </div>
                      )}

                      {plan.description && (
                        <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.5 }}>
                          {plan.description}
                        </p>
                      )}

                      {/* CTA */}
                      <button
                        onClick={() =>
                          navigate(`/plan-details/${plan._id}`, {
                            state: { ...plan, orderType: "PORT" },
                          })
                        }
                        style={{
                          width: "100%", padding: "12px", borderRadius: 12, border: "none",
                          background: "linear-gradient(135deg,#2563EB,#6366F1)",
                          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                          letterSpacing: 0.2, boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                          transition: "opacity 0.18s, transform 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.99)")}
                        onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        Select Plan →
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </main>
      </div>
    </>
  );
};

export default PortNumber;