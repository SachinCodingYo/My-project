import React, { useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {
  FaSimCard,
  FaPhoneAlt,
  FaBusinessTime,
  FaHome,
} from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { motion } from "framer-motion";

import { usePlans } from "../hooks/usePlans";
import { usePlanTypes } from "../hooks/usePlanTypes";
import { usePlanTags } from "../hooks/usePlanTags";
import { useServices } from "../hooks/useServices";
import { useOperators } from "../hooks/useOperators";


const getColor = (name: string) => {
  const colors = ["#3B82F6", "#EF4444", "#8B5CF6", "#22C55E"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};


const PrepaidPage: React.FC = () => {
  const { data: operatorsData = [] } = useOperators();
  const location = useLocation();
  const { operator } = useParams();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  

  const selectedOperator = operator?.toLowerCase() || "jio";
  const baseColor = getColor(selectedOperator);
const meta = {
  color: baseColor,
  accent: baseColor,
  bg: baseColor + "10",
};

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
  } = usePlans("prepaid", selectedOperator, selectedType, selectedTag);

  const { data: planTypes = [] } = usePlanTypes();
  const { data: planTags = [] } = usePlanTags();
  const { data: services = [] } = useServices();

const operators = operatorsData || [];

  const menuItems = [
    { name: "Simstore",         path: "/simstore",            icon: <FaHome /> },
    { name: "Prepaid",      path: "/prepaid",     icon: <FaSimCard /> },
    { name: "Postpaid",     path: "/postpaid",    icon: <FaPhoneAlt /> },
    { name: "Port Number",  path: "/portnumber",  icon: <MdSwapHoriz /> },
    { name: "Fancy Number", path: "/fancynumber", icon: <RiVipCrownFill /> },
    { name: "Business SIM", path: "/businesssim", icon: <FaBusinessTime /> },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F0F4FF",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ─────────────── SIDEBAR ─────────────── */}
      <aside
        style={{
          width: sidebarCollapsed ? 72 : 240,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          zIndex: 10,
          boxShadow: "4px 0 24px rgba(37,99,235,0.18)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: sidebarCollapsed ? "0 19px 24px" : "0 22px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 10,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 16,
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            📶
          </div>
          {!sidebarCollapsed && (
            <span
              style={{
                fontWeight: 800,
                fontSize: 17,
                color: "#fff",
                letterSpacing: "-0.4px",
              }}
            >
              SimConnect
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 10px" }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.name}
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
                  fontSize: 14,
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  borderLeft: active ? "3px solid #fff" : "3px solid transparent",
                  backdropFilter: active ? "blur(6px)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: "10px 10px 0" }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              fontSize: 15,
              transition: "background 0.15s",
            }}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* ─────────────── MAIN CONTENT ─────────────── */}
      <main
        style={{
          flex: 1,
          padding: "28px 26px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          minWidth: 0,
        }}
      >

        {/* ── HERO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #6366F1 60%, #818CF8 100%)",
            borderRadius: 22,
            padding: "30px 34px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(37,99,235,0.28)",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -40, right: 100, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -50, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", top: -20, left: "40%", width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 14,
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <FaSimCard style={{ fontSize: 11 }} /> Prepaid Plans
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              {selectedOperator.charAt(0).toUpperCase() + selectedOperator.slice(1)} Prepaid
            </h1>
            <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 14 }}>
              Explore the best prepaid plans for your needs ✨
            </p>
          </div>

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              backdropFilter: "blur(8px)",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            📱
          </div>
        </motion.div>

        {/* ── SERVICES ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "22px 24px",
            border: "1px solid #E0E7FF",
            boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Explore Services
            </h3>
            <span
              style={{
                fontSize: 11,
                color: "#2563EB",
                fontWeight: 600,
                background: "#EFF6FF",
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              {services.length} services
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
              gap: 10,
            }}
          >
            {services.map((service: any, i: number) => (
              <motion.div
                key={service._id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => navigate(`/${service.slug}`)}
                style={{
                  cursor: "pointer",
                  background: "#F8FAFF",
                  border: "1.5px solid #E0E7FF",
                  borderRadius: 14,
                  padding: "16px 10px",
                  textAlign: "center",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.14)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#A5B4FC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E0E7FF";
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>{service.icon || "📱"}</div>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", margin: 0, lineHeight: 1.3 }}>
                  {service.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── OPERATOR + FILTERS + PLANS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid #E0E7FF",
            boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          }}
        >

          {/* Operator selector */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg, #2563EB, #6366F1)" }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Select Operator
              </h3>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {operators.map((op: any) => {
  const name = op.name.toLowerCase();
  const color = getColor(name);
  const active = selectedOperator === name;

  return (
    <button
      key={op._id}
      onClick={() => navigate(`/prepaid/${name}`)}
      style={{
        padding: "9px 22px",
        borderRadius: 50,
        fontSize: 13,
        fontWeight: 700,
        border: active ? "none" : `1.5px solid ${color}40`,
        background: active
          ? `linear-gradient(135deg, ${color}, ${color})`
          : color + "10",
        color: active ? "#fff" : color,
        cursor: "pointer",
      }}
    >
      {op.name.toUpperCase()}
    </button>
  );
})}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #EEF2FF", margin: "0 0 20px" }} />

          {/* Plan types */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", letterSpacing: 1, margin: "0 0 10px", textTransform: "uppercase" }}>
              Plan Type
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {planTypes.map((type: any) => {
                const active = selectedType === type.name;
                return (
                  <button
                    key={type._id}
                    onClick={() => setSelectedType(active ? null : type.name)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      border: active ? "none" : "1.5px solid #E0E7FF",
                      background: active
                        ? "linear-gradient(135deg, #2563EB, #6366F1)"
                        : "#F8FAFF",
                      color: active ? "#fff" : "#475569",
                      cursor: "pointer",
                      transition: "all 0.18s",
                      boxShadow: active ? "0 3px 10px rgba(37,99,235,0.25)" : "none",
                    }}
                  >
                    {type.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", letterSpacing: 1, margin: "0 0 10px", textTransform: "uppercase" }}>
              Tags
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {planTags.map((tag: any) => {
                const active = selectedTag === tag.name;
                return (
                  <button
                    key={tag._id}
                    onClick={() => setSelectedTag(active ? null : tag.name)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      border: active ? "none" : "1.5px solid #BBF7D0",
                      background: active ? "#16A34A" : "#F0FDF4",
                      color: active ? "#fff" : "#16A34A",
                      cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── PLANS GRID ── */}
          {isLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    height: 220,
                    borderRadius: 18,
                    background: "linear-gradient(90deg, #F1F5F9 25%, #E8EEFF 50%, #F1F5F9 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                  }}
                />
              ))}
            </div>
          )}

          {isError && (
            <div
              style={{
                padding: "20px 24px",
                borderRadius: 14,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              ⚠️ {error?.message || "Failed to load plans. Please try again."}
            </div>
          )}

          {!isLoading && !isError && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {plans.map((plan: any, i: number) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    border: `1.5px solid ${meta.accent}22`,
                    padding: "0 0 20px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${meta.accent}20`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${meta.accent}55`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${meta.accent}22`;
                  }}
                >
                  {/* Gradient tinted header area */}
                  
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${meta.color}10, ${meta.accent}16)`,
                      padding: "18px 18px 14px",
                      marginBottom: 4,
                      borderBottom: `1px solid ${meta.accent}14`,
                      position: "relative",
                    }}
                  >
                    {/* Top stripe */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${meta.color}, ${meta.accent})`,
                        borderRadius: "18px 18px 0 0",
                      }}
                    />

                    {/* Badge */}
                  {plan.isRecommended && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        fontSize: 10,
                        fontWeight: 700,
                        background: `${meta.accent}20`,
                        color: meta.color,
                        padding: "3px 9px",
                        borderRadius: 20,
                        letterSpacing: 0.3,
                      }}
                    >
                      ⭐ Recommended
                    </span>
                    )}

                    <h4
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "#0F172A",
                        margin: "6px 0 10px",
                        paddingRight: 86,
                        lineHeight: 1.35,
                      }}
                    >
                     {plan.name}
                    </h4>

                    {/* Price — split ₹ + number for visual hierarchy */}
                    
                   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
  {plan.salePrice ? (
    <>
      <span style={{ textDecoration: "line-through", color: "#94A3B8", fontSize: 14 }}>
        ₹{plan.price}
      </span>
      <span style={{ fontSize: 32, fontWeight: 900, color: meta.color }}>
        ₹{plan.salePrice}
      </span>
    </>
  ) : (
    <span style={{ fontSize: 32, fontWeight: 900, color: meta.color }}>
      ₹{plan.price}
    </span>
  )}
</div>
                  </div>

                  {/* Plan details pills */}
                 {/* Plan details pills */}
<div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "14px 18px 16px" }}>
  {[
    { icon: "📶", label: plan.data },
    { icon: "📅", label: plan.validity },
    { icon: "📞", label: plan.calling },
    { icon: "✉️", label: plan.sms },        // <-- SMS added
    { icon: "🏷️", label: selectedOperator.toUpperCase() }, // <-- Operator name
  ].filter((d) => d.label).map((d, idx) => (
    <span
      key={idx}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11.5,
        fontWeight: 600,
        color: "#334155",
        background: "#F1F5F9",
        padding: "4px 10px",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
      }}
    >
      {d.icon} {d.label}
    </span>
  ))}
</div>

                  {/* CTA */}
                  <div style={{ padding: "0 18px" }}>
                    <button
                      onClick={() =>
                       navigate(`/checkout/${plan._id}`, { state: plan })
                      }
                      style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: 12,
                        border: "none",
                        background: `linear-gradient(135deg, ${meta.color}, ${meta.accent})`,
                        color: "#fff",
                        fontSize: 13.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "opacity 0.18s, transform 0.15s",
                        letterSpacing: 0.2,
                        boxShadow: `0 4px 14px ${meta.accent}35`,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      Select Plan 🚀
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && plans.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  margin: "0 auto 16px",
                }}
              >
                😔
              </div>
              <p style={{ fontSize: 15, color: "#64748B", fontWeight: 600, margin: "0 0 4px" }}>
                No plans found
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 20px" }}>
                Try adjusting your filters
              </p>
              <button
                onClick={() => { setSelectedType(null); setSelectedTag(null); }}
                style={{
                  padding: "9px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #2563EB, #6366F1)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default PrepaidPage;