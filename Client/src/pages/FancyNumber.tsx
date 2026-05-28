import React, { useState } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import { FaSimCard, FaPhoneAlt, FaBusinessTime, FaHome } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useServices } from "../hooks/useServices";
import { useFancyNumbers } from "../hooks/useFancyNumbers";

const FancyNumber: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
    const { data: services = [] } = useServices();
  const { data, isLoading } = useFancyNumbers();
  
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


const [bookingItem, setBookingItem] = useState<any>(null);
const [form, setForm] = useState({ name: "", phone: "" });
  const [formErr, setFormErr] = useState<any>({});
  
  

  const numbers = Array.isArray(data?.results) ? data.results : [];
  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading fancy numbers...</div>;
  }



const handleBookClick = (item: any) => {
  navigate(`/book-now/${item._id}`);
};

const handleProceed = () => {
  const errs: any = {};
  if (!form.name.trim()) errs.name = "Name is required";
  if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter valid 10-digit number";
  setFormErr(errs);
  if (Object.keys(errs).length > 0) return;

  navigate(`/book-now/${bookingItem._id}`, {
    state: { name: form.name, phone: form.phone },
  });
  setBookingItem(null);
};
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

const formatNumber = (num: string) => {
  const str = num.toString();

  // if short → pad it
  if (str.length < 10) {
    return str.padEnd(10, "X"); // example: 420XXXXXXX
  }

  return str.replace(/(\d{5})(\d{5})/, "$1 $2");
};

  const filteredNumbers = numbers.filter((item: any) =>
    item?.number?.replace(/\s/g, "").includes(search || "")
  );
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
              <RiVipCrownFill style={{ fontSize: 11 }} /> VIP Numbers
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              Fancy Numbers
            </h1>
            <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 14 }}>
              Search and book premium VIP mobile numbers ✨
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
            👑
          </div>
        </motion.div>

        {/* SEARCH BAR CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            background: "#fff", borderRadius: 20, padding: "22px 24px",
            border: "1px solid #E0E7FF", boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg, #2563EB, #6366F1)" }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Search Numbers</h3>
            </div>
            <span style={{ fontSize: 11, color: "#2563EB", fontWeight: 600, background: "#EFF6FF", padding: "3px 10px", borderRadius: 20 }}>
              {filteredNumbers.length} found
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "#94A3B8",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search by pattern e.g. 0000, 7777"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1.5px solid #E0E7FF", borderRadius: 12,
                padding: "13px 16px 13px 42px", fontSize: 14, color: "#0F172A",
                outline: "none", transition: "border-color 0.2s",
                fontFamily: "inherit", background: "#F8FAFF",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E0E7FF")}
            />
          </div>
        </motion.div>

        {/* NUMBERS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            background: "#fff", borderRadius: 20, padding: "24px",
            border: "1px solid #E0E7FF", boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 4, height: 18, borderRadius: 4, background: "linear-gradient(180deg, #2563EB, #6366F1)" }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Available Numbers</h3>
          </div>

          {filteredNumbers.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {filteredNumbers.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  whileHover={{ y: -5 }}
                  style={{
                    background: "#fff", borderRadius: 18,
                    border: "1.5px solid #E0E7FF",
                    padding: "0 0 18px", overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(99,102,241,0.18)";
                    (e.currentTarget as HTMLElement).style.borderColor = "#A5B4FC";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "#E0E7FF";
                  }}
                >
                  {/* Top stripe */}
                    <div style={{ height: 4, borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #2563EB, #6366F1)" }} />

  <div style={{ padding: "14px 16px 16px" }}>
    {/* Badge row */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 10, fontWeight: 700, background: "#EEF2FF", color: "#4338CA", padding: "3px 9px", borderRadius: 20 }}>
        {item.vipCategoryId?.name || "Premium"}
      </span>
      {item.operatorId?.logo && (
        <img src={item.operatorId.logo} alt={item.operatorId.name} style={{ height: 18, maxWidth: 52, objectFit: "contain" }} />
      )}
    </div>

    {/* Number */}
    <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", letterSpacing: 3, fontVariantNumeric: "tabular-nums", lineHeight: 1.1, marginBottom: 2 }}>
      {formatNumber(item.number)}
    </div>
    <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>
      {item.operatorId?.name} · {item.vipCategoryId?.name}
    </div>

    {/* Price */}
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
      <span style={{ fontSize: 22, fontWeight: 900, color: "#2563EB" }}>
        ₹{(item.salePrice ?? item.price).toLocaleString("en-IN")}
      </span>
      {item.salePrice && item.salePrice < item.price && (
        <>
          <span style={{ fontSize: 13, textDecoration: "line-through", color: "#94A3B8" }}>
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#DCFCE7", color: "#166534", padding: "2px 8px", borderRadius: 20, marginLeft: "auto" }}>
            {Math.round((1 - item.salePrice / item.price) * 100)}% off
          </span>
        </>
      )}
    </div>

    {/* Book button */}
  <button
  onClick={() => handleBookClick(item)}
  style={{
    width: "100%", padding: "10px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg, #2563EB, #6366F1)",
    color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
  }}
>
  Book Now 🚀
</button>
  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: "#EEF2FF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px",
              }}>🔍</div>
              <p style={{ fontSize: 15, color: "#64748B", fontWeight: 600, margin: "0 0 4px" }}>
                No numbers found
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
                Try a different search pattern
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default FancyNumber;