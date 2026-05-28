import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";
import { useCreateOrder } from "../hooks/useOrders";
import { useAddress, useDeleteAddress } from "../hooks/useAddressHooks";
import { useQueryClient } from "@tanstack/react-query";
import AddressModal from "../profile/modals/AddressModal";
import { FiEdit, FiTrash2, FiMapPin, FiPlusCircle } from "react-icons/fi";
import { usePlanById } from "../hooks/usePlans";
import { apiClient } from "../constant/apiclient";
import { ShoppingCart, Package, ArrowLeft, Wifi, Clock, Phone, MessageSquare } from "lucide-react";
import { useCheckoutSession } from "../hooks/useCheckout";

interface CartItem {
  plan: any;
  quantity: number;
}

const BuyNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const orderTypeFromState = location.state?.orderType || "NORMAL";
  const isPortOrder = orderTypeFromState === "PORT";

 const isFromCart: boolean = location.state?.isFromCart === true;
  const cartItems: CartItem[] = location.state?.cartItems || [];
  const cartSubtotal: number = location.state?.subtotal || 0;

 const { data: checkoutData, isLoading: isLoadingSession } = useCheckoutSession(sessionId);
  const item = checkoutData?.processedItems?.[0];
  const { data: singlePlan } = usePlanById(item?.planId);




// ✅ Derive isEsimOrder from plan data (most reliable) OR from nav state
const isEsimOrder =
  orderTypeFromState === "ESIM" ||
  singlePlan?.simTypes?.includes("esim") === true;


  const { data: user, isLoading: userLoading } = useUser();
  const { data: addresses } = useAddress();
  const deleteAddressMutation = useDeleteAddress();
  const queryClient = useQueryClient();
  const createOrderMutation = useCreateOrder();

  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<any>(null);
  const [existingNumber, setExistingNumber] = useState("");
  const [previousOperator, setPreviousOperator] = useState("");

  useEffect(() => {
    if (addresses?.length > 0) {
      const sel = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(sel._id);
    }
  }, [addresses]);

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
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
        }
      },
      () => toast.error("Location permission denied")
    );
  };

  const handleBuy = () => {
    if (!user) return toast.error("Please login first");
    if (!selectedAddressId) return toast.error("Select an address");
    if (selectedPayment !== "COD") return toast.error("Only COD available");
    if (isPortOrder && !existingNumber.trim()) return toast.error("Enter your existing mobile number");
    if (isPortOrder && existingNumber.trim().length !== 10) return toast.error("Enter a valid 10-digit mobile number");
    if (isPortOrder && !previousOperator.trim()) return toast.error("Enter your current operator name");

    const orderPayload: any = {
      sessionId: sessionId!,
      addressId: selectedAddressId,
      paymentMethod: "COD",
      orderType: orderTypeFromState,
    };

    if (isPortOrder) {
      orderPayload.existingNumber = existingNumber.trim();
      orderPayload.previousOperator = previousOperator.trim();
    }

    if (isFromCart) {
      Promise.all([createOrderMutation.mutateAsync(orderPayload)])
        .then(() => {
          toast.success(`${cartItems.length} order${cartItems.length > 1 ? "s" : ""} placed 🚚`);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          navigate("/profile?tab=orders");
        })
        .catch(() => toast.error("Order failed ❌"));
    } else {
      createOrderMutation.mutate(orderPayload, {
        onSuccess: () => {
          toast.success("Order placed 🚚");
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          navigate("/profile?tab=orders");
        },
        onError: () => toast.error("Order failed ❌"),
      });
    }
  };

  const selectedAddr = addresses?.find((a: any) => a._id === selectedAddressId);
  const singleQty = item?.quantity || 1;
  const singleDiscount = checkoutData?.discount || 0;
  const singleFinalPrice = checkoutData?.totalAmount || 0;
  const subTotal = checkoutData?.subTotal || 0;
  const platformFee = checkoutData?.platformFee || 0;
  const operatorFee = checkoutData?.totalOperatorFee || 0;
  const deliveryFee = checkoutData?.deliveryPrice || 0;
  const cartOriginalTotal = cartItems.reduce((s, i) => s + i.plan.price * i.quantity, 0);
  const cartSavings = cartOriginalTotal - cartSubtotal;
  const totalCartQty = cartItems.reduce((s, i) => s + i.quantity, 0);

  const numberValid = existingNumber.length === 10;
  const numberPartial = existingNumber.length > 0 && existingNumber.length < 10;

  const OPERATORS = [
    { name: "Jio",    color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", emoji: "🔵" },
    { name: "Airtel", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", emoji: "🔴" },
    { name: "Vi",     color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", emoji: "🟣" },
    { name: "BSNL",   color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", emoji: "🟢" },
  ];

  if (userLoading) return (
    <div className="bn-loading">
      <style>{styles}</style>
      <div className="bn-spinner" />
    </div>
  );

  if (!isFromCart && !singlePlan) return (
    <div className="bn-loading">
      <style>{styles}</style>
      <p style={{ color: "#2563EB", fontWeight: 700 }}>No Plan Selected</p>
    </div>
  );

  return (
    <div className="bn-root">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="bn-nav">
        <button className="bn-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="bn-nav-center">
          {isPortOrder && <span className="bn-nav-port-dot">🔄</span>}
          {isEsimOrder && <span className="bn-nav-port-dot">📱</span>}
          <span className="bn-nav-title">
          {isPortOrder ? "Port Your Number" : isEsimOrder ? "Get eSIM" : isFromCart ? "Checkout" : "Buy Now"}
          </span>
        </div>
        <div style={{ width: 72 }} />
      </nav>

      {/* PORT hero banner */}
      {isPortOrder && (
        <div className="bn-port-hero">
          <div className="bn-port-hero-left">
            <div className="bn-port-hero-icon">🔄</div>
            <div>
              <div className="bn-port-hero-title">Number Porting Request</div>
              <div className="bn-port-hero-sub">Keep your number · Switch your operator · Doorstep SIM delivery</div>
            </div>
          </div>
          <div className="bn-port-hero-steps">
            {["Fill Details", "Get UPC", "Delivery", "Active"].map((s, i) => (
              <div key={s} className="bn-port-hero-step">
                <div className="bn-port-hero-step-num">{i + 1}</div>
                <div className="bn-port-hero-step-lbl">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

{/* ESIM hero banner */}
{isEsimOrder && (
  <div className="bn-port-hero" style={{ background: "linear-gradient(135deg, #0F172A 0%, #2563EB 55%, #6366F1 100%)" }}>
    <div className="bn-port-hero-left">
      <div className="bn-port-hero-icon">📱</div>
      <div>
        <div className="bn-port-hero-title">eSIM Activation</div>
        <div className="bn-port-hero-sub">No physical SIM · Instant digital activation · Works on any eSIM device</div>
      </div>
    </div>
    <div className="bn-port-hero-steps">
      {["Place Order", "Get QR Code", "Scan & Install", "Active"].map((s, i) => (
        <div key={s} className="bn-port-hero-step">
          <div className="bn-port-hero-step-num">{i + 1}</div>
          <div className="bn-port-hero-step-lbl">{s}</div>
        </div>
      ))}
    </div>
  </div>
)}
      <div className="bn-layout">
        <div className="bn-left">

          {/* STEP 1: ADDRESS */}
          <div className="bn-card">
            <div className="bn-card-step">Step 1</div>
            <h2 className="bn-card-title">{user ? `Hey ${user.fullName} 👋` : "Delivery Address"}</h2>
            <p className="bn-card-sub">Select or add a delivery address</p>
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
                    <button className="bn-addr-edit" onClick={(e) => { e.stopPropagation(); setEditingAddress(addr); setShowAddressModal(true); }}>
                      <FiEdit size={11} /> Edit
                    </button>
                    <button className="bn-addr-del" onClick={(e) => { e.stopPropagation(); deleteAddressMutation.mutate(addr._id, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["address"] }) }); }}>
                      <FiTrash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bn-addr-btns">
              <button className="bn-add-addr-btn" onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}>
                <FiPlusCircle size={14} /> Add Address
              </button>
              <button className="bn-loc-btn" onClick={handleUseLocation}>
                <FiMapPin size={14} /> Use My Location
              </button>
            </div>
          </div>

          {/* STEP 2: PORT DETAILS — improved UI */}
          {isPortOrder && (
            <div className="bn-card bn-port-card">
              {/* Card header with gradient accent */}
              <div className="bn-port-card-header">
                <div className="bn-port-card-header-icon">📱</div>
                <div>
                  <div className="bn-card-step" style={{ marginBottom: 2 }}>Step 2 — Port Details</div>
                  <h2 className="bn-card-title" style={{ marginBottom: 0 }}>Your Current Number</h2>
                </div>
              </div>
              <p className="bn-card-sub" style={{ marginTop: 14 }}>
                We need your existing number and operator to initiate porting
              </p>

              <div className="bn-port-fields">

                {/* Mobile number input */}
                <div className="bn-port-field-group">
                  <label className="bn-port-label">
                    <span className="bn-port-label-num">01</span>
                    Existing Mobile Number
                  </label>
                  <div className="bn-port-number-wrap">
                    <div className="bn-port-number-prefix">+91</div>
                    <input
                      className={`bn-port-number-input${numberValid ? " bn-port-input-ok" : numberPartial ? " bn-port-input-warn" : ""}`}
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter 10-digit number"
                      value={existingNumber}
                      onChange={(e) => setExistingNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                    />
                    {numberValid && <div className="bn-port-input-check">✓</div>}
                  </div>
                  {/* Progress bar */}
                  <div className="bn-port-progress-track">
                    <div
                      className={`bn-port-progress-fill${numberValid ? " bn-port-progress-ok" : ""}`}
                      style={{ width: `${(existingNumber.length / 10) * 100}%` }}
                    />
                  </div>
                  <div className="bn-port-number-meta">
                    {numberValid
                      ? <span className="bn-port-meta-ok">✓ Valid number — ready to port</span>
                      : numberPartial
                      ? <span className="bn-port-meta-warn">{10 - existingNumber.length} more digit{10 - existingNumber.length !== 1 ? "s" : ""} needed</span>
                      : <span className="bn-port-meta-neutral">This number will be ported to your new operator</span>
                    }
                    <span className="bn-port-meta-count">{existingNumber.length}/10</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="bn-port-divider">
                  <span className="bn-port-divider-label">Then choose your current operator</span>
                </div>

                {/* Operator quick-select */}
                <div className="bn-port-field-group">
                  <label className="bn-port-label">
                    <span className="bn-port-label-num">02</span>
                    Current Operator
                  </label>
                  <div className="bn-port-op-grid">
                    {OPERATORS.map((op) => {
                      const active = previousOperator === op.name;
                      return (
                        <button
                          key={op.name}
                          type="button"
                          onClick={() => setPreviousOperator(op.name)}
                          className="bn-port-op-card"
                          style={{
                            borderColor: active ? op.color : "#DDE3F5",
                            background: active ? op.bg : "#FAFBFF",
                            boxShadow: active ? `0 4px 16px ${op.color}25` : "none",
                            transform: active ? "scale(1.04)" : "scale(1)",
                          }}
                        >
                          <div className="bn-port-op-emoji">{op.emoji}</div>
                          <div className="bn-port-op-name" style={{ color: active ? op.color : "#374151" }}>
                            {op.name}
                          </div>
                          {active && (
                            <div className="bn-port-op-check" style={{ background: op.color }}>✓</div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* "Other" operator free-text */}
                  <div className="bn-port-other-wrap">
                    <span className="bn-port-other-label">Other operator?</span>
                    <input
                      className="bn-port-other-input"
                      type="text"
                      placeholder="Type operator name..."
                      value={OPERATORS.find(o => o.name === previousOperator) ? "" : previousOperator}
                      onChange={(e) => setPreviousOperator(e.target.value)}
                      onFocus={() => {
                        if (OPERATORS.find(o => o.name === previousOperator)) setPreviousOperator("");
                      }}
                    />
                  </div>

                  {previousOperator && (
                    <div className="bn-port-selected-op">
                      <span>Current operator selected:</span>
                      <strong>{previousOperator}</strong>
                      <button onClick={() => setPreviousOperator("")} className="bn-port-op-clear">✕</button>
                    </div>
                  )}
                </div>

                {/* Info timeline */}
                <div className="bn-port-timeline">
                  <div className="bn-port-timeline-header">
                    <span>📋</span> What happens next?
                  </div>
                  <div className="bn-port-timeline-items">
                    {[
                      { icon: "📩", title: "UPC Code via SMS", desc: "You'll receive a Unique Porting Code on your existing number within minutes" },
                      { icon: "🚚", title: "SIM Delivered", desc: "New SIM card delivered to your door within 2–3 business days" },
                      { icon: "✅", title: "Number Goes Live", desc: "Your number ports to the new operator within 3–7 working days" },
                    ].map((step, i) => (
                      <div key={i} className="bn-port-timeline-item">
                        <div className="bn-port-timeline-icon">{step.icon}</div>
                        <div className="bn-port-timeline-line" />
                        <div className="bn-port-timeline-content">
                          <div className="bn-port-timeline-title">{step.title}</div>
                          <div className="bn-port-timeline-desc">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PAYMENT */}
          <div className="bn-card">
           <div className="bn-card-step">
  Step {isPortOrder ? "3" : isEsimOrder ? "2" : "2"}
</div>
            <h2 className="bn-card-title">Payment Method</h2>
            <p className="bn-card-sub">How would you like to pay?</p>
            <div className="bn-pay-grid">
              {["UPI", "Card", "Net Banking", "COD"].map((method) => {
                const isCOD = method === "COD";
                return (
                  <div
                    key={method}
                    className={`bn-pay-item${isCOD && selectedPayment === method ? " bn-pay-selected" : ""}${!isCOD ? " bn-pay-disabled" : ""}`}
                    onClick={() => isCOD && setSelectedPayment(method)}
                  >
                    {method}
                    {!isCOD && <span className="bn-coming-soon">Soon</span>}
                  </div>
                );
              })}
            </div>
            <p className="bn-pay-note">Only Cash on Delivery is available right now.</p>
          </div>

          {/* CART ITEMS */}
          {isFromCart && (
            <div className="bn-card">
              <div className="bn-card-step">Your Items</div>
              <h2 className="bn-card-title">
                <ShoppingCart size={16} style={{ display: "inline", marginRight: 6 }} />
                {totalCartQty} Item{totalCartQty !== 1 ? "s" : ""} in Order
              </h2>
              <div className="bn-cart-items">
                {cartItems.map((item, i) => {
                  const unitPrice = item.plan.salePrice || item.plan.price;
                  const lineTotal = unitPrice * item.quantity;
                  const disc = item.plan.salePrice && item.plan.price
                    ? Math.round(((item.plan.price - item.plan.salePrice) / item.plan.price) * 100) : null;
                  return (
                    <div key={item.plan._id + i} className="bn-ci-row">
                      <div className="bn-ci-avatar">📶</div>
                      <div className="bn-ci-info">
                        <div className="bn-ci-name">{item.plan.operatorId?.name || "Operator"} Plan</div>
                        <div className="bn-ci-chips">
                          {item.plan.data && <span className="bn-ci-chip bn-chip-blue"><Wifi size={10} /> {item.plan.data}</span>}
                          {item.plan.validity && <span className="bn-ci-chip bn-chip-purple"><Clock size={10} /> {item.plan.validity}d</span>}
                          {item.plan.calls && <span className="bn-ci-chip bn-chip-green"><Phone size={10} /> {item.plan.calls}</span>}
                          {item.plan.sms && <span className="bn-ci-chip bn-chip-yellow"><MessageSquare size={10} /> {item.plan.sms}</span>}
                          {disc && <span className="bn-ci-chip bn-chip-green">{disc}% OFF</span>}
                        </div>
                      </div>
                      <div className="bn-ci-right">
                        <div className="bn-ci-qty">× {item.quantity}</div>
                        <div className="bn-ci-price">₹{lineTotal.toLocaleString()}</div>
                        {item.plan.salePrice && <div className="bn-ci-was">₹{item.plan.price * item.quantity}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div className="bn-right">
          <div className="bn-summary-card">
            <div className="bn-summary-header">
              <Package size={15} />
              <span>Order Summary</span>
              {isPortOrder && <span className="bn-port-badge">🔄 PORT</span>}
              {isEsimOrder && <span className="bn-port-badge" style={{ background: "#EFF6FF", color: "#1D4ED8", borderColor: "#BFDBFE" }}>📱 eSIM</span>}
            </div>

            {!isFromCart && singlePlan && (
              <>
                <div className="bn-op-row">
                  {singlePlan.operatorId?.logo
                    ? <img src={singlePlan.operatorId.logo} alt="" className="bn-op-logo" />
                    : <div className="bn-op-avatar">{singlePlan.operatorId?.name?.[0] || "O"}</div>}
                  <div>
                    <span className="bn-op-name">{singlePlan.operatorId?.name}</span>
                    {isPortOrder && <div className="bn-op-port-sub">Porting to this operator</div>}
                    {isEsimOrder && <div className="bn-op-port-sub" style={{ color: "#2563EB" }}>eSIM — digital delivery</div>}
                  </div>
                </div>

                <div className="bn-spec-box">
                  {[
                    { label: "Data", val: singlePlan.data },
                    { label: "Validity", val: singlePlan.validity ? `${singlePlan.validity} Days` : null },
                    { label: "Calls", val: singlePlan.calls },
                    { label: "SMS", val: singlePlan.sms },
                    { label: "Network", val: singlePlan.networkType },
                    { label: "Qty", val: singleQty > 1 ? `× ${singleQty}` : null },
                    ...(isPortOrder ? [
                      { label: "Port From", val: previousOperator || "—" },
                      { label: "Number", val: existingNumber ? `+91 ${existingNumber}` : "—" },
                    ] : []),
                  ].filter((s) => s.val).map((s, i) => (
                    <div key={i} className="bn-spec-row">
                      <span className="bn-spec-key">{s.label}</span>
                      <span className="bn-spec-val">{s.val}</span>
                    </div>
                  ))}
                </div>

                <div className="bn-price-section">
                  <div className="bn-price-row"><span>MRP</span><span>₹{subTotal}</span></div>
                  {singleDiscount > 0 && <div className="bn-price-row bn-price-savings"><span>Discount</span><span>−₹{singleDiscount}</span></div>}
                  {platformFee > 0 && <div className="bn-price-row"><span>Platform Fee</span><span>₹{platformFee}</span></div>}
                  {operatorFee > 0 && <div className="bn-price-row"><span>Operator Fee</span><span>₹{operatorFee}</span></div>}
                  <div className="bn-price-row"><span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
                  <div className="bn-price-divider" />
                  <div className="bn-price-total-row"><span>Total</span><span>₹{singleFinalPrice.toLocaleString()}</span></div>
                </div>
              </>
            )}

            {isFromCart && (
              <>
                <div className="bn-cart-summary-rows">
                  <div className="bn-price-row"><span>{totalCartQty} item{totalCartQty !== 1 ? "s" : ""} (MRP)</span><span>₹{cartOriginalTotal.toLocaleString()}</span></div>
                  {cartSavings > 0 && <div className="bn-price-row bn-price-savings"><span>Total Discount</span><span>−₹{cartSavings.toLocaleString()}</span></div>}
                  <div className="bn-price-row"><span>Taxes & Charges</span><span className="bn-free-tag">FREE</span></div>
                </div>
                <div className="bn-price-divider" />
                <div className="bn-price-total-row"><span>Grand Total</span><span>₹{cartSubtotal.toLocaleString()}</span></div>
                {cartSavings > 0 && <div className="bn-savings-pill">🎉 You're saving ₹{cartSavings.toLocaleString()} on this order!</div>}
              </>
            )}

            <div className="bn-info-section">
              <div className="bn-info-row">
                <span className="bn-info-key">Deliver to</span>
                <span className="bn-info-val">{selectedAddr ? `${selectedAddr.houseNo}, ${selectedAddr.street}` : "—"}</span>
              </div>
              <div className="bn-info-row">
                <span className="bn-info-key">Payment</span>
                <span className="bn-info-val">Cash on Delivery</span>
              </div>
              {isPortOrder && (
                <div className="bn-info-row">
                  <span className="bn-info-key">Order Type</span>
                  <span className="bn-info-val" style={{ color: "#7C3AED" }}>Port Request</span>
                </div>
              )}
              {isEsimOrder && (
  <div className="bn-info-row">
    <span className="bn-info-key">Order Type</span>
    <span className="bn-info-val" style={{ color: "#2563EB" }}>eSIM — Digital</span>
  </div>
)}
            </div>

            {/* PORT readiness indicator */}
            {isPortOrder && (
              <div className="bn-port-readiness">
                <div className="bn-port-ready-row">
                  <span className={`bn-port-ready-dot${selectedAddressId ? " ok" : ""}`} />
                  <span className={`bn-port-ready-txt${selectedAddressId ? " ok" : ""}`}>Delivery address</span>
                </div>
                <div className="bn-port-ready-row">
                  <span className={`bn-port-ready-dot${numberValid ? " ok" : ""}`} />
                  <span className={`bn-port-ready-txt${numberValid ? " ok" : ""}`}>Mobile number ({existingNumber.length}/10)</span>
                </div>
                <div className="bn-port-ready-row">
                  <span className={`bn-port-ready-dot${previousOperator ? " ok" : ""}`} />
                  <span className={`bn-port-ready-txt${previousOperator ? " ok" : ""}`}>Current operator {previousOperator ? `(${previousOperator})` : ""}</span>
                </div>
              </div>
            )}

            <button
              className="bn-pay-btn"
              onClick={handleBuy}
              disabled={createOrderMutation.isPending || isLoadingSession}
            >
            {isLoadingSession
  ? "Loading Checkout..."
  : createOrderMutation.isPending
  ? "Placing Order..."
  : isPortOrder
  ? `Confirm Port — ₹${singleFinalPrice.toLocaleString()} →`
  : isEsimOrder
  ? `Activate eSIM — ₹${singleFinalPrice.toLocaleString()} →`
  : `Pay ₹${isFromCart ? cartSubtotal.toLocaleString() : singleFinalPrice.toLocaleString()} →`}
            </button>
            <button className="bn-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          </div>
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

export default BuyNow;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bn-root { min-height: 100vh; background: #F0F4FF; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  .bn-loading { min-height: 100vh; background: #F0F4FF; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; }
  .bn-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid #DBEAFE; border-top-color: #3B82F6; animation: bn-spin 0.75s linear infinite; }
  @keyframes bn-spin { to { transform: rotate(360deg); } }

  /* NAV */
  .bn-nav { position: sticky; top: 0; z-index: 40; background: rgba(240,244,255,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid #DDE3F5; height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .bn-back-btn { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #DDE3F5; border-radius: 10px; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #4B5563; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .bn-back-btn:hover { border-color: #3B82F6; color: #3B82F6; background: #EFF6FF; }
  .bn-nav-center { display: flex; align-items: center; gap: 8px; }
  .bn-nav-port-dot { font-size: 18px; }
  .bn-nav-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #111827; letter-spacing: -0.3px; }

  /* PORT HERO BANNER */
  .bn-port-hero { background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #6366F1 100%); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .bn-port-hero-left { display: flex; align-items: center; gap: 14px; }
  .bn-port-hero-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .bn-port-hero-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .bn-port-hero-sub { font-size: 12px; color: rgba(255,255,255,0.75); }
  .bn-port-hero-steps { display: flex; align-items: center; gap: 6px; }
  .bn-port-hero-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bn-port-hero-step-num { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); color: #fff; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .bn-port-hero-step-lbl { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 600; white-space: nowrap; }

  /* LAYOUT */
  .bn-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; padding: 20px 24px; max-width: 1100px; margin: 0 auto; }
  .bn-left { display: flex; flex-direction: column; gap: 16px; }

  /* CARD */
  .bn-card { background: #fff; border-radius: 22px; border: 1px solid #DDE3F5; padding: 22px; box-shadow: 0 2px 14px rgba(59,130,246,0.06); }
  .bn-card-step { font-size: 10px; font-weight: 800; color: #3B82F6; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
  .bn-card-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 4px; }
  .bn-card-sub { font-size: 13px; color: #9CA3AF; margin-bottom: 18px; }

  /* PORT CARD */
  .bn-port-card { border-color: #C7D2FE; background: linear-gradient(180deg, #FAFBFF 0%, #fff 100%); }
  .bn-port-card-header { display: flex; align-items: center; gap: 14px; padding-bottom: 4px; }
  .bn-port-card-header-icon { width: 44px; height: 44px; border-radius: 13px; background: linear-gradient(135deg, #EEF2FF, #E0E7FF); border: 1px solid #C7D2FE; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }

  /* ADDRESS */
  .bn-addr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .bn-addr-item { padding: 14px; border-radius: 14px; border: 2px solid #DDE3F5; cursor: pointer; transition: all 0.15s; }
  .bn-addr-item:hover { border-color: #93C5FD; background: #F8FAFF; }
  .bn-addr-selected { border-color: #2563EB !important; background: #EFF6FF !important; }
  .bn-addr-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; margin-bottom: 4px; }
  .bn-addr-line { font-size: 13px; font-weight: 700; color: #111827; }
  .bn-default-badge { background: #EFF6FF; color: #1D4ED8; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid #BFDBFE; white-space: nowrap; flex-shrink: 0; }
  .bn-addr-city { font-size: 12px; color: #6B7280; margin-bottom: 10px; }
  .bn-addr-actions { display: flex; gap: 6px; }
  .bn-addr-edit { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #3B82F6; background: #EFF6FF; border: none; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-family: inherit; transition: background 0.13s; }
  .bn-addr-edit:hover { background: #DBEAFE; }
  .bn-addr-del { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #EF4444; background: #FEF2F2; border: none; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-family: inherit; transition: background 0.13s; }
  .bn-addr-del:hover { background: #FEE2E2; }
  .bn-addr-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .bn-add-addr-btn { display: flex; align-items: center; justify-content: center; gap: 7px; border: 2px dashed #BFDBFE; background: transparent; color: #2563EB; font-size: 13px; font-weight: 600; padding: 12px; border-radius: 14px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
  .bn-add-addr-btn:hover { background: #EFF6FF; }
  .bn-loc-btn { display: flex; align-items: center; justify-content: center; gap: 7px; background: #F5F3FF; border: 1px solid #DDD6FE; color: #6D28D9; font-size: 13px; font-weight: 600; padding: 12px; border-radius: 14px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
  .bn-loc-btn:hover { background: #EDE9FE; }

  /* PORT FIELDS */
  .bn-port-fields { display: flex; flex-direction: column; gap: 22px; }
  .bn-port-field-group { display: flex; flex-direction: column; gap: 10px; }
  .bn-port-label { font-size: 11px; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }
  .bn-port-label-num { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, #2563EB, #6366F1); color: #fff; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  /* Number input */
  .bn-port-number-wrap { display: flex; align-items: center; border: 1.5px solid #DDE3F5; border-radius: 14px; overflow: hidden; background: #FAFBFF; transition: border-color 0.15s; }
  .bn-port-number-wrap:focus-within { border-color: #6366F1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
  .bn-port-number-prefix { padding: 0 14px; font-size: 14px; font-weight: 700; color: #6366F1; background: #EEF2FF; border-right: 1.5px solid #DDE3F5; height: 48px; display: flex; align-items: center; flex-shrink: 0; }
  .bn-port-number-input { flex: 1; border: none; outline: none; padding: 0 14px; font-size: 16px; font-family: 'Sora', sans-serif; font-weight: 700; color: #111827; background: transparent; letter-spacing: 1px; height: 48px; }
  .bn-port-number-input::placeholder { font-size: 13px; font-weight: 400; letter-spacing: 0; color: #9CA3AF; font-family: 'Plus Jakarta Sans', sans-serif; }
  .bn-port-input-ok { }
  .bn-port-input-warn { }
  .bn-port-input-check { width: 28px; height: 28px; border-radius: 50%; background: #10B981; color: #fff; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-right: 10px; flex-shrink: 0; }

  /* Progress bar */
  .bn-port-progress-track { height: 4px; background: #E5E7EB; border-radius: 99px; overflow: hidden; }
  .bn-port-progress-fill { height: 100%; background: linear-gradient(90deg, #F59E0B, #EF4444); border-radius: 99px; transition: width 0.2s, background 0.3s; }
  .bn-port-progress-fill.bn-port-progress-ok { background: linear-gradient(90deg, #10B981, #34D399); }

  /* Number meta */
  .bn-port-number-meta { display: flex; align-items: center; justify-content: space-between; }
  .bn-port-meta-ok { font-size: 11px; font-weight: 700; color: #10B981; }
  .bn-port-meta-warn { font-size: 11px; font-weight: 700; color: #F59E0B; }
  .bn-port-meta-neutral { font-size: 11px; color: #9CA3AF; font-weight: 500; }
  .bn-port-meta-count { font-size: 11px; font-weight: 700; color: #9CA3AF; font-family: 'Sora', sans-serif; }

  /* Divider */
  .bn-port-divider { display: flex; align-items: center; gap: 10px; }
  .bn-port-divider::before, .bn-port-divider::after { content: ""; flex: 1; height: 1px; background: #E5E7EB; }
  .bn-port-divider-label { font-size: 11px; color: #9CA3AF; font-weight: 600; white-space: nowrap; }

  /* Operator cards */
  .bn-port-op-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .bn-port-op-card { position: relative; padding: 14px 8px 12px; border-radius: 14px; border: 2px solid; cursor: pointer; font-family: inherit; transition: all 0.18s; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .bn-port-op-emoji { font-size: 22px; line-height: 1; }
  .bn-port-op-name { font-size: 12px; font-weight: 800; }
  .bn-port-op-check { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%; color: #fff; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

  /* Other operator */
  .bn-port-other-wrap { display: flex; align-items: center; gap: 10px; background: #F8FAFF; border: 1.5px dashed #DDE3F5; border-radius: 12px; padding: 4px 4px 4px 14px; }
  .bn-port-other-label { font-size: 12px; color: #9CA3AF; font-weight: 600; white-space: nowrap; }
  .bn-port-other-input { flex: 1; border: none; outline: none; background: transparent; font-size: 13px; font-family: inherit; color: #111827; padding: 8px 0; }
  .bn-port-other-input::placeholder { color: #C4C9D4; }

  /* Selected operator pill */
  .bn-port-selected-op { display: flex; align-items: center; gap: 8px; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 10px; padding: 8px 12px; font-size: 12px; color: #4338CA; }
  .bn-port-selected-op strong { font-weight: 800; }
  .bn-port-op-clear { margin-left: auto; background: none; border: none; cursor: pointer; color: #6366F1; font-size: 13px; font-weight: 700; padding: 0 4px; }

  /* Timeline */
  .bn-port-timeline { background: linear-gradient(135deg, #F8FAFF, #EEF2FF); border: 1px solid #C7D2FE; border-radius: 16px; padding: 16px 18px; }
  .bn-port-timeline-header { font-size: 12px; font-weight: 800; color: #4338CA; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
  .bn-port-timeline-items { display: flex; flex-direction: column; gap: 0; }
  .bn-port-timeline-item { display: flex; align-items: flex-start; gap: 12px; position: relative; padding-bottom: 14px; }
  .bn-port-timeline-item:last-child { padding-bottom: 0; }
  .bn-port-timeline-icon { width: 32px; height: 32px; border-radius: 10px; background: #fff; border: 1px solid #C7D2FE; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; position: relative; z-index: 1; }
  .bn-port-timeline-line { position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background: linear-gradient(180deg, #C7D2FE, transparent); }
  .bn-port-timeline-item:last-child .bn-port-timeline-line { display: none; }
  .bn-port-timeline-content { flex: 1; padding-top: 4px; }
  .bn-port-timeline-title { font-size: 13px; font-weight: 700; color: #1E40AF; margin-bottom: 2px; }
  .bn-port-timeline-desc { font-size: 11.5px; color: #4B5563; line-height: 1.6; }

  /* PAYMENT */
  .bn-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .bn-pay-item { padding: 13px; text-align: center; border-radius: 12px; border: 2px solid #DDE3F5; font-size: 13px; font-weight: 600; color: #6B7280; cursor: pointer; transition: all 0.15s; position: relative; }
  .bn-pay-selected { border-color: #2563EB !important; background: #EFF6FF !important; color: #2563EB !important; }
  .bn-pay-disabled { opacity: 0.45; cursor: not-allowed; }
  .bn-coming-soon { display: block; font-size: 10px; font-weight: 700; color: #9CA3AF; margin-top: 2px; }
  .bn-pay-note { font-size: 12px; color: #9CA3AF; }

  /* CART ITEMS */
  .bn-cart-items { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }
  .bn-ci-row { display: flex; align-items: flex-start; gap: 10px; padding: 12px; background: #F9FAFB; border-radius: 14px; border: 1px solid #F3F4F6; }
  .bn-ci-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 1px solid #BFDBFE; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .bn-ci-info { flex: 1; }
  .bn-ci-name { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 5px; }
  .bn-ci-chips { display: flex; gap: 4px; flex-wrap: wrap; }
  .bn-ci-chip { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .bn-chip-blue { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
  .bn-chip-purple { background: #F5F3FF; color: #6D28D9; border: 1px solid #DDD6FE; }
  .bn-chip-green { background: #DCFCE7; color: #14532D; border: 1px solid #BBF7D0; }
  .bn-chip-yellow { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
  .bn-ci-right { text-align: right; flex-shrink: 0; }
  .bn-ci-qty { font-size: 11px; font-weight: 600; color: #9CA3AF; margin-bottom: 2px; }
  .bn-ci-price { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800; color: #2563EB; }
  .bn-ci-was { font-size: 11px; color: #D1D5DB; text-decoration: line-through; }

  /* SUMMARY CARD */
  .bn-right { position: sticky; top: 78px; height: fit-content; }
  .bn-summary-card { background: #fff; border-radius: 22px; border: 1px solid #DDE3F5; padding: 22px; box-shadow: 0 2px 14px rgba(59,130,246,0.06); }
  .bn-summary-header { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .bn-port-badge { background: #F5F3FF; color: #6D28D9; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid #DDD6FE; margin-left: auto; }
  .bn-op-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .bn-op-logo { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #DDE3F5; object-fit: contain; }
  .bn-op-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #DBEAFE, #EDE9FE); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #2563EB; }
  .bn-op-name { font-size: 15px; font-weight: 700; color: #111827; }
  .bn-op-port-sub { font-size: 11px; color: #7C3AED; font-weight: 600; margin-top: 2px; }
  .bn-spec-box { background: #F8FAFF; border: 1px solid #DDE3F5; border-radius: 14px; padding: 14px; margin-bottom: 16px; }
  .bn-spec-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #F3F4F6; }
  .bn-spec-row:last-child { border-bottom: none; }
  .bn-spec-key { color: #6B7280; font-weight: 500; }
  .bn-spec-val { color: #111827; font-weight: 700; }
  .bn-price-section { margin-top: 4px; }
  .bn-cart-summary-rows { display: flex; flex-direction: column; gap: 6px; }
  .bn-price-row { display: flex; justify-content: space-between; font-size: 13.5px; color: #374151; font-weight: 500; padding: 5px 0; }
  .bn-price-savings { color: #16A34A; font-weight: 700; }
  .bn-free-tag { color: #16A34A; font-weight: 700; font-size: 13px; }
  .bn-price-divider { height: 1px; background: #F3F4F6; margin: 12px 0; }
  .bn-price-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #111827; }
  .bn-savings-pill { margin-top: 10px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 9px 14px; font-size: 12px; font-weight: 600; color: #15803D; text-align: center; }
  .bn-info-section { margin-top: 16px; padding-top: 14px; border-top: 1px solid #F3F4F6; display: flex; flex-direction: column; gap: 8px; }
  .bn-info-row { display: flex; justify-content: space-between; font-size: 12px; }
  .bn-info-key { color: #9CA3AF; }
  .bn-info-val { color: #2563EB; font-weight: 600; max-width: 55%; text-align: right; }

  /* PORT READINESS CHECKLIST */
  .bn-port-readiness { margin-top: 14px; background: #F8FAFF; border: 1px solid #E0E7FF; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
  .bn-port-ready-row { display: flex; align-items: center; gap: 8px; }
  .bn-port-ready-dot { width: 8px; height: 8px; border-radius: 50%; background: #E5E7EB; border: 2px solid #D1D5DB; transition: all 0.2s; flex-shrink: 0; }
  .bn-port-ready-dot.ok { background: #10B981; border-color: #10B981; box-shadow: 0 0 0 3px #D1FAE5; }
  .bn-port-ready-txt { font-size: 12px; color: #9CA3AF; font-weight: 500; transition: color 0.2s; }
  .bn-port-ready-txt.ok { color: #059669; font-weight: 700; }

  .bn-pay-btn { width: 100%; margin-top: 18px; padding: 14px; background: linear-gradient(135deg, #2563EB, #6366F1); border: none; border-radius: 14px; color: #fff; font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 4px 20px rgba(99,102,241,0.35); transition: opacity 0.15s, transform 0.12s; }
  .bn-pay-btn:hover { opacity: 0.92; }
  .bn-pay-btn:active { transform: scale(0.97); }
  .bn-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .bn-cancel-btn { width: 100%; margin-top: 8px; padding: 10px; background: none; border: none; color: #9CA3AF; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: color 0.15s; }
  .bn-cancel-btn:hover { color: #4B5563; }

  @media (max-width: 860px) {
    .bn-layout { grid-template-columns: 1fr; padding: 14px 12px; gap: 14px; }
    .bn-right { position: static; }
    .bn-addr-grid { grid-template-columns: 1fr; }
    .bn-pay-grid { grid-template-columns: 1fr 1fr; }
    .bn-port-op-grid { grid-template-columns: repeat(2, 1fr); }
    .bn-port-hero { padding: 16px; }
    .bn-port-hero-steps { display: none; }
  }
`;