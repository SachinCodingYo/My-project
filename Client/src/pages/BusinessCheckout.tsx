import React, { useState ,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePlans } from "../hooks/usePlans";
import { useDeleteAddress ,useAddress} from "../hooks/useAddressHooks";
import { useQueryClient } from "@tanstack/react-query";
import AddressModal from "../profile/modals/AddressModal";
import { FiEdit, FiTrash2, FiPlusCircle, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import { useCreateOrder } from "../hooks/useOrders";


/* ─── Google Font: add to your index.html <head> ───────────────────────────
   <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/>
────────────────────────────────────────────────────────────────────────────── */

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:          "#EEF2FF",
  surface:     "#FFFFFF",
  surfaceAlt:  "#F8FAFF",
  border:      "#DCE4F8",
  blue:        "#2563EB",
  blueSoft:    "#EEF3FF",
  blueMid:     "#DBEAFE",
  blueDeep:    "#1E3A8A",
  indigo:      "#6366F1",
  text:        "#0F172A",
  textMid:     "#334155",
  textMuted:   "#64748B",
  textLight:   "#94A3B8",
  success:     "#10B981",
  successSoft: "#D1FAE5",
  danger:      "#EF4444",
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, delay },
});

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Ic = {
  Back: () => (
    <svg width="16" height="16" fill="none" stroke={C.textMid} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Sim: () => (
    <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  ),
  Users: () => (
    <svg width="14" height="14" fill="none" stroke={C.blue} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Pin: () => (
    <svg width="14" height="14" fill="none" stroke={C.blue} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Bag: () => (
    <svg width="14" height="14" fill="none" stroke={C.blue} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" fill="none" stroke={C.textLight} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Office: () => (
    <svg width="13" height="13" fill="none" stroke={C.textLight} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  Doc: () => (
    <svg width="13" height="13" fill="none" stroke={C.textLight} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  Arrow: () => (
    <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5"
      strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Lock: () => (
    <svg width="11" height="11" fill="none" stroke={C.textLight} strokeWidth="2"
      strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

// ─── Reusable SectionHeader ───────────────────────────────────────────────────
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: C.blueSoft,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: C.text }}>
      {title}
    </span>
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

// ─── Reusable InputField ──────────────────────────────────────────────────────
const InputField: React.FC<{
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  badge?: string;
  type?: string;
  maxLength?: number;
  rightSlot?: React.ReactNode;
  borderColor?: string;
}> = ({ icon, placeholder, value, onChange, badge, type = "text", maxLength, rightSlot, borderColor }) => {
  const [focused, setFocused] = useState(false);
  const bColor = borderColor ?? (focused ? C.blue : C.border);
  return (
    <div style={{ position: "relative", marginBottom: 9 }}>
      <div style={{
        position: "absolute", left: 11, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
      }}>{icon}</div>
      <input
        type={type}
        inputMode={type === "tel" ? "numeric" : undefined}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: (badge || rightSlot) ? "10px 66px 10px 34px" : "10px 14px 10px 34px",
          borderRadius: 10,
          border: `1.5px solid ${bColor}`,
          background: focused ? C.surface : C.surfaceAlt,
          fontFamily: "'Manrope', sans-serif",
          fontSize: 13, fontWeight: 500, color: C.text,
          outline: "none",
          transition: "border-color 0.18s, background 0.18s",
          boxShadow: focused ? `0 0 0 3px ${C.blueSoft}` : "none",
        }}
      />
      {badge && (
        <span style={{
          position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
          fontSize: 9, fontWeight: 700, color: C.textLight,
          background: C.border, borderRadius: 5,
          padding: "2px 6px", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>{badge}</span>
      )}
      {rightSlot && (
        <div style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)" }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const BusinessCheckout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const deleteAddressMutation = useDeleteAddress();
const queryClient = useQueryClient();
const { mutate: createOrder, isPending } = useCreateOrder();

const [showAddressModal, setShowAddressModal] = useState(false);
const [editingAddress, setEditingAddress] = useState<any>(null);

  const { data: plans = [] } = usePlans({ isBusinessSim: true });
  const selectedPlan = plans.find((p: any) => p._id === id);
  const planPrice = selectedPlan?.salePrice || selectedPlan?.price || 0;

  const [selectedAddressId, setSelectedAddressId] = useState("");

  const { data: addresses } = useAddress();

  useEffect(() => {
  if (addresses?.length > 0) {
    const sel = addresses.find((a: any) => a.isDefault) || addresses[0];
    setSelectedAddressId(sel._id);
  }
}, [addresses]);
  const [quantity, setQuantity] = useState(5);
  const [form, setForm] = useState({ companyName: "", companyPhone: "", gstNumber: "" });

  // const total = planPrice * quantity;
  const phoneLen = form.companyPhone.length;
  const phoneError = phoneLen > 0 && phoneLen < 10;
  const phoneOk    = phoneLen === 10;

  const handlePhone = (val: string) => {
    setForm(f => ({ ...f, companyPhone: val.replace(/\D/g, "").slice(0, 10) }));
  };

const handleProceed = () => {
  if (!selectedAddressId || !form.companyName || !form.companyPhone) {
    alert("Please fill all required fields");
    return;
  }

  if (!phoneOk) {
    alert("Company phone must be exactly 10 digits");
    return;
  }
//   {
//   "orderType": "BUSINESS",
//   "addressId": "69c27cd28a0687c95e5571d2",
//   "businessDetails": {
//     "planId": "69e87c710f44158803c430a2",
//     "numberOfSims": 6,
//     "companyName": "Test Company Pvt Ltd",
//     "companyPhone": "9876543210",
//     "gstNumber": "27AAAAA0000A1Z5"
//   }
// }

  createOrder(
    {
      addressId: selectedAddressId,
      orderType: "BUSINESS",   // ✅ ADD THIS
      businessDetails: {
        planId: id,
        numberOfSims: quantity,
        companyName: form.companyName,
        companyPhone: form.companyPhone,
        gstNumber: form.gstNumber || undefined,
      },
    } as any,
    {
      onSuccess: () => {
        toast.success("Order placed successfully 🎉");
          queryClient.invalidateQueries({ queryKey: ["orders"] });

         navigate("/profile?tab=orders");
      },
      onError: (err: any) => {
        console.log(err);
        toast.error("Failed to place order");
      },
    }
  );
};


 const handleUseLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Example: call your backend or reverse geocoding API
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();

        console.log(data);

        toast.success("Location fetched");

        // OPTIONAL: auto open modal with prefilled data
        setEditingAddress({
          houseNo: "",
          street: data.address.road || "",
          city: data.address.city || data.address.town || "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
        });

        setShowAddressModal(true);

      } catch (err) {
        toast.error("Failed to fetch address");
      }
    },
    () => toast.error("Permission denied")
  );
};
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      padding: "26px 22px 56px",
      fontFamily: "'Manrope', sans-serif",
    }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 36, height: 36, borderRadius: 10,
          border: `1.5px solid ${C.border}`, background: C.surface,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <Ic.Back />
        </button>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: C.blue, marginBottom: 1,
          }}>Business SIM</div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 21, fontWeight: 800, color: C.text, lineHeight: 1.1,
          }}>Checkout</div>
        </div>
      </div>

      {/* ── PLAN BANNER ─────────────────────────────────────────────────────── */}
      <motion.div {...fade(0)} style={{
        background: `linear-gradient(130deg, ${C.blueDeep} 0%, ${C.blue} 55%, ${C.indigo} 100%)`,
        borderRadius: 18,
        padding: "18px 22px",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 150, height: 150, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)", right: -30, top: -50, pointerEvents: "none",
        }} />
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "2px 10px",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.09em",
            textTransform: "uppercase", color: "#fff", marginBottom: 9,
          }}>
            <Ic.Sim /> Enterprise
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2,
          }}>
            Enterprise SIM Package
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
  {selectedPlan?.operatorId?.name} • {selectedPlan?.planTypeId?.name}
</div>

<div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
  {selectedPlan?.data} | {selectedPlan?.calls} Calls | {selectedPlan?.sms}
</div>

<div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
  Validity: {selectedPlan?.validity} days
</div>

{selectedPlan?.benefits?.length > 0 && (
  <div style={{ fontSize: 10, color: "#fff", marginTop: 6 }}>
    🎁 {selectedPlan.benefits.join(", ")}
  </div>
)}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1,
          }}>
            {formatINR(planPrice)}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>
            per SIM · monthly
          </div>
        </div>
      </motion.div>

      {/* ── TWO-COLUMN GRID ─────────────────────────────────────────────────── */}
    {/* ── TWO-COLUMN GRID ─────────────────────────────────────────────── */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    alignItems: "start",
    marginBottom: 14,
  }}
>
  {/* ── LEFT COLUMN ── */}
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    
    {/* QUANTITY */}
   <motion.div {...fade(0.08)} style={{
  background: C.surface,
  border: `1.5px solid ${C.border}`,
  borderRadius: 16,
  padding: "16px 16px",
}}>
  <SectionHeader icon={<Ic.Users />} title="SIM Quantity" />

  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>
        Number of SIMs
      </div>
      <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>
        Minimum 5 required
      </div>
    </div>

    <div style={{
      display: "flex",
      alignItems: "center",
      background: C.blueSoft,
      borderRadius: 11,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setQuantity(q => Math.max(5, q - 1))}
        style={{
          width: 32,
          height: 32,
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: 17,
          fontWeight: 700,
          color: C.blue,
        }}
      >
        −
      </button>

      <span style={{
        width: 34,
        textAlign: "center",
        fontFamily: "'Syne', sans-serif",
        fontSize: 15,
        fontWeight: 800,
        color: C.text,
      }}>
        {quantity}
      </span>

      <button
        onClick={() => setQuantity(q => q + 1)}
        style={{
          width: 32,
          height: 32,
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: 17,
          fontWeight: 700,
          color: C.blue,
        }}
      >
        +
      </button>
    </div>
  </div>
</motion.div>

    {/* ADDRESS */}
 <motion.div {...fade(0.14)} style={{
  background: C.surface,
  border: `1.5px solid ${C.border}`,
  borderRadius: 16,
  padding: "16px",
}}>
  <SectionHeader icon={<Ic.Pin />} title="Delivery Address" />

  {/* ADDRESS LIST */}
  <div style={{ display: "grid", gap: 10 }}>
    {addresses?.map((addr: any) => (
      <div
        key={addr._id}
        onClick={() => setSelectedAddressId(addr._id)}
        style={{
          padding: "12px",
          borderRadius: 10,
          border: selectedAddressId === addr._id
            ? `2px solid ${C.blue}`
            : `1px solid ${C.border}`,
          background:
            selectedAddressId === addr._id ? C.blueSoft : C.surfaceAlt,
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {addr.houseNo}, {addr.street}
          </div>
          {addr.isDefault && (
            <span style={{
              fontSize: 10,
              background: C.blueSoft,
              padding: "2px 6px",
              borderRadius: 10,
              fontWeight: 700,
              color: C.blue
            }}>
              Default
            </span>
          )}
        </div>

        <div style={{ fontSize: 12, color: C.textMuted }}>
          {addr.city}, {addr.state} - {addr.pincode}
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingAddress(addr);
              setShowAddressModal(true);
            }}
            style={{ fontSize: 11 }}
          >
            <FiEdit /> Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteAddressMutation.mutate(addr._id, {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["address"] });
                  toast.success("Deleted");
                },
              });
            }}
            style={{ fontSize: 11, color: "red" }}
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* BUTTONS */}
  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
    <button
      onClick={() => {
        setEditingAddress(null);
        setShowAddressModal(true);
      }}
      style={{
        flex: 1,
        padding: 10,
        border: `1px dashed ${C.blue}`,
        borderRadius: 10,
        background: "transparent",
        color: C.blue,
        fontWeight: 600,
      }}
    >
      <FiPlusCircle /> Add Address
    </button>

    <button
     onClick={handleUseLocation}
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 10,
        background: C.blueSoft,
        border: `1px solid ${C.border}`,
        color: C.blue,
        fontWeight: 600,
      }}
    >
      <FiMapPin /> Use Location
    </button>
  </div>
</motion.div>

  </div>

  {/* ── RIGHT COLUMN ── */}
  <motion.div
    {...fade(0.1)}
    style={{
      background: C.surface,
      border: `1.5px solid ${C.border}`,
      borderRadius: 16,
      padding: "20px 18px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <SectionHeader icon={<Ic.Bag />} title="Business Details" />

    <InputField
      icon={<Ic.Office />}
      placeholder="Company Name"
      value={form.companyName}
      onChange={(v) => setForm((f) => ({ ...f, companyName: v }))}
    />

    <InputField
      icon={<Ic.Phone />}
      placeholder="Company Phone (10 digits)"
      value={form.companyPhone}
      type="tel"
      maxLength={10}
      onChange={handlePhone}
    />

    <InputField
      icon={<Ic.Doc />}
      placeholder="GST Number"
      value={form.gstNumber}
      onChange={(v) => setForm((f) => ({ ...f, gstNumber: v }))}
      badge="Optional"
    />
  </motion.div>
</div>   {/* ✅ THIS WAS MISSING */}


{/* ── CTA ─────────────────────────────────────────────────────────── */}
<motion.div {...fade(0.26)}>
  <button
    onClick={handleProceed}
     disabled={showAddressModal} 
    style={{
      width: "100%",
      padding: "14px 20px",
      borderRadius: 14,
      border: "none",
      background: `linear-gradient(130deg, ${C.blue} 0%, ${C.indigo} 100%)`,
      color: "#fff",
      fontFamily: "'Syne', sans-serif",
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    
    <span>Book Now</span>
    <Ic.Arrow />
  </button>
</motion.div>
{showAddressModal && (
  <AddressModal
    close={() => {
      setShowAddressModal(false);
      setEditingAddress(null);
    }}
    editingAddress={editingAddress}
  />
)}
</div>
  );
};

export default BusinessCheckout;