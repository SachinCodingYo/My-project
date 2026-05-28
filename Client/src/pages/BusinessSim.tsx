import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSimCard, FaPhoneAlt, FaBusinessTime, FaHome } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useServices } from "../hooks/useServices";
import { usePlans } from "../hooks/usePlans";




const BusinessSim: React.FC = () => {
  const { data: plans = [] } = usePlans({
    isBusinessSim: true,  

  });

const formattedPlans = plans.map((plan: any) => ({
  id: plan._id,

  name: `${plan.operatorId?.name} Business Plan`,

  price: plan.salePrice || plan.price,

  accent: "#2563EB",
  gradient: "linear-gradient(135deg, #2563EB, #6366F1)",
  badge: "Popular",

  features: [
    `${plan.data} Data`,
    `${plan.calls} Calling`,
    `${plan.sms} SMS`,
    `${plan.validity} Days Validity`,
    ...(plan.benefits || []),
  ],
}));

  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: services = [] } = useServices();



  // const serviceItems = Array.isArray(services)
  // ? services.map((service: any) => {
  //    let path = `/service/${service.slug}`;

  // const menuItems = [
  //   { name: "Simstore",         path: "/simstore",            icon: <FaHome /> },
  //   // { name: "Prepaid",      path: "/prepaid",     icon: <FaSimCard /> },
  //   // { name: "Postpaid",     path: "/postpaid",    icon: <FaPhoneAlt /> },
  //   { name: "Port Number",  path: "/portnumber",  icon: <MdSwapHoriz /> },
  //   { name: "Fancy Number", path: "/fancynumber", icon: <RiVipCrownFill /> },
  //   { name: "Business SIM", path: "/businesssim", icon: <FaBusinessTime /> },
  // ];

  const serviceMap: any = {
  "new-connection": {
    path: "/simstore",
    name: "New Connection",
    icon: <FaSimCard />
  },
  "port-number": {
    path: "/portnumber",
    name: "Port Number",
    icon: <MdSwapHoriz />
  },
  "fancy-number": {
    path: "/fancynumber",
    name: "Fancy Number",
    icon: <RiVipCrownFill />
  },
  "business-sim": {
    path: "/businesssim",
    name: "Business SIM",
    icon: <FaBusinessTime />
  },
  "e-sim": {
    path: "/esim",
    name: "eSIM",
    icon: <FaPhoneAlt />
  }
};

const orderedSlugs = [
  "new-connection",
  "port-number",
  "fancy-number",
  "business-sim",
  "e-sim"
];

const serviceItems = orderedSlugs.map((slug) => {
  const service = services.find((s: any) => s.slug === slug);
  const config = serviceMap[slug];

  return {
    name: config?.name || service?.name,
    path: config?.path || `/service/${slug}`,
    icon: config?.icon || <FaHome />,
  };
});



  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#F0F4FF",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: sidebarCollapsed ? 72 : 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1E3A8A 0%, #2563EB 100%)",
        display: "flex", flexDirection: "column",
        padding: "24px 0",
        transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
        position: "sticky", top: 0, overflow: "hidden", zIndex: 10,
        boxShadow: "4px 0 24px rgba(37,99,235,0.18)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: sidebarCollapsed ? "0 19px 24px" : "0 22px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.12)", marginBottom: 10,
          overflow: "hidden", whiteSpace: "nowrap",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11, flexShrink: 0,
            background: "rgba(255,255,255,0.18)", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)",
          }}>📶</div>
          {!sidebarCollapsed && (
            <span style={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.4px" }}>
              SimConnect
            </span>
          )}
        </div>

        <nav style={{ flex: 1, padding: "0 10px" }}>
          {/* 🔥 SERVICES ONLY */}
          {serviceItems.length > 0 && (
            <>
              <p style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.6)",
                padding: "10px 12px",
                marginTop: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}>
                Services
              </p>

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
        </nav>

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

      {/* ─── MAIN ─── */}
      <main style={{
        flex: 1, padding: "28px 26px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 22, minWidth: 0,
      }}>

        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #6366F1 60%, #818CF8 100%)",
            borderRadius: 22, padding: "30px 34px", color: "#fff",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "relative", overflow: "hidden",
            boxShadow: "0 8px 32px rgba(37,99,235,0.28)",
          }}
        >
          <div style={{ position: "absolute", top: -40, right: 100, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -50, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", top: -20, left: "40%", width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)", borderRadius: 20,
              padding: "5px 14px", fontSize: 12, fontWeight: 600,
              marginBottom: 14, backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <FaBusinessTime style={{ fontSize: 11 }} /> Business SIM
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              Business SIM Plans
            </h1>
            <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 14 }}>
              Tailored for startups, SMEs & enterprises ✨
            </p>
          </div>

          <div style={{
            width: 80, height: 80, borderRadius: 20, flexShrink: 0,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, backdropFilter: "blur(8px)",
            position: "relative", zIndex: 1,
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}>
            🏢
          </div>
        </motion.div>

        {/* PERKS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: "#fff", borderRadius: 20, padding: "20px 24px",
            border: "1px solid #E0E7FF", boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {[
              { icon: "🔒", label: "Secure Plans" },
              { icon: "📞", label: "Dedicated Support" },
              { icon: "🚚", label: "Doorstep Delivery" },
              { icon: "⚡", label: "Fast Activation" },
            ].map((perk, i) => (
              <div key={i} style={{
                background: "#F8FAFF", border: "1.5px solid #E0E7FF",
                borderRadius: 14, padding: "14px 12px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{perk.icon}</div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: 0 }}>{perk.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PLANS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            background: "#fff", borderRadius: 20, padding: "24px",
            border: "1px solid #E0E7FF", boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg, #2563EB, #6366F1)" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Choose Your Plan</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
  {formattedPlans.map((plan, i) => (
              <motion.div
              key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                whileHover={{ y: -6 }}
                style={{
                  background: "#fff", borderRadius: 18,
                  border: plan.featured ? `2px solid ${plan.accent}` : `1.5px solid ${plan.accent}22`,
                  padding: "0 0 20px", position: "relative", overflow: "hidden",
                  boxShadow: plan.featured
                    ? `0 8px 28px ${plan.accent}25`
                    : "0 2px 10px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${plan.accent}22`;
                  if (!plan.featured) (e.currentTarget as HTMLElement).style.borderColor = `${plan.accent}55`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = plan.featured
                    ? `0 8px 28px ${plan.accent}25`
                    : "0 2px 10px rgba(0,0,0,0.04)";
                  if (!plan.featured) (e.currentTarget as HTMLElement).style.borderColor = `${plan.accent}22`;
                }}
              >
                {/* Tinted header */}
                <div style={{
                  background: `linear-gradient(135deg, ${plan.accent}10, ${plan.accent}18)`,
                  padding: "18px 18px 14px",
                  borderBottom: `1px solid ${plan.accent}14`,
                  position: "relative",
                }}>
                  {/* Top stripe */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    height: 4, background: plan.gradient,
                    borderRadius: "18px 18px 0 0",
                  }} />

                  {/* Badge */}
                  <span style={{
                    display: "inline-block",
                    fontSize: 10, fontWeight: 700,
                    background: `${plan.accent}20`, color: plan.accent,
                    padding: "3px 10px", borderRadius: 20, marginBottom: 10,
                    letterSpacing: 0.3,
                  }}>
                    {plan.badge}
                  </span>

                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 10px" }}>
                    {plan.name}
                  </h4>

                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: plan.accent, lineHeight: 1 }}>₹</span>
                    <span style={{ fontSize: 36, fontWeight: 900, color: plan.accent, letterSpacing: "-1.5px", lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginLeft: 4 }}>/plan</span>
                  </div>
                </div>

                {/* Feature checklist */}
                <ul style={{ listStyle: "none", padding: "14px 18px", margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {(plan.features || [
                    `${plan.data || "N/A"} Data`,
                    "Unlimited Calling",
                    "100 SMS / Day",
                    `${plan.validity || "N/A"} Days`,
                  ]).map((feat, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: `${plan.accent}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, color: plan.accent, fontWeight: 800, flexShrink: 0,
                      }}>✓</span>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: "#475569" }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div style={{ padding: "0 18px" }}>
                  <button
                    onClick={() =>
                   navigate(`/checkout/business/${plan.id}`)
                    }
                    style={{
                      width: "100%", padding: "11px", borderRadius: 12, border: "none",
                      background: plan.gradient,
                      color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                      letterSpacing: 0.2, boxShadow: `0 4px 14px ${plan.accent}35`,
                      transition: "opacity 0.18s, transform 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Choose Plan 🚀
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BusinessSim;