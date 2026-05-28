import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ShoppingCart, Trash2, Plus, Minus,
  Wifi, Clock, ShoppingBag, ChevronRight,
} from "lucide-react";
import {
  useCart,
  useUpdateQuantity,
  useRemoveItem,
  useClearCart,
} from "../hooks/useCart";
import { useCreateCheckout } from "../hooks/useCheckout";

const Cart: React.FC = () => {
  const navigate = useNavigate();


  const { mutate: createCheckout, isPending } = useCreateCheckout();

  const { data: rawCart, isLoading } = useCart();
  const { mutate: updateQty } = useUpdateQuantity();
  const { mutate: removeItem } = useRemoveItem();
  const { mutate: clearCart } = useClearCart();

  const items = rawCart?.cart?.items || [];

  const handleRemove = (planId: string) => removeItem(planId);

  const handleUpdateQty = (planId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(planId);
    } else {
      updateQty({ planId, quantity: Math.min(10, qty) });
    }
  };

  const subtotal = rawCart?.subTotal ?? 0;
  const platformFee = rawCart?.platformFee ?? 0;
  const deliveryFee = rawCart?.deliveryPrice ?? 0;
  const operatorFee = rawCart?.totalOperatorFee ?? 0;
  const totalPrice = rawCart?.totalPrice ?? 0;

  const originalTotal = items.reduce((s: number, i: any) => {
    return s + (i.planId?.price ?? 0) * (i.quantity ?? 1);
  }, 0);

  const totalSavings = originalTotal - subtotal;
  const totalQty = items.reduce((s: number, i: any) => s + (i.quantity ?? 1), 0);

  if (isLoading) return (
    <div className="ct-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <style>{styles}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #DBEAFE", borderTopColor: "#3B82F6", margin: "0 auto 12px", animation: "ct-spin 0.75s linear infinite" }} />
        <p style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Loading cart…</p>
      </div>
    </div>
  );

  return (
    <div className="ct-root">
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className="ct-nav">
        <button className="ct-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="ct-nav-center">
          <ShoppingCart size={15} />
          <span className="ct-nav-label">My Cart</span>
          {totalQty > 0 && <span className="ct-nav-count">{totalQty}</span>}
        </div>
        {items.length > 0 && (
          <button className="ct-clear-btn" onClick={() => clearCart()}>
            Clear All
          </button>
        )}
      </nav>

      {/* ── EMPTY STATE ── */}
      {items.length === 0 && (
        <motion.div
          className="ct-empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="ct-empty-icon">
            <ShoppingBag size={40} strokeWidth={1.3} />
          </div>
          <h2 className="ct-empty-title">Your cart is empty</h2>
          <p className="ct-empty-sub">Add plans from the browse page to get started.</p>
          <button className="ct-empty-btn" onClick={() => navigate(-1)}>
            Browse Plans →
          </button>
        </motion.div>
      )}

      {/* ── TWO COLUMN LAYOUT ── */}
      {items.length > 0 && (
        <div className="ct-two-col">

          {/* ═══════════════════════════════
              LEFT COLUMN — Items
          ═══════════════════════════════ */}
          <div className="ct-col-left">

            {/* Section header */}
            <div className="ct-section-header">
              <div className="ct-section-title">
                <ShoppingCart size={15} />
                Items in Cart
              </div>
              <span className="ct-section-badge">{totalQty} item{totalQty !== 1 ? "s" : ""}</span>
            </div>

            {/* Savings strip */}
            {totalSavings > 0 && (
              <motion.div
                className="ct-savings-strip"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="ct-savings-icon">🎉</span>
                <span>You're saving <strong>₹{totalSavings}</strong> on this order!</span>
              </motion.div>
            )}

            {/* Item cards */}
            <div className="ct-list">
              <AnimatePresence>
                {items.map((item: any, idx: number) => {
                  const plan = item.planId ?? {};
                  const planId = plan._id ?? item._id;
                  const unitPrice = plan.salePrice ?? plan.price ?? 0;
                  const disc = plan.salePrice && plan.price
                    ? Math.round(((plan.price - plan.salePrice) / plan.price) * 100)
                    : null;

                  return (
                    <motion.div
                      key={item._id ?? planId ?? idx}
                      className="ct-item-card"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, scale: 0.96 }}
                      transition={{ duration: 0.25, delay: idx * 0.04 }}
                      layout
                    >
                      {/* ── Card Header: operator + remove ── */}
                      <div className="ct-card-header">
                        <div className="ct-card-header-left">
                          <div className="ct-item-avatar">
                            {plan.operatorId?.logo
                              ? <img src={plan.operatorId.logo} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                              : <span style={{ fontSize: 18 }}>📶</span>}
                          </div>
                          <div>
                            <div className="ct-item-operator">{plan.operatorId?.name || "Operator"}</div>
                            <div className="ct-item-type">
                              {plan.planTypeId?.name || "Prepaid"}
                              {plan.serviceId?.name ? ` · ${plan.serviceId.name}` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="ct-card-header-right">
                          {disc !== null && (
                            <span className="ct-disc-badge">{disc}% OFF</span>
                          )}
                          <button className="ct-remove-btn" onClick={() => handleRemove(planId)} title="Remove">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* ── Card Body: chips + desc ── */}
                      <div className="ct-card-body">
                        <div className="ct-chips">
                          {plan.data && (
                            <span className="ct-chip">
                              <Wifi size={11} /> {plan.data}
                            </span>
                          )}
                          {plan.validity && (
                            <span className="ct-chip">
                              <Clock size={11} /> {plan.validity}d
                            </span>
                          )}
                          {plan.networkType && (
                            <span className="ct-chip ct-chip-net">{plan.networkType}</span>
                          )}
                          {plan.calls && (
                            <span className="ct-chip">📞 {plan.calls}</span>
                          )}
                          {plan.sms && (
                            <span className="ct-chip">💬 {plan.sms}</span>
                          )}
                        </div>
                        {plan.description && (
                          <p className="ct-item-desc">{plan.description}</p>
                        )}
                      </div>

                      {/* ── Card Footer: price + stepper + link ── */}
                      <div className="ct-card-footer">
                        {/* Price block */}
                        <div className="ct-price-block">
                          <div className="ct-price-row">
                            <span className="ct-unit-price-big">₹{unitPrice}</span>
                            <span className="ct-per-plan">/ plan</span>
                            {plan.salePrice && plan.price && (
                              <span className="ct-was-price">₹{plan.price}</span>
                            )}
                          </div>
                          {(item.quantity ?? 1) > 1 && (
                            <div className="ct-line-total-row">
                              = ₹{unitPrice * (item.quantity ?? 1)} total
                            </div>
                          )}
                        </div>

                        {/* Right: stepper + view link stacked */}
                        <div className="ct-footer-right">
                          <div className="ct-stepper">
                            <button
                              className="ct-step-btn"
                              onClick={() => handleUpdateQty(planId, (item.quantity ?? 1) - 1)}
                              disabled={(item.quantity ?? 1) <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="ct-step-num">{item.quantity ?? 1}</span>
                            <button
                              className="ct-step-btn"
                              onClick={() => handleUpdateQty(planId, (item.quantity ?? 1) + 1)}
                              disabled={(item.quantity ?? 1) >= 10}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            className="ct-view-link"
                            onClick={() => navigate(`/plan-details/${planId}`, { state: plan })}
                          >
                            Details <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══════════════════════════════
              RIGHT COLUMN — Order Summary
          ═══════════════════════════════ */}
          <div className="ct-col-right">
            <motion.div
              className="ct-summary-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {/* Summary header */}
              <div className="ct-section-header" style={{ marginBottom: 18 }}>
                <div className="ct-section-title" style={{ fontSize: 13 }}>
                  Order Summary
                </div>
              </div>

              {/* Fee rows */}
              <div className="ct-fee-rows">

                <div className="ct-fee-row">
                  <span className="ct-fee-label">
                    Subtotal
                    <span className="ct-fee-sub"> ({totalQty} item{totalQty !== 1 ? "s" : ""})</span>
                  </span>
                  <span className="ct-fee-value">₹{subtotal}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="ct-fee-row ct-fee-discount">
                    <span className="ct-fee-label">Discount</span>
                    <span className="ct-fee-value">−₹{totalSavings}</span>
                  </div>
                )}

                <div className="ct-fee-row">
                  <span className="ct-fee-label">Platform Fee</span>
                  <span className="ct-fee-value ct-fee-muted">
                    {platformFee > 0 ? `₹${platformFee}` : "—"}
                  </span>
                </div>

                <div className="ct-fee-row">
                  <span className="ct-fee-label">Delivery Fee</span>
                  {deliveryFee === 0
                    ? <span className="ct-fee-free">Free</span>
                    : <span className="ct-fee-value">₹{deliveryFee}</span>
                  }
                </div>

                <div className="ct-fee-row">
                  <span className="ct-fee-label">Operator Fee</span>
                  <span className="ct-fee-value ct-fee-muted">
                    {operatorFee > 0 ? `₹${operatorFee}` : "—"}
                  </span>
                </div>

              </div>

              {/* Divider */}
              <div className="ct-summary-divider" />

              {/* Total row */}
              <div className="ct-total-row">
                <span className="ct-total-label">Total</span>
                <span className="ct-total-amount">₹{totalPrice}</span>
              </div>

              {totalSavings > 0 && (
                <div className="ct-saved-pill">
                  🎉 You saved ₹{totalSavings}
                </div>
              )}

              {/* Checkout button */}
              <button
  className="ct-checkout-btn"
  onClick={() => {
    createCheckout(
      { type: "THROUGHCART" },
      {
        onSuccess: (data) => {
          navigate(`/buy-now/${data.sessionId}`);
        },
      }
    );
  }}
  disabled={isPending}
>
  {isPending ? "Processing..." : "Proceed to Checkout →"}
</button>

              {/* Trust note */}
              <p className="ct-trust-note">🔒 Secure & encrypted checkout</p>
            </motion.div>
          </div>

        </div>
      )}

      <div style={{ height: 32 }} />
    </div>
  );
};

export default Cart;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes ct-spin { to { transform: rotate(360deg); } }

 .ct-root {
  min-height: 100vh;
  background: #F0F4FF;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  overflow-y: auto;
  height: 100vh;
}

  /* ── NAV ── */
  .ct-nav {
    position: sticky; top: 0; z-index: 40;
    background: rgba(240,244,255,0.94);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #DDE3F5;
    height: 58px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
  }
  .ct-back-btn {
    display: flex; align-items: center; gap: 6px;
    background: #fff; border: 1px solid #DDE3F5; border-radius: 10px;
    padding: 7px 14px; font-size: 13px; font-weight: 600; color: #4B5563;
    cursor: pointer; font-family: inherit; transition: all 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .ct-back-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .ct-nav-center { display: flex; align-items: center; gap: 7px; color: #374151; }
  .ct-nav-label { font-size: 14px; font-weight: 700; color: #111827; letter-spacing: 0.2px; }
  .ct-nav-count {
    background: #EF4444; color: #fff; font-size: 10px; font-weight: 800;
    border-radius: 20px; padding: 2px 7px; min-width: 20px; text-align: center;
  }
  .ct-clear-btn {
    font-size: 12px; font-weight: 600; color: #EF4444;
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 6px 12px; cursor: pointer;
    font-family: inherit; transition: all 0.15s;
  }
  .ct-clear-btn:hover { background: #FEE2E2; }

  /* ── EMPTY ── */
  .ct-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 32px; text-align: center;
  }
  .ct-empty-icon {
    width: 88px; height: 88px; border-radius: 24px;
    background: #fff; border: 1px solid #DDE3F5;
    display: flex; align-items: center; justify-content: center;
    color: #9CA3AF; margin-bottom: 20px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  }
  .ct-empty-title { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 8px; }
  .ct-empty-sub { font-size: 14px; color: #9CA3AF; margin-bottom: 24px; }
  .ct-empty-btn {
    padding: 12px 28px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #2563EB, #6366F1);
    color: #fff; font-size: 14px; font-weight: 700;
    font-family: inherit; cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,0.3); transition: opacity 0.15s;
  }
  .ct-empty-btn:hover { opacity: 0.9; }

  /* ── TWO-COLUMN LAYOUT ── */
 .ct-two-col {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 20px 40px;
  max-width: 1100px;
  margin: 0 auto;
  /* NO overflow, NO height constraint here */
}

  /* LEFT COLUMN */
 .ct-col-left {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

  /* RIGHT COLUMN */
.ct-col-right {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 78px;
  align-self: flex-start;
  max-height: calc(100vh - 94px);
  overflow-y: auto;
}
  /* ── SECTION HEADERS ── */
  .ct-section-header {
    display: flex; align-items: center; justify-content: space-between;
  }
  .ct-section-title {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 800; color: #374151;
    text-transform: uppercase; letter-spacing: 0.8px;
  }
  .ct-section-badge {
    font-size: 11px; font-weight: 700; color: #2563EB;
    background: #EFF6FF; border: 1px solid #BFDBFE;
    border-radius: 20px; padding: 3px 10px;
  }

  /* ── SAVINGS STRIP ── */
  .ct-savings-strip {
    display: flex; align-items: center; gap: 8px;
    background: #F0FDF4; border: 1px solid #BBF7D0;
    border-radius: 12px; padding: 10px 14px;
    font-size: 13px; color: #15803D; font-weight: 500;
  }
  .ct-savings-icon { font-size: 15px; }

  /* ── ITEM LIST ── */
  .ct-list { display: flex; flex-direction: column; gap: 12px; }

  /* ── ITEM CARD ── */
  .ct-item-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #DDE3F5;
    padding: 18px;
    box-shadow: 0 2px 12px rgba(59,130,246,0.05);
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Card header */
  .ct-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 14px;
    border-bottom: 1px solid #F3F4F6;
    margin-bottom: 14px;
  }
  .ct-card-header-left { display: flex; align-items: center; gap: 10px; }
  .ct-card-header-right { display: flex; align-items: center; gap: 8px; }

  .ct-item-avatar {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    border: 1px solid #BFDBFE;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; overflow: hidden;
  }
  .ct-item-operator { font-size: 14px; font-weight: 700; color: #111827; }
  .ct-item-type { font-size: 12px; font-weight: 500; color: #9CA3AF; margin-top: 2px; }

  .ct-disc-badge {
    background: #DCFCE7; color: #14532D; border: 1px solid #BBF7D0;
    font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 20px;
  }
  .ct-remove-btn {
    width: 30px; height: 30px; border-radius: 8px;
    border: 1px solid #FECACA; background: #FEF2F2; color: #EF4444;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.14s;
  }
  .ct-remove-btn:hover { background: #FEE2E2; }

  /* Card body */
  .ct-card-body { margin-bottom: 14px; }
  .ct-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .ct-chip {
    display: inline-flex; align-items: center; gap: 4px;
    background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB;
    font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
  }
  .ct-chip-net { background: #EDE9FE; color: #5B21B6; border-color: #DDD6FE; }
  .ct-item-desc { font-size: 12.5px; color: #6B7280; line-height: 1.6; }

  /* Card footer */
  .ct-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid #F3F4F6;
  }
  .ct-price-block { display: flex; flex-direction: column; gap: 3px; }
  .ct-price-row { display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
  .ct-unit-price-big {
    font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800;
    color: #2563EB; letter-spacing: -0.8px;
  }
  .ct-per-plan { font-size: 12px; color: #9CA3AF; font-weight: 500; }
  .ct-was-price { font-size: 12px; color: #D1D5DB; text-decoration: line-through; font-weight: 500; }
  .ct-line-total-row { font-size: 12px; color: #6B7280; font-weight: 600; }

  .ct-footer-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
    flex-shrink: 0;
  }
  .ct-stepper {
    display: flex; align-items: center;
    background: #F3F4F6; border-radius: 12px; border: 1px solid #E5E7EB;
    overflow: hidden;
  }
  .ct-step-btn {
    width: 34px; height: 36px; background: transparent; border: none;
    cursor: pointer; color: #374151;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s; font-family: inherit;
  }
  .ct-step-btn:hover:not(:disabled) { background: #E5E7EB; }
  .ct-step-btn:disabled { opacity: 0.35; cursor: default; }
  .ct-step-num {
    min-width: 28px; text-align: center;
    font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #111827;
  }
  .ct-view-link {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 700; color: #6366F1;
    background: none; border: none; cursor: pointer;
    font-family: inherit; padding: 0; transition: color 0.14s;
  }
  .ct-view-link:hover { color: #4F46E5; }

  /* ── RIGHT COLUMN: SUMMARY CARD ── */
  .ct-summary-card {
    background: #fff;
    border: 1px solid #DDE3F5;
    border-radius: 20px;
    padding: 22px;
    box-shadow: 0 2px 16px rgba(59,130,246,0.07);
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .ct-fee-rows { display: flex; flex-direction: column; }
  .ct-fee-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #F3F4F6;
    font-size: 13.5px; color: #374151; font-weight: 500;
  }
  .ct-fee-row:last-child { border-bottom: none; }
  .ct-fee-label { color: #6B7280; font-size: 13px; }
  .ct-fee-sub { font-size: 11px; color: #9CA3AF; font-weight: 400; }
  .ct-fee-value { font-weight: 600; color: #111827; }
  .ct-fee-muted { color: #9CA3AF; font-weight: 500; }
  .ct-fee-discount { }
  .ct-fee-discount .ct-fee-label { color: #16A34A; font-weight: 600; }
  .ct-fee-discount .ct-fee-value { color: #16A34A; }
  .ct-fee-free { color: #16A34A; font-weight: 700; font-size: 13px; }

  .ct-summary-divider { height: 1px; background: #E5E7EB; margin: 14px 0; }

  .ct-total-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }
  .ct-total-label { font-size: 14px; font-weight: 800; color: #111827; }
  .ct-total-amount {
    font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800;
    color: #2563EB; letter-spacing: -1px;
  }

  .ct-saved-pill {
    display: inline-block;
    background: #F0FDF4; border: 1px solid #BBF7D0;
    border-radius: 20px; padding: 5px 12px;
    font-size: 12px; font-weight: 700; color: #15803D;
    text-align: center; margin-bottom: 14px;
  }

  .ct-checkout-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #2563EB, #6366F1);
    border: none; border-radius: 14px;
    color: #fff; font-size: 14px; font-weight: 700;
    font-family: inherit; cursor: pointer;
    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
    transition: opacity 0.15s, transform 0.12s;
    margin-bottom: 12px;
  }
  .ct-checkout-btn:hover { opacity: 0.92; }
  .ct-checkout-btn:active { transform: scale(0.98); }

  .ct-trust-note {
    text-align: center; font-size: 11px; color: #9CA3AF; font-weight: 500;
  }

  /* ── RESPONSIVE: stack on mobile ── */
@media (max-width: 768px) {
  .ct-two-col {
    flex-direction: column;
    padding: 14px 12px 40px;
    gap: 16px;
  }
  .ct-col-right {
    width: 100%;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  .ct-unit-price-big { font-size: 18px; }
  .ct-total-amount { font-size: 22px; }
}
`;