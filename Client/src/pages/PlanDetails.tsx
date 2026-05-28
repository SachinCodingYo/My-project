import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePlanById } from "../hooks/usePlans";
import { useUser } from "../hooks/useUser";
import { useServices } from "../hooks/useServices";
import { useVipCategories } from "../hooks/useVipCategories";
import { useOperators } from "../hooks/useOperators";
import { usePlanTags } from "../hooks/usePlanTags";
import { usePlanTypes } from "../hooks/usePlanTypes";
import { useAddToCart } from "../hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../screens/LoginForm";
import SignupForm from "../screens/RegisterForm";
import {  
  X, ArrowLeft, Wifi, Clock, Phone, MessageSquare,
  Signal, Tag, Zap, Shield, Star, ShoppingCart, Plus, Minus, Check,
} from "lucide-react";
import { useCreateCheckout } from "../hooks/useCheckout";

const PlanDetails: React.FC = () => {
 const { state, pathname } = useLocation();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: plan, isLoading } = usePlanById(id || state?._id);
  const { data: user } = useUser();
  const { data: service } = useServices(plan?.serviceId);
  const { data: vip } = useVipCategories(plan?.vipCategoryId?._id);
  const { data: operator } = useOperators(plan?.operatorId?._id);
  const { data: tags = [] } = usePlanTags();
  const { data: types = [] } = usePlanTypes();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: createCheckout, isPending: isCreating } = useCreateCheckout();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

    const isPortOrder = state?.orderType === "PORT"; // ✅ add this
    const isEsimOrder = state?.orderType === "ESIM";
const hideCartControls = isPortOrder || isEsimOrder;

  if (isLoading) return (
    <div className="pd-center-screen">
      <style>{styles}</style>
      <div className="pd-loading-card">
        <div className="pd-spinner" />
        <p className="pd-loading-text">Fetching plan details…</p>
      </div>
    </div>
  );

  if (!plan) return (
    <div className="pd-center-screen">
      <style>{styles}</style>
      <div className="pd-notfound-card">
        <div className="pd-notfound-icon">🔍</div>
        <h2 className="pd-notfound-title">Plan not found</h2>
        <p className="pd-notfound-sub">This plan may no longer be available.</p>
        <button onClick={() => navigate(-1)} className="pd-notfound-btn">← Go Back</button>
      </div>
    </div>
  );

  const planTags = tags.filter((t: any) => plan.planTagsId?.includes(t._id));
  const planType = types.find((t: any) => t._id === plan.planTypeId);

  // const handleBuyNow = () => {
  //   if (!user) return setShowLoginModal(true);
  //   navigate(`/buy-now/${plan._id}`, { state: plan });
  // };

// In PlanDetails handleBuyNow:
const handleBuyNow = () => {
  if (!user) return setShowLoginModal(true);

  const orderType = state?.orderType || "NORMAL"; // ✅ read from nav state

  createCheckout(
    { type: "DIRECT", planId: plan._id, quantity: qty },
    {
      onSuccess: (data) => {
        navigate(`/buy-now/${data.sessionId}`, {
          state: { orderType, quantity: qty }, // ✅ forward it
        });
      },
    }
  );
};

  // ── Add to Cart via API ────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!user) return setShowLoginModal(true);
    addToCart(
      { planId: plan._id, quantity: qty },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2000);
        },
      }
    );
  };
  // ──────────────────────────────────────────────────────────────────────────

  const discount = plan.salePrice && plan.price
    ? Math.round(((plan.price - plan.salePrice) / plan.price) * 100)
    : null;

  const operatorName = (operator as any)?.name || "Operator";
  const operatorLogo = (operator as any)?.logo;

  const statItems = [
    { icon: <Wifi size={16} />, num: plan.data ?? "—", lbl: "Data / Day", color: "#3B82F6" },
    { icon: <Clock size={16} />, num: plan.validity ? `${plan.validity}d` : "—", lbl: "Validity", color: "#8B5CF6" },
    { icon: <Phone size={16} />, num: plan.calls ?? "—", lbl: "Calls", color: "#10B981" },
    { icon: <MessageSquare size={16} />, num: plan.sms ?? "—", lbl: "SMS / Day", color: "#F59E0B" },
    { icon: <Signal size={16} />, num: plan.networkType ?? "—", lbl: "Network", color: "#EF4444" },
  ];

  const specItems = [
    { key: "Data", val: plan.data },
    { key: "Validity", val: plan.validity ? `${plan.validity} Days` : null },
    { key: "Calls", val: plan.calls },
    { key: "SMS", val: plan.sms },
    { key: "Network", val: plan.networkType },
    { key: "Service", val: (service as any)?.name || plan.serviceId },
    { key: "Plan Type", val: planType?.name || "N/A" },
  ].filter((s) => s.val);

  return (
    <div className="pd-root">
      <style>{styles}</style>

      {/* ── TOP NAV — cart icon removed ── */}
      <nav className="pd-nav">
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="pd-nav-center">
          <span className="pd-nav-label">Plan Details</span>
        </div>
        {/* spacer to keep title centered */}
        <div style={{ width: 38 }} />
      </nav>

      {/* ── HERO CARD ── */}
      <motion.div className="pd-hero-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}>
        <div className="pd-hero-top">
          <div className="pd-op-group">
            <div className="pd-op-avatar">
              {operatorLogo
                ? <img src={operatorLogo} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
                : <span style={{ fontSize: 20 }}>📶</span>}
            </div>
            <div>
              <div className="pd-op-name">{operatorName}</div>
              <div className="pd-op-sub">{planType?.name || (service as any)?.name || "Prepaid"}</div>
            </div>
          </div>
          <div className="pd-hero-badges">
            {vip && <span className="pd-badge pd-badge-vip">👑 {(vip as any).name}</span>}
            {discount && <span className="pd-badge pd-badge-disc">{discount}% OFF</span>}
          </div>
        </div>

        <div className="pd-hero-body">
          <div className="pd-hero-info">
            <h1 className="pd-plan-title">
              {operatorName}
              <span className="pd-plan-title-accent"> {planType?.name || plan.networkType || "Mobile"}</span>
              <br />Plan
            </h1>
            {plan.description && <p className="pd-plan-desc">{plan.description}</p>}
            {planTags.length > 0 && (
              <div className="pd-tags-row">
                {planTags.map((t: any) => (
                  <span key={t._id} className="pd-tag"><Tag size={10} /> {t.name}</span>
                ))}
              </div>
            )}
          </div>
          <div className="pd-price-block">
            <div className="pd-price-you-pay">You Pay</div>
            <div className="pd-price-amount">₹{plan.salePrice || plan.price}</div>
            {plan.salePrice && (
              <div className="pd-price-was">
                <span className="pd-price-strike">₹{plan.price}</span>
                <span className="pd-price-save">Save ₹{plan.price - plan.salePrice}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── STATS ROW ── */}
      <motion.div className="pd-stats-row" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
        {statItems.map((s, i) => (
          <div className="pd-stat-card" key={i}>
            <div className="pd-stat-icon" style={{ color: s.color, background: `${s.color}15` }}>{s.icon}</div>
            <div className="pd-stat-num">{s.num}</div>
            <div className="pd-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </motion.div>

      {/* ── TWO-COLUMN DETAILS ── */}
      <motion.div className="pd-details-grid" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.36 }}>
        <div className="pd-detail-card">
          <div className="pd-detail-header">
            <div className="pd-detail-header-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}><Shield size={14} /></div>
            <span>Plan Specifications</span>
          </div>
          <div className="pd-spec-list">
            {specItems.length > 0 ? specItems.map((s, i) => (
              <motion.div className="pd-spec-item" key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 + i * 0.04 }}>
                <span className="pd-spec-key">{s.key}</span>
                <span className="pd-spec-val">{s.val}</span>
              </motion.div>
            )) : <div className="pd-empty-state">No specifications available</div>}
          </div>
        </div>

        <div className="pd-detail-card">
          <div className="pd-detail-header">
            <div className="pd-detail-header-icon" style={{ background: "#F0FDF4", color: "#10B981" }}><Star size={14} /></div>
            <span>Benefits Included</span>
          </div>
          <div className="pd-benefit-list">
            {plan.benefits?.length ? plan.benefits.map((b: string, i: number) => (
              <motion.div className="pd-benefit-item" key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 + i * 0.05 }}>
                <div className="pd-benefit-dot" />
                <span>{b}</span>
              </motion.div>
            )) : <div className="pd-empty-state">No benefits listed for this plan</div>}
          </div>
        </div>
      </motion.div>

      {/* ── SERVICE INFO ── */}
      {service && (service as any).description && (
        <motion.div className="pd-service-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="pd-service-icon-box"><Zap size={16} /></div>
          <div>
            <div className="pd-service-label">Service Info</div>
            <p className="pd-service-desc">{(service as any).description}</p>
          </div>
        </motion.div>
      )}

      <div style={{ height: 110 }} />

      {/* ── STICKY BOTTOM BAR ── */}
     {/* ── STICKY BOTTOM BAR ── */}
<div className="pd-bottom-bar">
  <div className="pd-bottom-price-group">
    <div className="pd-bottom-label">Total</div>
    <div className="pd-bottom-price-row">
      <span className="pd-bottom-price">₹{(plan.salePrice || plan.price) * qty}</span>
      {plan.salePrice && <span className="pd-bottom-was">₹{plan.price * qty}</span>}
      {discount && <span className="pd-bottom-badge">{discount}% off</span>}
    </div>
  </div>

  <div className="pd-bottom-actions">
    {/* ✅ Hide qty stepper and cart btn for PORT orders */}
    {!hideCartControls && (
      <>
        <div className="pd-qty-stepper">
          <button className="pd-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
            <Minus size={13} />
          </button>
          <span className="pd-qty-num">{qty}</span>
          <button className="pd-qty-btn" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10}>
            <Plus size={13} />
          </button>
        </div>

        <button
          className={`pd-cart-btn${addedToCart ? " pd-cart-btn-added" : ""}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {addedToCart
            ? <><Check size={15} /> Added!</>
            : isAdding
            ? <><ShoppingCart size={15} /> Adding…</>
            : <><ShoppingCart size={15} /> Add to Cart</>}
        </button>
      </>
    )}

    {/* Buy Now always shows, label changes for PORT */}
    <button
      className="pd-buy-btn"
      onClick={handleBuyNow}
      disabled={isCreating}
    >
      {isCreating
        ? "Processing..."
        : isPortOrder
        ? "Port Now →"
        : "Buy Now →"}
    </button>
  </div>
</div>

      {/* ── LOGIN MODAL ── */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div className="pd-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="pd-modal" initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: 0.22 }}>
              <div className="pd-modal-head">
                <button className="pd-modal-close" onClick={() => setShowLoginModal(false)}><X size={14} /></button>
                <h3 className="pd-modal-title">{isSignup ? "Create Account" : "Welcome Back"}</h3>
                <p className="pd-modal-sub">{isSignup ? "Sign up to complete your purchase" : "Log in to complete your purchase"}</p>
              </div>
              <div className="pd-modal-tabs">
                {(["login", "signup"] as const).map((tab) => {
                  const active = tab === (isSignup ? "signup" : "login");
                  return (
                    <button key={tab} className={`pd-tab${active ? " pd-tab-active" : ""}`} onClick={() => setIsSignup(tab === "signup")}>
                      {tab === "login" ? "Login" : "Sign Up"}
                    </button>
                  );
                })}
              </div>
              <div className="pd-modal-body">
                {isSignup
                  ? <SignupForm onSuccess={() => setShowLoginModal(false)} />
                  : <LoginForm onSuccess={() => setShowLoginModal(false)} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanDetails;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root { min-height: 100vh; background: #F0F4FF; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding-bottom: 32px; }

  .pd-nav { position: sticky; top: 0; z-index: 40; background: rgba(240,244,255,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid #DDE3F5; height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .pd-back-btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #DDE3F5; border-radius: 10px; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #4B5563; cursor: pointer; font-family: inherit; transition: all 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .pd-back-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .pd-nav-center { display: flex; align-items: center; gap: 8px; }
  .pd-nav-label { font-size: 13px; font-weight: 700; color: #6B7280; letter-spacing: 0.4px; }

  .pd-hero-card { margin: 20px 20px 0; background: #fff; border-radius: 20px; border: 1px solid #DDE3F5; padding: 24px; box-shadow: 0 2px 16px rgba(59,130,246,0.07); }
  .pd-hero-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
  .pd-op-group { display: flex; align-items: center; gap: 12px; }
  .pd-op-avatar { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 1px solid #BFDBFE; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
  .pd-op-name { font-size: 15px; font-weight: 700; color: #111827; }
  .pd-op-sub { font-size: 12px; font-weight: 500; color: #9CA3AF; margin-top: 2px; }
  .pd-hero-badges { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .pd-badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .pd-badge-vip { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
  .pd-badge-disc { background: #DCFCE7; color: #14532D; border: 1px solid #BBF7D0; }

  .pd-hero-body { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
  .pd-hero-info { flex: 1; }
  .pd-plan-title { font-family: 'Sora', sans-serif; font-size: clamp(28px, 5vw, 44px); font-weight: 800; color: #111827; line-height: 1.05; letter-spacing: -1px; text-transform: uppercase; margin-bottom: 12px; }
  .pd-plan-title-accent { color: #3B82F6; }
  .pd-plan-desc { font-size: 13.5px; color: #6B7280; line-height: 1.7; max-width: 440px; margin-bottom: 14px; }
  .pd-tags-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .pd-tag { display: inline-flex; align-items: center; gap: 4px; background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; border-radius: 20px; padding: 4px 11px; font-size: 11px; font-weight: 700; }

  .pd-price-block { text-align: right; flex-shrink: 0; background: linear-gradient(135deg, #EFF6FF, #F5F3FF); border: 1px solid #DBEAFE; border-radius: 16px; padding: 16px 20px; min-width: 140px; }
  .pd-price-you-pay { font-size: 10px; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; }
  .pd-price-amount { font-family: 'Sora', sans-serif; font-size: clamp(36px, 6vw, 52px); font-weight: 800; color: #2563EB; letter-spacing: -2px; line-height: 1; }
  .pd-price-was { display: flex; align-items: center; gap: 6px; justify-content: flex-end; margin-top: 6px; }
  .pd-price-strike { font-size: 13px; color: #9CA3AF; text-decoration: line-through; font-weight: 500; }
  .pd-price-save { font-size: 11px; font-weight: 700; color: #16A34A; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 20px; padding: 2px 8px; }

  .pd-stats-row { display: flex; gap: 12px; margin: 14px 20px 0; overflow-x: auto; padding-bottom: 2px; }
  .pd-stats-row::-webkit-scrollbar { display: none; }
  .pd-stat-card { flex: 1; min-width: 90px; background: #fff; border: 1px solid #DDE3F5; border-radius: 16px; padding: 16px 12px; text-align: center; box-shadow: 0 1px 8px rgba(0,0,0,0.04); transition: transform 0.14s; }
  .pd-stat-card:hover { transform: translateY(-2px); }
  .pd-stat-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; }
  .pd-stat-num { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.5px; }
  .pd-stat-lbl { font-size: 10px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.6px; margin-top: 3px; }

  .pd-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 20px 0; }
  .pd-detail-card { background: #fff; border: 1px solid #DDE3F5; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.04); }
  .pd-detail-header { display: flex; align-items: center; gap: 10px; padding: 16px 18px; background: #FAFBFF; border-bottom: 1px solid #DDE3F5; font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.8px; }
  .pd-detail-header-icon { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .pd-spec-list { padding: 6px 0; }
  .pd-spec-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 18px; border-bottom: 1px solid #F3F4F6; transition: background 0.12s; }
  .pd-spec-item:last-child { border-bottom: none; }
  .pd-spec-item:hover { background: #F9FAFB; }
  .pd-spec-key { font-size: 13px; color: #6B7280; font-weight: 500; }
  .pd-spec-val { font-size: 13px; font-weight: 700; color: #111827; background: #F3F4F6; border-radius: 8px; padding: 3px 10px; }
  .pd-benefit-list { padding: 8px 18px 12px; }
  .pd-benefit-item { display: flex; align-items: flex-start; gap: 10px; padding: 9px 0; border-bottom: 1px solid #F3F4F6; font-size: 13px; color: #374151; font-weight: 500; line-height: 1.55; }
  .pd-benefit-item:last-child { border-bottom: none; }
  .pd-benefit-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(135deg, #10B981, #34D399); flex-shrink: 0; margin-top: 5px; box-shadow: 0 0 0 3px #D1FAE5; }
  .pd-empty-state { padding: 24px 18px; font-size: 13px; color: #9CA3AF; text-align: center; }

  .pd-service-banner { display: flex; align-items: flex-start; gap: 12px; margin: 14px 20px 0; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 16px; padding: 16px 20px; }
  .pd-service-icon-box { width: 32px; height: 32px; border-radius: 10px; background: #FEF3C7; border: 1px solid #FDE68A; color: #D97706; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pd-service-label { font-size: 10px; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .pd-service-desc { font-size: 13px; color: #78350F; line-height: 1.65; }

  .pd-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); border-top: 1px solid #DDE3F5; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-shadow: 0 -4px 20px rgba(0,0,0,0.07); }
  .pd-bottom-price-group { flex-shrink: 0; }
  .pd-bottom-label { font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.9px; margin-bottom: 2px; }
  .pd-bottom-price-row { display: flex; align-items: baseline; gap: 6px; }
  .pd-bottom-price { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -1px; }
  .pd-bottom-was { font-size: 13px; color: #9CA3AF; text-decoration: line-through; font-weight: 500; }
  .pd-bottom-badge { background: #DCFCE7; color: #14532D; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid #BBF7D0; }
  .pd-bottom-actions { display: flex; align-items: center; gap: 8px; }

  .pd-qty-stepper { display: flex; align-items: center; background: #F3F4F6; border-radius: 12px; border: 1px solid #E5E7EB; overflow: hidden; flex-shrink: 0; }
  .pd-qty-btn { width: 34px; height: 40px; background: transparent; border: none; cursor: pointer; color: #374151; display: flex; align-items: center; justify-content: center; transition: background 0.12s; font-family: inherit; }
  .pd-qty-btn:hover:not(:disabled) { background: #E5E7EB; }
  .pd-qty-btn:disabled { opacity: 0.35; cursor: default; }
  .pd-qty-num { min-width: 28px; text-align: center; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #111827; }

  .pd-cart-btn { display: flex; align-items: center; gap: 7px; padding: 11px 18px; background: #fff; border: 1.5px solid #6366F1; border-radius: 14px; color: #6366F1; font-size: 13px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap; transition: all 0.18s; box-shadow: 0 2px 10px rgba(99,102,241,0.12); }
  .pd-cart-btn:hover { background: #F5F3FF; }
  .pd-cart-btn:disabled { opacity: 0.65; cursor: not-allowed; }
  .pd-cart-btn-added { background: #F0FDF4 !important; border-color: #10B981 !important; color: #059669 !important; }

  .pd-buy-btn { padding: 11px 24px; background: linear-gradient(135deg, #2563EB, #6366F1); border: none; border-radius: 14px; color: #fff; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 20px rgba(99,102,241,0.35); transition: opacity 0.15s, transform 0.12s; }
  .pd-buy-btn:hover { opacity: 0.92; }
  .pd-buy-btn:active { transform: scale(0.97); }

  .pd-center-screen { min-height: 100vh; background: #F0F4FF; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  .pd-loading-card { background: #fff; border-radius: 20px; border: 1px solid #DDE3F5; padding: 40px 48px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .pd-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid #DBEAFE; border-top-color: #3B82F6; margin: 0 auto 16px; animation: pd-spin 0.75s linear infinite; }
  @keyframes pd-spin { to { transform: rotate(360deg); } }
  .pd-loading-text { font-size: 13px; font-weight: 600; color: #6B7280; }
  .pd-notfound-card { background: #fff; border-radius: 20px; padding: 40px 48px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .pd-notfound-icon { font-size: 48px; margin-bottom: 14px; }
  .pd-notfound-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 6px; }
  .pd-notfound-sub { font-size: 13px; color: #9CA3AF; margin-bottom: 20px; }
  .pd-notfound-btn { padding: 10px 24px; border-radius: 12px; border: none; background: linear-gradient(135deg, #2563EB, #6366F1); color: #fff; font-weight: 700; font-size: 13px; cursor: pointer; font-family: inherit; }

  .pd-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .pd-modal { background: #fff; border-radius: 22px; width: 100%; max-width: 420px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.18); border: 1px solid #DDE3F5; }
  .pd-modal-head { background: linear-gradient(135deg, #2563EB, #6366F1); padding: 22px 22px 18px; position: relative; }
  .pd-modal-close { position: absolute; top: 14px; right: 14px; width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; transition: background 0.15s; }
  .pd-modal-close:hover { background: rgba(255,255,255,0.3); }
  .pd-modal-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 4px; }
  .pd-modal-sub { font-size: 13px; color: rgba(255,255,255,0.7); }
  .pd-modal-tabs { display: flex; margin: 14px 18px 0; background: #F3F4F6; border-radius: 12px; padding: 3px; gap: 3px; }
  .pd-tab { flex: 1; padding: 9px; border-radius: 9px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; background: transparent; color: #6B7280; }
  .pd-tab-active { background: linear-gradient(135deg, #2563EB, #6366F1); color: #fff; box-shadow: 0 2px 10px rgba(99,102,241,0.3); }
  .pd-modal-body { padding: 14px 18px 22px; }

  @media (max-width: 700px) {
    .pd-hero-card { margin: 12px 12px 0; padding: 18px; }
    .pd-hero-body { flex-direction: column; }
    .pd-price-block { text-align: left; width: 100%; min-width: unset; }
    .pd-price-was { justify-content: flex-start; }
    .pd-stats-row { margin: 10px 12px 0; gap: 8px; }
    .pd-stat-card { min-width: 80px; padding: 12px 8px; }
    .pd-details-grid { grid-template-columns: 1fr; margin: 10px 12px 0; gap: 10px; }
    .pd-service-banner { margin: 10px 12px 0; }
    .pd-bottom-bar { padding: 8px 12px; flex-wrap: wrap; }
    .pd-bottom-price-group { width: 100%; }
    .pd-bottom-actions { width: 100%; justify-content: flex-end; }
    .pd-buy-btn { padding: 11px 16px; font-size: 13px; }
    .pd-cart-btn { padding: 11px 12px; font-size: 12px; }
  }
`;