import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useCreateOrder } from "../hooks/useOrders";
import { useFancyNumberById } from "../hooks/useFancyNumbers";
import { useAddress, useDeleteAddress } from "../hooks/useAddressHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../hooks/useUser";
import { apiClient } from "../constant/apiclient";
import AddressModal from "../profile/modals/AddressModal";
import { FiEdit, FiTrash2, FiMapPin, FiPlusCircle } from "react-icons/fi";
import { ArrowLeft, Package, Star } from "lucide-react";
import toast from "react-hot-toast";

const BookNow: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutate: createOrder, isLoading: creatingOrder } = useCreateOrder() as any;

  const { data: item, isLoading: loading } = useFancyNumberById(id!);
  const { data: user } = useUser();
  const { data: addresses } = useAddress();
  const deleteAddressMutation = useDeleteAddress();
  const queryClient = useQueryClient();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    if (addresses?.length > 0) {
      const sel = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(sel._id);
    }
  }, [addresses]);

  const formatNumber = (num: string) =>
    num?.replace(/(\d{5})(\d{5})/, "$1 $2");

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLoadingAddress(true);
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoRes.json();
          const address = geoData.address || {};
          const houseNo = "Current Location";
          const street = address.road || address.suburb || address.neighbourhood || "";
          const city = address.city || address.town || address.village || "Gurugram";
          const state = address.state || "Haryana";
          const pincode = address.postcode || "000000";

          const current = addresses?.find((a: any) => a.houseNo === "Current Location");
          let res;
          if (current) {
            res = await apiClient.put(`/address/${current._id}`, { houseNo, street, city, state, pincode, latitude, longitude });
          } else {
            res = await apiClient.post("/address", { houseNo, street, city, state, pincode, latitude, longitude });
          }
          const newAddr = res.data?.data || res.data;
          queryClient.invalidateQueries({ queryKey: ["address"] });
          setSelectedAddressId(newAddr._id);
          toast.success("Location fetched 📍");
        } catch {
          toast.error("Failed to fetch address");
        } finally {
          setLoadingAddress(false);
        }
      },
      () => toast.error("Location permission denied")
    );
  };

  const handleSubmit = () => {
    if (!user) return toast.error("Please login first");
    if (!selectedAddressId) return toast.error("Select a delivery address");

    createOrder(
      {
        fancyNumberId: id as string,
        addressId: selectedAddressId,
        paymentMethod: "COD",
        orderType: "FANCY_NUMBER",
      },
      {
        onSuccess: () => {
          toast.success("Booking Confirmed 🎉");
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          navigate("/profile?tab=orders");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Order failed");
        },
      }
    );
  };

  if (loading) return (
    <div className="bn-loading">
      <style>{styles}</style>
      <div className="bn-spinner" />
    </div>
  );

  if (!item) return (
    <div className="bn-loading">
      <style>{styles}</style>
      <p style={{ color: "#B45309", fontWeight: 700 }}>No fancy number found</p>
    </div>
  );

  const price = item.salePrice ?? item.price;
  const hasSaving = item.salePrice && item.price && item.salePrice < item.price;
  const savePct = hasSaving
    ? Math.round(((item.price - item.salePrice) / item.price) * 100)
    : 0;
  const selectedAddr = addresses?.find((a: any) => a._id === selectedAddressId);

  return (
    <div className="bn-root">
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className="bn-nav">
        <button className="bn-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="bn-nav-center">
          <span className="bn-nav-dot">⭐</span>
          <span className="bn-nav-title">Book Fancy Number</span>
        </div>
        <div style={{ width: 90 }} />
      </nav>

      {/* ── FANCY HERO BANNER ── */}
      <div className="bn-fancy-hero">
        <div className="bn-fancy-hero-left">
          <div className="bn-fancy-hero-icon">⭐</div>
          <div>
            <div className="bn-fancy-hero-title">VIP Number Booking</div>
            <div className="bn-fancy-hero-sub">
              Premium number · Doorstep SIM delivery · Lifetime ownership
            </div>
          </div>
        </div>
        <div className="bn-fancy-hero-steps">
          {["Pick Number", "Add Address", "Confirm", "Delivered"].map((s, i) => (
            <div key={s} className="bn-fancy-hero-step">
              <div className="bn-fancy-hero-step-num">{i + 1}</div>
              <div className="bn-fancy-hero-step-lbl">{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="bn-layout">
        <div className="bn-left">

          {/* NUMBER SHOWCASE CARD */}
          <motion.div
            className="bn-number-showcase"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bn-showcase-bg-circle" />
            <div className="bn-showcase-bg-circle2" />

            <div className="bn-showcase-top">
              <span className="bn-vip-badge">
                👑 {item.vipCategoryId?.name || "Premium VIP"}
              </span>
              <div className="bn-showcase-op">
                {item.operatorId?.logo
                  ? <img src={item.operatorId.logo} alt="" className="bn-showcase-op-logo" />
                  : <span style={{ fontSize: 20 }}>📶</span>}
                <span className="bn-showcase-op-name">{item.operatorId?.name || "Operator"}</span>
              </div>
            </div>

            <div className="bn-number-display">
              {formatNumber(item.number)}
            </div>

            <div className="bn-showcase-price-row">
              <div className="bn-showcase-price-left">
                <div className="bn-you-pay-label">You Pay</div>
                <div className="bn-showcase-price">₹{price.toLocaleString("en-IN")}</div>
                {hasSaving && (
                  <div className="bn-showcase-was">
                    <span className="bn-showcase-strike">₹{item.price.toLocaleString("en-IN")}</span>
                    <span className="bn-showcase-save-pill">Save {savePct}%</span>
                  </div>
                )}
              </div>
              <div className="bn-showcase-feats">
                {["Lifetime validity", "Instant activation", "Free delivery"].map((f) => (
                  <div key={f} className="bn-feat-chip">
                    <span className="bn-feat-check">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* STEP 1 — ADDRESS */}
          <motion.div
            className="bn-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="bn-card-step">Step 1</div>
            <h2 className="bn-card-title">
              {user ? `Hey ${(user as any).fullName} 👋` : "Delivery Address"}
            </h2>
            <p className="bn-card-sub">Select or add a delivery address for your SIM</p>

            <div className="bn-addr-grid">
              {addresses?.map((addr: any) => (
                <div
                  key={addr._id}
                  className={`bn-addr-item${selectedAddressId === addr._id ? " bn-addr-selected" : ""}`}
                  onClick={() => setSelectedAddressId(addr._id)}
                >
                  <div className="bn-addr-top">
                    <p className="bn-addr-line">{addr.houseNo}, {addr.street}</p>
                    {addr.isDefault && <span className="bn-default-badge">Default</span>}
                  </div>
                  <p className="bn-addr-city">{addr.city}, {addr.state} — {addr.pincode}</p>
                  <div className="bn-addr-actions">
                    <button
                      className="bn-addr-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(addr);
                        setShowAddressModal(true);
                      }}
                    >
                      <FiEdit size={11} /> Edit
                    </button>
                    <button
                      className="bn-addr-del"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddressMutation.mutate(addr._id, {
                          onSuccess: () =>
                            queryClient.invalidateQueries({ queryKey: ["address"] }),
                        });
                      }}
                    >
                      <FiTrash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bn-addr-btns">
              <button
                className="bn-add-addr-btn"
                onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
              >
                <FiPlusCircle size={14} /> Add Address
              </button>
              <button
                className="bn-loc-btn"
                onClick={handleUseLocation}
                disabled={loadingAddress}
                style={{ opacity: loadingAddress ? 0.6 : 1 }}
              >
                <FiMapPin size={14} />
                {loadingAddress ? "Fetching..." : "Use My Location"}
              </button>
            </div>
          </motion.div>

          {/* STEP 2 — PAYMENT */}
          <motion.div
            className="bn-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="bn-card-step">Step 2</div>
            <h2 className="bn-card-title">Payment Method</h2>
            <p className="bn-card-sub">How would you like to pay?</p>
            <div className="bn-pay-grid">
              {["UPI", "Card", "Net Banking", "COD"].map((method) => {
                const isCOD = method === "COD";
                return (
                  <div
                    key={method}
                    className={`bn-pay-item${isCOD ? " bn-pay-selected" : " bn-pay-disabled"}`}
                  >
                    {method}
                    {!isCOD && <span className="bn-coming-soon">Soon</span>}
                  </div>
                );
              })}
            </div>
            <p className="bn-pay-note">Only Cash on Delivery is available right now.</p>
          </motion.div>
        </div>

        {/* ── RIGHT SUMMARY ── */}
        <div className="bn-right">
          <motion.div
            className="bn-summary-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {/* Summary header */}
            <div className="bn-summary-header">
              <Package size={15} />
              <span>Order Summary</span>
              <span className="bn-fancy-badge">⭐ VIP</span>
            </div>

            {/* Number preview */}
            <div className="bn-summary-number-card">
              <div className="bn-summary-number-top">
                <div className="bn-summary-op-row">
                  {item.operatorId?.logo
                    ? <img src={item.operatorId.logo} alt="" className="bn-op-logo" />
                    : <div className="bn-op-avatar">📶</div>}
                  <div>
                    <div className="bn-op-name">{item.operatorId?.name || "Operator"}</div>
                    <div className="bn-op-sub">Fancy Number · VIP</div>
                  </div>
                </div>
                <div className="bn-summary-number-display">
                  {formatNumber(item.number)}
                </div>
              </div>
              {item.vipCategoryId?.name && (
                <div className="bn-summary-category">
                  👑 {item.vipCategoryId.name}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="bn-price-section">
              <div className="bn-price-row">
                <span>MRP</span>
                <span>₹{(item.price || price).toLocaleString("en-IN")}</span>
              </div>
              {hasSaving && (
                <div className="bn-price-row bn-price-savings">
                  <span>Discount ({savePct}% off)</span>
                  <span>−₹{(item.price - item.salePrice).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="bn-price-row">
                <span>Delivery</span>
                <span className="bn-free-tag">FREE</span>
              </div>
              <div className="bn-price-divider" />
              <div className="bn-price-total-row">
                <span>Total</span>
                <span>₹{price.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bn-info-section">
              <div className="bn-info-row">
                <span className="bn-info-key">Deliver to</span>
                <span className="bn-info-val">
                  {selectedAddr ? `${selectedAddr.houseNo}, ${selectedAddr.street}` : "—"}
                </span>
              </div>
              <div className="bn-info-row">
                <span className="bn-info-key">Payment</span>
                <span className="bn-info-val">Cash on Delivery</span>
              </div>
              <div className="bn-info-row">
                <span className="bn-info-key">Delivery</span>
                <span className="bn-info-val">2–3 business days</span>
              </div>
              <div className="bn-info-row">
                <span className="bn-info-key">Order Type</span>
                <span className="bn-info-val" style={{ color: "#B45309" }}>Fancy Number</span>
              </div>
            </div>

            {/* Readiness checklist */}
            <div className="bn-readiness">
              <div className="bn-ready-row">
                <span className={`bn-ready-dot${selectedAddressId ? " ok" : ""}`} />
                <span className={`bn-ready-txt${selectedAddressId ? " ok" : ""}`}>Delivery address</span>
              </div>
              <div className="bn-ready-row">
                <span className="bn-ready-dot ok" />
                <span className="bn-ready-txt ok">Number selected ✓</span>
              </div>
              <div className="bn-ready-row">
                <span className="bn-ready-dot ok" />
                <span className="bn-ready-txt ok">Payment — COD</span>
              </div>
            </div>

            {/* CTA */}
            <button
              className="bn-pay-btn"
              onClick={handleSubmit}
              disabled={!selectedAddressId || creatingOrder}
              style={{
                background: !selectedAddressId || creatingOrder
                  ? "linear-gradient(135deg, #FCD34D, #FBBF24)"
                  : "linear-gradient(135deg, #B45309, #F59E0B)",
                opacity: !selectedAddressId || creatingOrder ? 0.7 : 1,
                cursor: !selectedAddressId || creatingOrder ? "not-allowed" : "pointer",
              }}
            >
              {creatingOrder
                ? "Confirming Booking..."
                : `Confirm Booking — ₹${price.toLocaleString("en-IN")} →`}
            </button>
            <button className="bn-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>

            {/* Trust strip */}
            <div className="bn-trust-strip">
              {[
                { icon: "🔒", label: "Secure" },
                { icon: "✅", label: "100% Safe" },
                { icon: "🚚", label: "Free Delivery" },
              ].map((t) => (
                <div key={t.label} className="bn-trust-item">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {showAddressModal && (
        <AddressModal
          close={() => { setShowAddressModal(false); setEditingAddress(null); }}
          editingAddress={editingAddress}
        />
      )}
    </div>
  );
};

export default BookNow;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bn-root { min-height: 100vh; background: #F0F4FF; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  .bn-loading { min-height: 100vh; background: #F0F4FF; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; }
  .bn-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid #FDE68A; border-top-color: #B45309; animation: bn-spin 0.75s linear infinite; }
  @keyframes bn-spin { to { transform: rotate(360deg); } }

  /* NAV */
  .bn-nav { position: sticky; top: 0; z-index: 40; background: rgba(240,244,255,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid #DDE3F5; height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .bn-back-btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #DDE3F5; border-radius: 10px; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #4B5563; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .bn-back-btn:hover { border-color: #B45309; color: #B45309; background: #FFFBEB; }
  .bn-nav-center { display: flex; align-items: center; gap: 8px; }
  .bn-nav-dot { font-size: 18px; }
  .bn-nav-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #111827; letter-spacing: -0.3px; }

  /* FANCY HERO BANNER */
  .bn-fancy-hero { background: linear-gradient(135deg, #78350F 0%, #B45309 55%, #F59E0B 100%); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .bn-fancy-hero-left { display: flex; align-items: center; gap: 14px; }
  .bn-fancy-hero-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .bn-fancy-hero-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .bn-fancy-hero-sub { font-size: 12px; color: rgba(255,255,255,0.8); }
  .bn-fancy-hero-steps { display: flex; align-items: center; gap: 6px; }
  .bn-fancy-hero-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bn-fancy-hero-step-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); color: #fff; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .bn-fancy-hero-step-lbl { font-size: 10px; color: rgba(255,255,255,0.75); font-weight: 600; white-space: nowrap; }

  /* LAYOUT */
  .bn-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; padding: 20px 24px; max-width: 1100px; margin: 0 auto; }
  .bn-left { display: flex; flex-direction: column; gap: 16px; }

  /* NUMBER SHOWCASE */
  .bn-number-showcase { background: linear-gradient(135deg, #78350F 0%, #92400E 40%, #B45309 100%); border-radius: 22px; padding: 28px; position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(180,83,9,0.3); }
  .bn-showcase-bg-circle { position: absolute; top: -40px; right: 60px; width: 160px; height: 160px; border-radius: 50%; background: rgba(255,255,255,0.06); }
  .bn-showcase-bg-circle2 { position: absolute; bottom: -50px; right: -20px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.04); }

  .bn-showcase-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; position: relative; z-index: 1; }
  .bn-vip-badge { background: rgba(255,255,255,0.15); color: #FEF3C7; border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; padding: 5px 14px; font-size: 12px; font-weight: 700; backdrop-filter: blur(4px); }
  .bn-showcase-op { display: flex; align-items: center; gap: 8px; }
  .bn-showcase-op-logo { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); object-fit: contain; background: rgba(255,255,255,0.1); }
  .bn-showcase-op-name { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); }

  .bn-number-display { font-family: 'Sora', sans-serif; font-size: clamp(32px, 5vw, 48px); font-weight: 800; color: #fff; letter-spacing: 3px; margin-bottom: 24px; position: relative; z-index: 1; text-shadow: 0 2px 12px rgba(0,0,0,0.2); }

  .bn-showcase-price-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; position: relative; z-index: 1; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.15); }
  .bn-showcase-price-left {}
  .bn-you-pay-label { font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px; }
  .bn-showcase-price { font-family: 'Sora', sans-serif; font-size: 38px; font-weight: 800; color: #fff; letter-spacing: -1.5px; line-height: 1; }
  .bn-showcase-was { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
  .bn-showcase-strike { font-size: 14px; color: rgba(255,255,255,0.5); text-decoration: line-through; }
  .bn-showcase-save-pill { background: rgba(255,255,255,0.15); color: #FEF3C7; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.25); }
  .bn-showcase-feats { display: flex; flex-direction: column; gap: 8px; }
  .bn-feat-chip { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); }
  .bn-feat-check { width: 18px; height: 18px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #FEF3C7; font-weight: 900; flex-shrink: 0; }

  /* CARDS */
  .bn-card { background: #fff; border-radius: 22px; border: 1px solid #DDE3F5; padding: 22px; box-shadow: 0 2px 14px rgba(59,130,246,0.06); }
  .bn-card-step { font-size: 10px; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
  .bn-card-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 4px; }
  .bn-card-sub { font-size: 13px; color: #9CA3AF; margin-bottom: 18px; }

  /* ADDRESS */
  .bn-addr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .bn-addr-item { padding: 14px; border-radius: 14px; border: 2px solid #DDE3F5; cursor: pointer; transition: all 0.15s; }
  .bn-addr-item:hover { border-color: #FDE68A; background: #FFFBEB; }
  .bn-addr-selected { border-color: #B45309 !important; background: #FFFBEB !important; }
  .bn-addr-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; margin-bottom: 4px; }
  .bn-addr-line { font-size: 13px; font-weight: 700; color: #111827; }
  .bn-default-badge { background: #FFFBEB; color: #B45309; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid #FDE68A; white-space: nowrap; flex-shrink: 0; }
  .bn-addr-city { font-size: 12px; color: #6B7280; margin-bottom: 10px; }
  .bn-addr-actions { display: flex; gap: 6px; }
  .bn-addr-edit { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #3B82F6; background: #EFF6FF; border: none; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-family: inherit; transition: background 0.13s; }
  .bn-addr-edit:hover { background: #DBEAFE; }
  .bn-addr-del { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #EF4444; background: #FEF2F2; border: none; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-family: inherit; transition: background 0.13s; }
  .bn-addr-del:hover { background: #FEE2E2; }
  .bn-addr-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .bn-add-addr-btn { display: flex; align-items: center; justify-content: center; gap: 7px; border: 2px dashed #FDE68A; background: transparent; color: #B45309; font-size: 13px; font-weight: 600; padding: 12px; border-radius: 14px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
  .bn-add-addr-btn:hover { background: #FFFBEB; }
  .bn-loc-btn { display: flex; align-items: center; justify-content: center; gap: 7px; background: #F5F3FF; border: 1px solid #DDD6FE; color: #6D28D9; font-size: 13px; font-weight: 600; padding: 12px; border-radius: 14px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
  .bn-loc-btn:hover { background: #EDE9FE; }

  /* PAYMENT */
  .bn-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .bn-pay-item { padding: 13px; text-align: center; border-radius: 12px; border: 2px solid #DDE3F5; font-size: 13px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.15s; position: relative; }
  .bn-pay-selected { border-color: #B45309 !important; background: #FFFBEB !important; color: #B45309 !important; }
  .bn-pay-disabled { opacity: 0.45; cursor: not-allowed; }
  .bn-coming-soon { display: block; font-size: 10px; font-weight: 700; color: #9CA3AF; margin-top: 2px; }
  .bn-pay-note { font-size: 12px; color: #9CA3AF; }

  /* RIGHT SUMMARY */
  .bn-right { position: sticky; top: 78px; height: fit-content; }
  .bn-summary-card { background: #fff; border-radius: 22px; border: 1px solid #DDE3F5; padding: 22px; box-shadow: 0 2px 14px rgba(59,130,246,0.06); }
  .bn-summary-header { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .bn-fancy-badge { background: #FFFBEB; color: #B45309; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid #FDE68A; margin-left: auto; }

  /* Number preview in summary */
  .bn-summary-number-card { background: linear-gradient(135deg, #78350F, #B45309); border-radius: 16px; padding: 18px; margin-bottom: 16px; position: relative; overflow: hidden; }
  .bn-summary-number-top { margin-bottom: 12px; }
  .bn-summary-op-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .bn-op-logo { width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); object-fit: contain; }
  .bn-op-avatar { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .bn-op-name { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); }
  .bn-op-sub { font-size: 10px; color: rgba(255,255,255,0.6); font-weight: 600; margin-top: 1px; }
  .bn-summary-number-display { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 2px; }
  .bn-summary-category { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.15); color: #FEF3C7; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); }

  /* Price section */
  .bn-price-section { margin-bottom: 4px; }
  .bn-price-row { display: flex; justify-content: space-between; font-size: 13.5px; color: #374151; font-weight: 500; padding: 5px 0; }
  .bn-price-savings { color: #16A34A; font-weight: 700; }
  .bn-free-tag { color: #16A34A; font-weight: 700; font-size: 13px; }
  .bn-price-divider { height: 1px; background: #F3F4F6; margin: 10px 0; }
  .bn-price-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #111827; }

  /* Info section */
  .bn-info-section { margin-top: 14px; padding-top: 14px; border-top: 1px solid #F3F4F6; display: flex; flex-direction: column; gap: 8px; }
  .bn-info-row { display: flex; justify-content: space-between; font-size: 12px; }
  .bn-info-key { color: #9CA3AF; }
  .bn-info-val { color: #B45309; font-weight: 600; max-width: 55%; text-align: right; }

  /* Readiness */
  .bn-readiness { margin-top: 14px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
  .bn-ready-row { display: flex; align-items: center; gap: 8px; }
  .bn-ready-dot { width: 8px; height: 8px; border-radius: 50%; background: #E5E7EB; border: 2px solid #D1D5DB; transition: all 0.2s; flex-shrink: 0; }
  .bn-ready-dot.ok { background: #10B981; border-color: #10B981; box-shadow: 0 0 0 3px #D1FAE5; }
  .bn-ready-txt { font-size: 12px; color: #9CA3AF; font-weight: 500; transition: color 0.2s; }
  .bn-ready-txt.ok { color: #059669; font-weight: 700; }

  /* Buttons */
  .bn-pay-btn { width: 100%; margin-top: 18px; padding: 14px; border: none; border-radius: 14px; color: #fff; font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 4px 20px rgba(180,83,9,0.35); transition: opacity 0.15s, transform 0.12s; }
  .bn-pay-btn:hover { opacity: 0.92; }
  .bn-pay-btn:active { transform: scale(0.97); }
  .bn-cancel-btn { width: 100%; margin-top: 8px; padding: 10px; background: none; border: none; color: #9CA3AF; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: color 0.15s; }
  .bn-cancel-btn:hover { color: #4B5563; }

  /* Trust strip */
  .bn-trust-strip { display: flex; justify-content: space-around; margin-top: 16px; padding-top: 14px; border-top: 1px solid #F3F4F6; }
  .bn-trust-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 11px; color: #9CA3AF; font-weight: 600; }
  .bn-trust-item span:first-child { font-size: 18px; }

  @media (max-width: 860px) {
    .bn-layout { grid-template-columns: 1fr; padding: 14px 12px; gap: 14px; }
    .bn-right { position: static; }
    .bn-addr-grid { grid-template-columns: 1fr; }
    .bn-fancy-hero { padding: 16px; }
    .bn-fancy-hero-steps { display: none; }
    .bn-showcase-price-row { flex-direction: column; gap: 14px; }
    .bn-showcase-feats { flex-direction: row; flex-wrap: wrap; gap: 8px; }
    .bn-number-display { font-size: 28px; letter-spacing: 2px; }
  }
`;