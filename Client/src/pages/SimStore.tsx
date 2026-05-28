import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { useServices } from "../hooks/useServices";
import { usePlanTypes } from "../hooks/usePlanTypes";
import { useOperators } from "../hooks/useOperators";
import { useFancyNumbers } from "../hooks/useFancyNumbers";

// ─── Icons (inline SVG to avoid react-icons dep issues) ───────────────────────
const IconHome = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4v-4h2v4h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" /></svg>;
const IconPort = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-14a2 2 0 10 0 4 2 2 0 000-4zm.707 5.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 11.586V7a1 1 0 10-2 0v4.586l-1.293-1.293z" clipRule="evenodd" /></svg>;
const IconBiz = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>;
const IconStar = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const IconEsim = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>;

// ─── API FETCH ────────────────────────────────────────────────────────────────
const fetchPlans = async ({ planTypeId = "", operatorId = "", cursor = "" } = {}) => {
  const params = new URLSearchParams();
  if (planTypeId) params.append("planTypeId", planTypeId);
  if (operatorId) params.append("operatorId", operatorId);
  if (cursor) params.append("cursor", cursor);
  const res = await fetch(`http://localhost:5000/api/v1/user/plans?${params.toString()}`);
  const json = await res.json();
  return json?.data;
};

const fetchEsims = async () => {
  const res = await fetch("http://localhost:5000/api/v1/user/esims");
  const json = await res.json();
  return json?.data ?? [];
};

// ─── OPERATOR COLORS ──────────────────────────────────────────────────────────
const operatorMeta: Record<string, { color: string; accent: string; bg: string }> = {
  jio: { color: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF" },
  airtel: { color: "#DC2626", accent: "#EF4444", bg: "#FEF2F2" },
  vi: { color: "#7C3AED", accent: "#8B5CF6", bg: "#F5F3FF" },
  bsnl: { color: "#16A34A", accent: "#22C55E", bg: "#F0FDF4" },
};
const getOperatorMeta = (name = "") =>
  operatorMeta[name.toLowerCase()] ?? { color: "#2563EB", accent: "#6366F1", bg: "#EEF2FF" };

// ─── SIDEBAR CONFIG ──────────────────────────────────────────────────────────
// All 5 services with their display config
const SIDEBAR_SERVICES = [
  {
    slug: "new-connection",
    name: "New Connection",
    icon: <IconHome />,
    color: "#2563EB",
    // navigates to /simstore (default plan browsing, no special filter)
    isExternal: false,
    isFilter: false,
  },
  {
    slug: "port-number",
    name: "Port Number",
    icon: <IconPort />,
    color: "#DC2626",
    // navigates to /portnumber
    isExternal: true,
    externalPath: "/portnumber",
    isFilter: false,
  },
  {
    slug: "business-sim",
    name: "Business SIM",
    icon: <IconBiz />,
    color: "#0F766E",
    // navigates to /businesssim
    isExternal: true,
    externalPath: "/businesssim",
    isFilter: false,
  },
  {
    slug: "fancy-number",
    name: "Fancy Number",
    icon: <IconStar />,
    color: "#B45309",
    isExternal: true,
    externalPath: "/fancynumber",   // 👈 your page
    isFilter: false,
  },
  {
    slug: "e-sim",
    name: "eSIM",
    icon: <IconEsim />,
    color: "#7C3AED",
    isExternal: true,
    externalPath: "/esim",   // 👈 your new page route
    isFilter: false,
  },
] as const;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const SimStore: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── Location state (from ServicesSection / PlanCard navigation) ──────────
  const locationState = (location.state as any) || {};
  const incomingFilter = locationState.serviceFilter as string | undefined;
  const incomingPlanType = locationState.planTypeName as string | undefined;

  // ── UI state ──────────────────────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<any>(null);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  // activeService: null | "fancy-number" | "e-sim"
  const [activeService, setActiveService] = useState<string | null>(null);
  const [cursor, setCursor] = useState("");
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [allEsims, setAllEsims] = useState<any[]>([]);
  const [allFancy, setAllFancy] = useState<any[]>([]);

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { data: services = [] } = useServices();
  const { data: planTypes = [] } = usePlanTypes();
  const { data: operatorsData = [] } = useOperators();
  const { data: fancyNumbers = [] } = useFancyNumbers();

  const operators = Array.isArray(operatorsData) ? operatorsData : [operatorsData];

  // eSIM query — only runs when "e-sim" filter active
  const { data: esimData, isLoading: esimLoading } = useQuery({
    queryKey: ["esims"],
    queryFn: fetchEsims,
    enabled: activeService === "e-sim",
  });

  // Plans query — only when no special filter active
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["plans", selectedPlanType?._id, selectedOperator?._id, cursor],
    queryFn: () => fetchPlans({
      planTypeId: selectedPlanType?._id ?? "",
      operatorId: selectedOperator?._id ?? "",
      cursor,
    }),
    keepPreviousData: true,
    enabled: activeService === null,
  });

  // ── Seed filters from navigation state ───────────────────────────────────
  useEffect(() => {
    if (incomingFilter === "fancy-number") {
      setActiveService("fancy-number");
      setSelectedPlanType(null);
      setSelectedOperator(null);
    } else if (incomingFilter === "e-sim") {
      setActiveService("e-sim");
      setSelectedPlanType(null);
      setSelectedOperator(null);
    } else if (incomingPlanType && planTypes.length > 0) {
      const match = (planTypes as any[]).find(
        (pt: any) => pt.name.toLowerCase() === incomingPlanType.toLowerCase()
      );
      if (match) {
        setSelectedPlanType(match);
        setActiveService(null);
      }
    }
  }, [incomingFilter, incomingPlanType, planTypes]);

  // ── Sync fancy numbers ────────────────────────────────────────────────────
  useEffect(() => {
    if (Array.isArray(fancyNumbers)) setAllFancy(fancyNumbers);
  }, [fancyNumbers]);

  // ── Sync eSIM data ────────────────────────────────────────────────────────
  useEffect(() => {
    if (Array.isArray(esimData)) setAllEsims(esimData);
  }, [esimData]);

  // ── Reset plans on filter change ──────────────────────────────────────────
  useEffect(() => {
    setCursor("");
    setAllPlans([]);
  }, [selectedPlanType, selectedOperator]);

  useEffect(() => {
    if (data?.results) {
      if (cursor) {
        setAllPlans(prev => [...prev, ...data.results]);
      } else {
        setAllPlans(data.results);
      }
    }
  }, [data]);

  const plans = allPlans;
  const nextCursor = data?.nextCursor;
  const hasMore = data?.hasMore;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePlanTypeSelect = (type: any) => {
    setSelectedPlanType(type);
    setSelectedOperator(null);
    setActiveService(null);
    setCursor("");
  };
  const handleOperatorSelect = (op: any) => {
    setSelectedOperator(op);
    setCursor("");
  };
  const handleClear = () => {
    setSelectedPlanType(null);
    setSelectedOperator(null);
    setActiveService(null);
    setCursor("");
  };

  // ── Sidebar item click ────────────────────────────────────────────────────
  const handleSidebarClick = (svc) => {
    if (svc.isExternal) {
      navigate(svc.externalPath);
      return;
    }

    // Only for SimStore internal state
    setActiveService(null);
    setSelectedPlanType(null);
    setSelectedOperator(null);
    setCursor("");
  };

  // ── Determine active sidebar item ─────────────────────────────────────────
  const getSidebarActive = (svc: typeof SIDEBAR_SERVICES[number]) => {
    if (svc.isFilter) {
      return activeService === (svc as any).filterKey;
    }
    if (svc.slug === "new-connection") {
      // Active when no special filter and on /simstore
      return activeService === null && location.pathname === "/simstore";
    }
    return false;
  };

  // ── What to render in main area ───────────────────────────────────────────
  const showFancyGrid = activeService === "fancy-number";
  const showEsimGrid = activeService === "e-sim";
  const showPlansGrid = !showFancyGrid && !showEsimGrid;

  const loading = (isLoading || isFetching) && activeService === null;

  return (
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
        padding: "24px 0", transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
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
          {!sidebarCollapsed && (
            <p style={{
              fontSize: 11, color: "rgba(255,255,255,0.5)",
              padding: "10px 12px", marginTop: 10,
              textTransform: "uppercase", letterSpacing: 1, margin: "10px 0 6px",
            }}>
              Services
            </p>
          )}

          {SIDEBAR_SERVICES.map((svc) => {
            const active = getSidebarActive(svc);
            return (
              <div
                key={svc.slug}
                onClick={() => handleSidebarClick(svc)}
                title={sidebarCollapsed ? svc.name : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 12px", borderRadius: 12, marginBottom: 3,
                  cursor: "pointer",
                  background: active
                    ? "rgba(255,255,255,0.20)"
                    : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.62)",
                  fontWeight: active ? 700 : 500,
                  transition: "all 0.18s",
                  userSelect: "none",
                  // Subtle left accent bar for active
                  borderLeft: active ? `3px solid ${svc.color === "#2563EB" ? "#93C5FD" : svc.color === "#DC2626" ? "#FCA5A5" : svc.color === "#0F766E" ? "#5EEAD4" : svc.color === "#B45309" ? "#FCD34D" : "#C4B5FD"}` : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span style={{
                  flexShrink: 0,
                  opacity: active ? 1 : 0.75,
                  display: "flex", alignItems: "center",
                }}>
                  {svc.icon}
                </span>
                {!sidebarCollapsed && (
                  <span style={{
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    fontSize: 14,
                  }}>
                    {svc.name}
                  </span>
                )}
                {/* External redirect badge */}
                {!sidebarCollapsed && svc.isExternal && (
                  <span style={{
                    marginLeft: "auto", fontSize: 9, fontWeight: 700,
                    color: "rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 4, padding: "2px 5px",
                    flexShrink: 0,
                  }}>↗</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: "10px 10px 0" }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: "100%", padding: "10px", borderRadius: 10,
              cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
              fontSize: 15, transition: "background 0.15s",
            }}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1, padding: "28px 26px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 22, minWidth: 0,
      }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: showFancyGrid
              ? "linear-gradient(135deg,#78350F 0%,#B45309 55%,#F59E0B 100%)"
              : showEsimGrid
                ? "linear-gradient(135deg,#4C1D95 0%,#7C3AED 55%,#8B5CF6 100%)"
                : "linear-gradient(135deg,#1E3A8A 0%,#2563EB 55%,#6366F1 100%)",
            borderRadius: 22, padding: "30px 34px",
            color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "relative", overflow: "hidden",
            boxShadow: showFancyGrid
              ? "0 8px 32px rgba(180,83,9,0.28)"
              : showEsimGrid
                ? "0 8px 32px rgba(124,58,237,0.28)"
                : "0 8px 32px rgba(37,99,235,0.28)",
            transition: "background 0.4s",
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
              {showFancyGrid ? "⭐ Fancy Numbers" : showEsimGrid ? "📲 eSIM Plans" : "📶 Browse All Plans"}
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              {showFancyGrid ? "Fancy Number Store" : showEsimGrid ? "eSIM Store" : "SIM Store"}
            </h1>
            <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 14 }}>
              {showFancyGrid
                ? "Pick a VIP mobile number that's uniquely yours ✨"
                : showEsimGrid
                  ? "Instant digital SIM activation — no physical card needed 📲"
                  : "Prepaid, Postpaid & Business plans with doorstep delivery ✨"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 1 }}>
            {[
              {
                label: showFancyGrid ? "Fancy Nos." : showEsimGrid ? "eSIMs" : "Plans",
                value: showFancyGrid ? allFancy.length : showEsimGrid ? allEsims.length : plans.length || "—",
              },
              { label: "Operators", value: operators.length || "—" },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)",
                padding: "14px 20px", textAlign: "center", minWidth: 70,
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FILTER PANEL (only for normal plan browsing) ──────────────────── */}
        {showPlansGrid && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
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
              {(selectedPlanType || selectedOperator) && (
                <button onClick={handleClear} style={{
                  background: "#F1F5FF", border: "1px solid #C7D2FE",
                  color: "#4F46E5", borderRadius: 20, padding: "5px 14px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>✕ Clear All</button>
              )}
            </div>

            {/* Step 1: Plan Type */}
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, color: "#6366F1",
                letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px",
              }}>Step 1 — Choose Plan Type</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(planTypes as any[]).map((type: any) => {
                  const active = selectedPlanType?._id === type._id;
                  return (
                    <button
                      key={type._id}
                      onClick={() => handlePlanTypeSelect(type)}
                      style={{
                        padding: "9px 22px", borderRadius: 50,
                        fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                        border: active ? "none" : "1.5px solid #C7D2FE",
                        background: active ? "linear-gradient(135deg,#2563EB,#6366F1)" : "#F8FAFF",
                        color: active ? "#fff" : "#4F46E5",
                        boxShadow: active ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
                      }}
                    >{type.name}</button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Operator */}
            <AnimatePresence>
              {selectedPlanType && (
                <motion.div
                  key="operator-filter"
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
                      Step 2 — Choose Operator{" "}
                      <span style={{ color: "#94A3B8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {operators.map((op: any) => {
                        const m = getOperatorMeta(op.name);
                        const active = selectedOperator?._id === op._id;
                        return (
                          <button
                            key={op._id}
                            onClick={() => handleOperatorSelect(op)}
                            style={{
                              padding: "8px 18px", borderRadius: 50,
                              fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                              display: "flex", alignItems: "center", gap: 8,
                              border: active ? "none" : `1.5px solid ${m.accent}50`,
                              background: active ? `linear-gradient(135deg,${m.color},${m.accent})` : m.bg,
                              color: active ? "#fff" : m.color,
                              boxShadow: active ? `0 4px 14px ${m.accent}40` : "none",
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active breadcrumb */}
            {(selectedPlanType || selectedOperator) && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ marginTop: 14, padding: "10px 14px", background: "#F8FAFF", borderRadius: 10, border: "1px solid #E0E7FF" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>Showing:</span>
                  {selectedPlanType && (
                    <span style={{ background: "#EEF2FF", color: "#4F46E5", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                      {selectedPlanType.name}
                    </span>
                  )}
                  {selectedOperator && (
                    <>
                      <span style={{ color: "#CBD5E1", fontSize: 12 }}>›</span>
                      <span style={{
                        background: getOperatorMeta(selectedOperator.name).bg,
                        color: getOperatorMeta(selectedOperator.name).color,
                        borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600,
                      }}>
                        {selectedOperator.name}
                      </span>
                    </>
                  )}
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>
                    — {loading ? "fetching…" : `${plans.length} plan${plans.length !== 1 ? "s" : ""} found`}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── FANCY NUMBER GRID ─────────────────────────────────────────────── */}
        {showFancyGrid && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#B45309,#F59E0B)" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  Fancy Numbers <span style={{ color: "#B45309", fontWeight: 500, fontSize: 13 }}>— VIP mobile numbers</span>
                </h3>
              </div>
              <button
                onClick={handleClear}
                style={{
                  background: "#FFFBEB", border: "1px solid #FDE68A",
                  color: "#B45309", borderRadius: 20, padding: "5px 14px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >← All Plans</button>
            </div>

            {allFancy.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 20, padding: "60px 24px",
                textAlign: "center", border: "1px solid #FDE68A",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 16 }}>No fancy numbers yet</p>
                <p style={{ color: "#94A3B8", fontSize: 13 }}>Check back soon for VIP numbers</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
                {allFancy.map((fn: any, i: number) => (
                  <motion.div
                    key={fn._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    style={{
                      background: "#fff", borderRadius: 20,
                      padding: "22px 22px 18px",
                      border: "1.5px solid #FDE68A",
                      boxShadow: "0 2px 12px rgba(245,158,11,0.08)",
                      display: "flex", flexDirection: "column", gap: 12,
                      transition: "transform 0.18s,box-shadow 0.18s", cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,158,11,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(245,158,11,0.08)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: 20, fontWeight: 900, color: "#0F172A", letterSpacing: 1,
                        fontFamily: "monospace",
                      }}>
                        {fn.number || fn.phoneNumber || fn.value || "—"}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: "#B45309",
                        background: "#FFFBEB", borderRadius: 20, padding: "3px 10px",
                        border: "1px solid #FDE68A", textTransform: "uppercase",
                      }}>VIP</span>
                    </div>
                    {fn.pattern && (
                      <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>Pattern: {fn.pattern}</p>
                    )}
                    <div style={{ borderTop: "1px solid #FEF3C7" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        {fn.salePrice && fn.price && fn.salePrice < fn.price && (
                          <span style={{ fontSize: 11, color: "#94A3B8", textDecoration: "line-through", display: "block" }}>
                            ₹{fn.price}
                          </span>
                        )}
                        <span style={{ fontSize: 22, fontWeight: 900, color: "#B45309" }}>
                          ₹{fn.salePrice || fn.price || "—"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/fancy-number/${fn._id}`, {
                          state: { ...fn, orderType: "FANCY" }
                        })
                      }
                      style={{
                        width: "100%", padding: "11px", borderRadius: 12, border: "none",
                        background: "linear-gradient(135deg,#B45309,#F59E0B)",
                        color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                        transition: "opacity 0.18s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Book Number →
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── ESIM GRID ─────────────────────────────────────────────────────── */}
        {showEsimGrid && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#7C3AED,#8B5CF6)" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  eSIM Plans <span style={{ color: "#7C3AED", fontWeight: 500, fontSize: 13 }}>— instant digital activation</span>
                </h3>
              </div>
              <button
                onClick={handleClear}
                style={{
                  background: "#F5F3FF", border: "1px solid #DDD6FE",
                  color: "#7C3AED", borderRadius: 20, padding: "5px 14px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >← All Plans</button>
            </div>

            {esimLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    background: "linear-gradient(90deg,#F5F3FF 25%,#EDE9FE 50%,#F5F3FF 75%)",
                    backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
                    borderRadius: 20, height: 180,
                  }} />
                ))}
                <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
              </div>
            ) : allEsims.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 20, padding: "60px 24px",
                textAlign: "center", border: "1px solid #DDD6FE",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📲</div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 16 }}>No eSIM plans yet</p>
                <p style={{ color: "#94A3B8", fontSize: 13 }}>Check back soon for eSIM availability</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                {allEsims.map((esimPlan: any, i: number) => {
                  const m = getOperatorMeta(esimPlan.operatorId?.name ?? "");
                  const price = esimPlan.salePrice || esimPlan.price;
                  return (
                    <motion.div
                      key={esimPlan._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      style={{
                        background: "#fff", borderRadius: 20,
                        padding: "22px 22px 18px",
                        border: "1.5px solid #DDD6FE",
                        boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
                        display: "flex", flexDirection: "column", gap: 14,
                        transition: "transform 0.18s,box-shadow 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(124,58,237,0.07)";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 12, background: m.bg,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            {esimPlan.operatorId?.logo
                              ? <img src={esimPlan.operatorId.logo} style={{ width: 26, height: 26, objectFit: "contain" }} alt="" />
                              : <span style={{ fontSize: 18 }}>📲</span>}
                          </div>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: 14, color: "#0F172A", margin: 0 }}>
                              {esimPlan.operatorId?.name || "eSIM"}
                            </p>
                            <span style={{
                              fontSize: 11, fontWeight: 600, color: "#7C3AED",
                              background: "#F5F3FF", borderRadius: 20, padding: "2px 9px",
                            }}>eSIM</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                            <span style={{ fontSize: 13, color: "#374151", fontWeight: 700 }}>₹</span>
                            <span style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{price}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid #F1F5FF" }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                          { label: "Data", value: esimPlan.data || "—", color: "#7C3AED" },
                          { label: "Validity", value: esimPlan.validity ? `${esimPlan.validity}d` : "—", color: "#374151" },
                        ].map((item) => (
                          <div key={item.label} style={{ background: "#F8F5FF", borderRadius: 10, padding: "10px 12px" }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              {item.label}
                            </p>
                            <p style={{ fontSize: 14, fontWeight: 800, color: item.color, margin: 0 }}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate(`/plan-details/${esimPlan._id}`, { state: { ...esimPlan, orderType: "ESIM" } })}
                        style={{
                          width: "100%", padding: "12px", borderRadius: 12, border: "none",
                          background: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                          transition: "opacity 0.18s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        Activate eSIM →
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── PLANS GRID ────────────────────────────────────────────────────── */}
        {showPlansGrid && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg,#2563EB,#6366F1)" }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                  {selectedPlanType
                    ? `${selectedPlanType.name} Plans${selectedOperator ? ` · ${selectedOperator.name}` : ""}`
                    : "All Plans"}
                </h3>
              </div>
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
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {loading && plans.length === 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    borderRadius: 20, height: 200,
                    background: "linear-gradient(90deg,#F0F4FF 25%,#E8EEFF 50%,#F0F4FF 75%)",
                    backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
                  }} />
                ))}
                <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
              </div>
            ) : plans.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 20, padding: "60px 24px",
                textAlign: "center", border: "1px solid #E0E7FF",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 16 }}>No plans found</p>
                <p style={{ color: "#94A3B8", fontSize: 13 }}>Try a different filter combination</p>
                <button onClick={handleClear} style={{
                  marginTop: 16, background: "linear-gradient(135deg,#2563EB,#6366F1)",
                  color: "#fff", border: "none", borderRadius: 12,
                  padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 13,
                }}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                  {plans.map((plan: any, i: number) => {
                    const operatorId = typeof plan.operatorId === "object" ? plan.operatorId?._id : plan.operatorId;
                    const operator = operators.find((op: any) => op._id === operatorId) || plan.operatorId || {};
                    const m = getOperatorMeta(operator?.name ?? "");
                    const price = plan.salePrice || plan.price;
                    const hasDiscount = plan.salePrice && plan.price && plan.salePrice < plan.price;
                    const discount = hasDiscount ? Math.round(((plan.price - plan.salePrice) / plan.price) * 100) : null;

                    return (
                      <motion.div
                        key={plan._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        style={{
                          background: "#fff", borderRadius: 20, padding: "22px 22px 18px",
                          border: "1px solid #E0E7FF", boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
                          display: "flex", flexDirection: "column", gap: 14,
                          transition: "transform 0.18s,box-shadow 0.18s", cursor: "default",
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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 12, background: m.bg,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              {operator?.logo
                                ? <img src={operator.logo} style={{ width: 26, height: 26, objectFit: "contain" }} alt={operator.name} />
                                : <span style={{ fontSize: 18 }}>📶</span>}
                            </div>
                            <div>
                              <p style={{ fontWeight: 800, fontSize: 14, color: "#0F172A", margin: 0 }}>
                                {operator?.name || "Operator"}
                              </p>
                              <span style={{
                                fontSize: 11, fontWeight: 600, color: m.color,
                                background: m.bg, borderRadius: 20, padding: "2px 9px",
                              }}>
                                {plan.planTypeId?.name || selectedPlanType?.name || "Plan"}
                              </span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {hasDiscount && (
                              <div style={{ fontSize: 11, color: "#94A3B8", textDecoration: "line-through" }}>₹{plan.price}</div>
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
                        {(plan.calls || plan.sms) && (
                          <div style={{ display: "flex", gap: 8 }}>
                            {plan.calls && <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", background: "#F1F5F9", borderRadius: 8, padding: "4px 10px" }}>📞 {plan.calls}</span>}
                            {plan.sms && <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", background: "#F1F5F9", borderRadius: 8, padding: "4px 10px" }}>✉️ {plan.sms} SMS</span>}
                          </div>
                        )}
                        <button
                          onClick={() => navigate(`/plan-details/${plan._id}`, { state: { ...plan, orderType: "NORMAL" } })}
                          style={{
                            width: "100%", padding: "12px", borderRadius: 12, border: "none",
                            background: "linear-gradient(135deg,#2563EB,#6366F1)",
                            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            letterSpacing: 0.2, boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                            transition: "opacity 0.18s,transform 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Explore Plan →
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {hasMore && (
                  <div style={{ textAlign: "center", marginTop: 24 }}>
                    <button
                      onClick={() => { if (nextCursor) setCursor(nextCursor); }}
                      style={{ padding: "12px 32px", borderRadius: 12, border: "1px solid #ccc", cursor: "pointer" }}
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

      </main>
    </div>
  );
};

export default SimStore;