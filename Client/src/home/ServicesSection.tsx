import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlanTypes } from "../hooks/usePlanTypes";
import { useServices } from "../hooks/useServices";
import { useFancyNumbers } from "../hooks/useFancyNumbers";
import { card } from "../assets";
import postpaid4 from "../assets/postpaidicon4.png";
import prepaid from "../assets/Prepaid.png";
import businesssim from "../assets/businesssim.png";
import portnumber from "../assets/portnumber.png";
import { newconnection } from "../assets";
import esim from "../assets/Esim.png";
import fancyIcon from "../assets/virtual.png";

// ── Plan type config ──────────────────────────────────────────────────────────
const planTypeConfig: Record<string, { icon: string; color: string; accent: string; bg: string; desc: string }> = {
  prepaid:  { icon: prepaid,   color: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF", desc: "Pay before you use" },
  postpaid: { icon: postpaid4, color: "#7C3AED", accent: "#8B5CF6", bg: "#F5F3FF", desc: "Pay at end of month" },
  business: { icon: "💼",      color: "#0F766E", accent: "#14B8A6", bg: "#F0FDFA", desc: "Multi-SIM corporate plans" },
};

// ── Fancy Number config ───────────────────────────────────────────────────────
const fancyNumberConfig = {
  icon: fancyIcon,
  color: "#B45309",
  accent: "#F59E0B",
  bg: "#FFFBEB",
};

// ── Service icon/color map ────────────────────────────────────────────────────
const serviceConfig = {
  port:     { icon: portnumber,    color: "#DC2626", bg: "#FEF2F2" },
  fancy:    { icon: fancyIcon,     color: "#B45309", bg: "#FFFBEB" },
  business: { icon: businesssim,   color: "#0F766E", bg: "#F0FDFA" },
  new:      { icon: newconnection, color: "#2563EB", bg: "#EFF6FF" },
  esim:     { icon: esim,          color: "#7C3AED", bg: "#F5F3FF" },
};

const getServiceStyle = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("port"))     return serviceConfig.port;
  if (lower.includes("business")) return serviceConfig.business;
  if (lower.includes("esim") || lower.includes("e-sim") || lower.includes("e sim")) return serviceConfig.esim;
  if (lower.includes("new"))      return serviceConfig.new;
  if (lower.includes("fancy"))    return serviceConfig.fancy;
  return { icon: "✨", color: "#6366F1", bg: "#EEF2FF" };
};

// ── PlanCard ──────────────────────────────────────────────────────────────────
interface PlanCardProps {
  icon: any;
  color: string;
  bg: string;
  name: string;
  desc: string;
  onClick: () => void;
}
const PlanCard: React.FC<PlanCardProps> = ({ icon, color, bg, name, desc, onClick }) => (
  <div
    onClick={onClick}
    style={{
      flex: "1 1 160px", maxWidth: 220, borderRadius: 20,
      border: `1.5px solid ${color}18`, background: "#fff",
      padding: "24px 22px", cursor: "pointer", transition: "all 0.22s",
      position: "relative" as const, overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "translateY(-4px)";
      el.style.boxShadow = `0 12px 32px ${color}22`;
      el.style.borderColor = color + "55";
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "translateY(0)";
      el.style.boxShadow = "none";
      el.style.borderColor = color + "18";
    }}
  >
    <div style={{
      position: "absolute", top: -20, right: -20,
      width: 80, height: 80, borderRadius: "50%",
      background: bg, opacity: 0.8,
    }} />
    <div style={{
      width: 48, height: 48, borderRadius: 14, background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 22, marginBottom: 14, border: `1px solid ${color}20`,
      position: "relative" as const,
    }}>
      {typeof icon === "string" && (icon.startsWith("/") || icon.startsWith("data:") || icon.includes(".png") || icon.includes(".jpg") || icon.includes(".svg")) ? (
        <img src={icon} alt="icon" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
      ) : (
        icon
      )}
    </div>
    <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", margin: "0 0 4px" }}>{name}</p>
    <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 14px" }}>{desc}</p>
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: bg, color, borderRadius: 20,
      padding: "5px 12px", fontSize: 12, fontWeight: 700,
    }}>
      View plans →
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const ServicesSection = () => {
  const navigate = useNavigate();
  const { data: planTypes }    = usePlanTypes();
  const { data: services }     = useServices();
  const { data: fancyNumbers } = useFancyNumbers();

  const fancyCount = Array.isArray(fancyNumbers) ? fancyNumbers.length : 0;

  const handlePlanTypeClick = (plan: any) =>
    navigate("/simstore", { state: { planTypeName: plan.name } });

  // Fancy Number → SimStore with fancy-number sidebar filter
 const handleFancyNumberClick = () =>
  navigate("/fancynumber");

  const handleServiceClick = (svc: any) => {
    switch (svc.slug) {
      case "new-connection":
        // New Connection → SimStore (no filter, default plan browsing)
        navigate("/simstore");
        break;
      case "port-number":
        navigate("/portnumber");
        break;
      case "business-sim":
        navigate("/businesssim");
        break;
     case "fancy-number":
  navigate("/fancynumber");
  break;
      case "e-sim":
  navigate("/esim");   // 👈 redirect to new page
  break;
      default:
        navigate(`/service/${svc.slug}`);
    }
  };

  return (
    <section style={{
      padding: "72px 24px",
      background: "linear-gradient(180deg, #F8FAFF 0%, #ffffff 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>

        {/* ══ PLAN TYPES ══ */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 40 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #2563EB, #6366F1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>📶</div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>
                    Browse by type
                  </p>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                    Choose Your <span style={{ color: "#2563EB" }}>Plan Type</span>
                  </h2>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px 48px" }}>
                Click a plan type to instantly filter plans in the store
              </p>

              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 16 }}>
                {planTypes?.map((plan: any) => {
                  const key = plan.name.toLowerCase();
                  const cfg = planTypeConfig[key] || {
                    icon: "📶", color: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF", desc: "Explore plans",
                  };
                  return (
                    <PlanCard
                      key={plan._id}
                      icon={cfg.icon}
                      color={cfg.color}
                      bg={cfg.bg}
                      name={plan.name}
                      desc={cfg.desc}
                      onClick={() => handlePlanTypeClick(plan)}
                    />
                  );
                })}

                {/* Fancy Number card — redirects to SimStore fancy-number filter */}
                <PlanCard
                  icon={fancyNumberConfig.icon}
                  color={fancyNumberConfig.color}
                  bg={fancyNumberConfig.bg}
                  name="Fancy Number"
                  desc={
                    fancyCount > 0
                      ? `${fancyCount} VIP numbers available`
                      : "Choose your VIP mobile number"
                  }
                  onClick={handleFancyNumberClick}
                />
              </div>
            </div>

            {/* RIGHT: hero image */}
            <div style={{
              flexShrink: 0, width: 320, alignSelf: "stretch",
              borderRadius: 20, overflow: "hidden",
              border: "1.5px solid rgba(37,99,235,0.10)",
              boxShadow: "0 8px 40px rgba(37,99,235,0.10)",
            }}>
              <img
                src={card} alt="Website preview"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
            </div>
          </div>
        </div>

        {/* ══ SERVICES ══ */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>⚡</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#6366F1", letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>
                Additional
              </p>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                Other <span style={{ color: "#6366F1" }}>Services</span>
              </h2>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px 48px" }}>
            Port your number, get an eSIM, or set up a business SIM
          </p>

          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 16 }}>
            {Array.isArray(services) && services.map((svc: any) => {
              const style = getServiceStyle(svc.name);
              return (
                <div
                  key={svc._id}
                  onClick={() => handleServiceClick(svc)}
                  style={{
                    flex: "1 1 200px", maxWidth: 260, borderRadius: 20,
                    border: `1.5px solid ${style.color}18`, background: "#fff",
                    padding: "24px 22px", cursor: "pointer", transition: "all 0.22s",
                    position: "relative" as const, overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = `0 12px 32px ${style.color}22`;
                    el.style.borderColor = style.color + "55";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                    el.style.borderColor = style.color + "18";
                  }}
                >
                  <div style={{
                    position: "absolute", top: -20, right: -20,
                    width: 80, height: 80, borderRadius: "50%",
                    background: style.bg, opacity: 0.8,
                  }} />
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: style.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, marginBottom: 14,
                    border: `1px solid ${style.color}20`, position: "relative" as const,
                  }}>
                    {typeof style.icon === "string" && style.icon.startsWith("/") ? (
                      <img src={style.icon} alt="icon"
                        style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 12 }} />
                    ) : style.icon}
                  </div>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", margin: "0 0 4px" }}>{svc.name}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 14px", lineHeight: 1.5 }}>
                    {svc.description || "Explore service"}
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: style.bg, color: style.color,
                    borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700,
                  }}>
                    Explore →
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;