import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt, FaCheckCircle, FaSimCard } from "react-icons/fa";
import { MdSignalCellularAlt, MdCalendarToday, MdCall, MdMessage, MdSpeed } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { usePlanById } from "../hooks/usePlans";

// ── Fallback only — used when API returns no color fields ─────────────────────
const FALLBACK = { color: "#2563EB", accent: "#6366F1", bg: "#EFF6FF" };

export default function CheckoutPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: plan, isLoading, isError } = usePlanById(id);

  const [mobile, setMobile]   = useState("");
  const [focused, setFocused] = useState(false);
  const [paying, setPaying]   = useState(false);
  const [paid,   setPaid]     = useState(false);

  // ── Operator info — fully from API ────────────────────────────────────────
  const operator = plan?.operatorId ?? {};
  const opName   = operator.name  ?? "Operator";
  const opLogo   = operator.logo  ?? "";

  // Colors come from the operator document in DB — no static map needed
  const opColor  = operator.color  ?? FALLBACK.color;
  const opAccent = operator.accent ?? FALLBACK.accent;
  const opBg     = operator.bg     ?? FALLBACK.bg;

  // ── Financials ────────────────────────────────────────────────────────────
  const price       = plan?.salePrice || plan?.price || 0;
  const origPrice   = plan?.salePrice ? plan?.price : null;
  const discount    = origPrice ? origPrice - price : 0;
  const platformFee = 10;
  const total       = price + platformFee;

  // ── Detail pills ─────────────────────────────────────────────────────────
  const details = [
    { icon: <MdSignalCellularAlt />, value: plan?.data },
    { icon: <MdCalendarToday />,     value: plan?.validity ? `${plan.validity} days` : null },
    { icon: <MdCall />,              value: plan?.calls },
    { icon: <MdMessage />,           value: plan?.sms },
    { icon: <MdSpeed />,             value: plan?.networkType },
  ].filter((d) => d.value);

  const handlePay = async () => {
    if (mobile.length !== 10 || paying || paid) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setPaid(true);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${FALLBACK.color}, ${FALLBACK.accent})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{
            width: 48, height: 48,
            border: "4px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <p style={{ fontWeight: 600, fontSize: 15, opacity: 0.9, margin: 0 }}>Fetching plan…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────
  if (isError || !plan) {
    return (
      <div style={{
        minHeight: "100vh", background: "#F0F4FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>😕</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>Plan not found</p>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px" }}>
            We couldn't load this plan. Please go back and try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 28px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${FALLBACK.color}, ${FALLBACK.accent})`,
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#F0F4FF",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: "32px 16px",
    }}>
      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes check-pop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @media (max-width: 680px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .right-panel   { border-left: none !important; border-top: 1px solid #F1F5F9 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
            background: "#fff", border: "1px solid #E0E7FF", borderRadius: 12,
            padding: "9px 18px", fontSize: 13, fontWeight: 600,
            color: "#374151", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <FaArrowLeft style={{ fontSize: 12 }} /> Back to Plans
        </motion.button>

        {/* ── Success modal ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {paid && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
                zIndex: 50, display: "flex", alignItems: "center",
                justifyContent: "center", padding: 24,
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }}
                style={{
                  background: "#fff", borderRadius: 28, padding: "48px 36px",
                  textAlign: "center", maxWidth: 360, width: "100%",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${opColor}, ${opAccent})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  animation: "check-pop 0.5s cubic-bezier(.175,.885,.32,1.275) both",
                }}>
                  <FaCheckCircle style={{ fontSize: 36, color: "#fff" }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
                  Payment Successful!
                </h2>
                <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 4px" }}>
                  Recharge of <strong>₹{total}</strong> for
                </p>
                <p style={{ fontSize: 17, fontWeight: 700, color: opColor, margin: "0 0 28px" }}>
                  +91 {mobile}
                </p>
                <button
                  onClick={() => navigate("/")}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 14, border: "none",
                    background: `linear-gradient(135deg, ${opColor}, ${opAccent})`,
                    color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                    boxShadow: `0 6px 20px ${opAccent}50`,
                  }}
                >
                  Back to Home
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main card ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "#fff", borderRadius: 28, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Colored top stripe — operator color from API */}
          <div style={{ height: 5, background: `linear-gradient(90deg, ${opColor}, ${opAccent})` }} />

          <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

            {/* ══════════ LEFT ══════════ */}
            <div style={{ padding: "36px 36px 40px", borderRight: "1px solid #F1F5F9" }}>

              <div style={{ marginBottom: 26 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                  Confirm Recharge
                </h2>
                <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>Review your plan before paying</p>
              </div>

              {/* Operator + plan type chip — all data from API */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: opBg, border: `1.5px solid ${opAccent}30`,
                borderRadius: 50, padding: "6px 14px 6px 8px", marginBottom: 22,
              }}>
                {opLogo ? (
                  <img src={opLogo} alt={opName}
                    style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <FaSimCard style={{ fontSize: 13, color: opColor }} />
                )}
                <span style={{ fontSize: 12, fontWeight: 700, color: opColor, letterSpacing: 0.4 }}>
                  {opName.toUpperCase()}
                </span>
                {plan?.planTypeId?.name && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: `${opAccent}22`, color: opColor,
                    padding: "2px 9px", borderRadius: 20,
                  }}>
                    {plan.planTypeId.name}
                  </span>
                )}
              </div>

              {/* Plan hero card */}
              <div style={{
                background: `linear-gradient(135deg, ${opColor}, ${opAccent})`,
                borderRadius: 20, padding: "24px", color: "#fff",
                marginBottom: 22, position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -24, right: -24, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <div style={{ position: "absolute", bottom: -32, left: "25%", width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Price */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: "-1px" }}>
                      ₹{price}
                    </span>
                    {origPrice && (
                      <span style={{ fontSize: 16, textDecoration: "line-through", opacity: 0.55, marginBottom: 4 }}>
                        ₹{origPrice}
                      </span>
                    )}
                    {discount > 0 && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: "rgba(255,255,255,0.22)",
                        padding: "3px 9px", borderRadius: 20, marginBottom: 4,
                      }}>
                        Save ₹{discount}
                      </span>
                    )}
                  </div>

                  {plan?.description && (
                    <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 14px", lineHeight: 1.5 }}>
                      {plan.description}
                    </p>
                  )}

                  {/* Detail pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {details.map((d, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: "rgba(255,255,255,0.18)",
                        borderRadius: 50, padding: "5px 12px",
                        fontSize: 12, fontWeight: 600,
                        backdropFilter: "blur(4px)",
                      }}>
                        <span style={{ fontSize: 14 }}>{d.icon}</span>
                        {d.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits — from API */}
              {plan?.benefits?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, margin: "0 0 10px", textTransform: "uppercase" }}>
                    Included Benefits
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {plan.benefits.map((b: string, i: number) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: opBg, border: `1.5px solid ${opAccent}25`,
                        borderRadius: 50, padding: "6px 14px",
                      }}>
                        <FaCheckCircle style={{ fontSize: 11, color: opColor }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: opColor }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile input */}
              <div>
                <label style={{
                  fontSize: 11, fontWeight: 700, color: "#374151",
                  display: "block", marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase",
                }}>
                  Mobile Number
                </label>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: `2px solid ${focused ? opAccent : "#E2E8F0"}`,
                  borderRadius: 14, overflow: "hidden",
                  transition: "border-color 0.2s, background 0.2s",
                  background: focused ? opBg : "#F8FAFF",
                }}>
                  <span style={{
                    padding: "13px 14px", fontSize: 14, fontWeight: 700,
                    color: opColor, background: `${opAccent}14`,
                    borderRight: `2px solid ${focused ? opAccent : "#E2E8F0"}`,
                    transition: "border-color 0.2s", flexShrink: 0,
                  }}>
                    +91
                  </span>
                  <input
                    type="text" value={mobile} maxLength={10}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Enter 10-digit number"
                    style={{
                      flex: 1, border: "none", outline: "none",
                      padding: "13px 14px", fontSize: 15, fontWeight: 600,
                      color: "#0F172A", background: "transparent", letterSpacing: 1,
                    }}
                  />
                  {mobile.length === 10 && (
                    <FaCheckCircle style={{
                      fontSize: 18, color: opColor, marginRight: 14, flexShrink: 0,
                      animation: "check-pop 0.3s ease both",
                    }} />
                  )}
                </div>
                {mobile.length > 0 && mobile.length < 10 && (
                  <p style={{ fontSize: 11, color: "#F59E0B", margin: "6px 0 0 4px", fontWeight: 600 }}>
                    {10 - mobile.length} more digits needed
                  </p>
                )}
              </div>
            </div>

            {/* ══════════ RIGHT ══════════ */}
            <div className="right-panel" style={{ padding: "36px 36px 40px", background: "#FAFBFF" }}>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 24px", letterSpacing: "-0.3px" }}>
                Order Summary
              </h3>

              {/* Line items */}
              <div style={{
                background: "#fff", borderRadius: 18,
                border: "1px solid #E0E7FF", overflow: "hidden", marginBottom: 16,
              }}>
                {[
                  {
                    label: "Plan charge",
                    sub: [plan?.data, plan?.validity ? `${plan.validity} days` : null, plan?.networkType]
                      .filter(Boolean).join(" · "),
                    value: `₹${price}`,
                    strike: origPrice ? `₹${origPrice}` : null,
                  },
                  { label: "Platform fee", sub: "One-time processing charge", value: "₹10", strike: null },
                ].map((row, i, arr) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 18px",
                    borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#374151" }}>{row.label}</p>
                      {row.sub && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94A3B8" }}>{row.sub}</p>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {row.strike && (
                        <p style={{ margin: 0, fontSize: 11, color: "#94A3B8", textDecoration: "line-through" }}>{row.strike}</p>
                      )}
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                background: `linear-gradient(135deg, ${opColor}0D, ${opAccent}18)`,
                border: `1.5px solid ${opAccent}30`,
                borderRadius: 16, padding: "16px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 24,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Total Payable
                  </p>
                  {discount > 0 && (
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "#16A34A", fontWeight: 600 }}>
                      🎉 You save ₹{discount}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 32, fontWeight: 900, color: opColor, letterSpacing: "-0.5px" }}>
                  ₹{total}
                </span>
              </div>

              {/* Pay button */}
              <motion.button
                onClick={handlePay}
                disabled={mobile.length !== 10 || paying || paid}
                whileTap={{ scale: mobile.length === 10 ? 0.97 : 1 }}
                style={{
                  width: "100%", padding: "15px", borderRadius: 16, border: "none",
                  background: mobile.length !== 10
                    ? "#E2E8F0"
                    : `linear-gradient(135deg, ${opColor}, ${opAccent})`,
                  color: mobile.length !== 10 ? "#94A3B8" : "#fff",
                  fontSize: 15, fontWeight: 800,
                  cursor: mobile.length !== 10 ? "not-allowed" : "pointer",
                  letterSpacing: 0.3, transition: "all 0.2s",
                  boxShadow: mobile.length === 10 ? `0 6px 24px ${opAccent}45` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                {paying ? (
                  <>
                    <div style={{
                      width: 18, height: 18,
                      border: "2.5px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Processing…
                  </>
                ) : (
                  <>🔒 Pay ₹{total}</>
                )}
              </motion.button>

              {/* Trust */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
                <FaShieldAlt style={{ fontSize: 11, color: "#94A3B8" }} />
                <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
                  256-bit SSL · Secure Checkout · Instant Activation
                </span>
              </div>

              <div style={{ borderTop: "1px solid #E0E7FF", margin: "24px 0 20px" }} />

              {/* Steps */}
              <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                What happens next
              </p>
              {[
                "Payment is verified instantly",
                "Recharge applied to your number",
                "Confirmation SMS sent to your device",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: `${opAccent}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: opColor, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}