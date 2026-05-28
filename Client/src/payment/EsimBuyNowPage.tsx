import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";
import { usePlanById } from "../hooks/useEsim";
import { useCreateEsimOrder } from "../hooks/useCreateEsimOrder";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Wifi, Clock, Phone, MessageSquare, Package, ShieldCheck, Zap, Globe } from "lucide-react";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.eb-root { min-height: 100vh; background: #F0F4FF; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #111827; }

/* ── Loading ── */
.eb-loading { min-height: 100vh; background: #F0F4FF; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; }
.eb-spinner { width: 40px; height: 40px; border-radius: 50%; border: 3px solid #DBEAFE; border-top-color: #2563EB; animation: eb-spin 0.75s linear infinite; }
@keyframes eb-spin { to { transform: rotate(360deg); } }
@keyframes eb-fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes eb-overlayIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes eb-modalSlide { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* ── Nav ── */
.eb-nav {
  position: sticky; top: 0; z-index: 40;
  background: rgba(240,244,255,0.92); backdrop-filter: blur(20px);
  border-bottom: 1px solid #DDE3F5;
  height: 58px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
}
.eb-back-btn {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid #DDE3F5; border-radius: 10px;
  padding: 7px 14px; font-size: 13px; font-weight: 600; color: #4B5563;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.eb-back-btn:hover { border-color: #2563EB; color: #2563EB; background: #EFF6FF; }
.eb-nav-center { display: flex; align-items: center; gap: 8px; }
.eb-nav-icon { font-size: 18px; }
.eb-nav-title { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #111827; letter-spacing: -0.3px; }

/* ── eSIM Hero Banner ── */
.eb-hero {
  background: linear-gradient(135deg, #0F172A 0%, #2563EB 55%, #6366F1 100%);
  padding: 20px 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
}
.eb-hero-left { display: flex; align-items: center; gap: 14px; }
.eb-hero-icon {
  width: 48px; height: 48px; border-radius: 14px;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
}
.eb-hero-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; }
.eb-hero-sub { font-size: 12px; color: rgba(255,255,255,0.75); }
.eb-hero-steps { display: flex; align-items: center; gap: 6px; }
.eb-hero-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.eb-hero-step-num {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35);
  color: #fff; font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.eb-hero-step-lbl { font-size: 10px; color: rgba(255,255,255,0.7); font-weight: 600; white-space: nowrap; }

/* ── Layout ── */
.eb-layout {
  display: grid; grid-template-columns: 1fr 380px; gap: 20px;
  padding: 20px 24px; max-width: 1100px; margin: 0 auto;
}
.eb-left { display: flex; flex-direction: column; gap: 16px; animation: eb-fadeUp 0.3s ease both; }

/* ── Card ── */
.eb-card {
  background: #fff; border-radius: 22px; border: 1px solid #DDE3F5;
  padding: 22px; box-shadow: 0 2px 14px rgba(59,130,246,0.06);
}
.eb-card-step { font-size: 10px; font-weight: 800; color: #2563EB; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 6px; }
.eb-card-title { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 4px; }
.eb-card-sub { font-size: 13px; color: #9CA3AF; margin-bottom: 18px; }

/* ── Auto-fill badge ── */
.eb-autofill-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 8px;
  background: #ECFDF5; border: 1px solid #A7F3D0;
  color: #059669; font-size: 12px; font-weight: 700;
  margin-bottom: 16px;
}

/* ── Fields grid ── */
.eb-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.eb-field-full { grid-column: 1 / -1; }
.eb-phone-wrap { display: grid; grid-template-columns: 160px 1fr; gap: 10px; }
.eb-select {
  width: 100%; height: 48px;
  background: #FAFBFF; border: 1.5px solid #DDE3F5; border-radius: 12px;
  padding: 0 14px; font-size: 13px; font-weight: 600; color: #111827;
  font-family: 'Plus Jakarta Sans', sans-serif; outline: none;
  cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
  padding-right: 32px;
  transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;
}
.eb-select:focus {
  border-color: #6366F1; background-color: #fff;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
}
.eb-select-autofilled { border-color: #6EE7B7 !important; background-color: #F0FDF4 !important; }

.eb-label {
  display: block; font-size: 11px; font-weight: 800;
  color: #374151; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 7px;
}
.eb-input {
  width: 100%; height: 48px;
  background: #FAFBFF; border: 1.5px solid #DDE3F5; border-radius: 12px;
  padding: 0 14px; font-size: 14px; font-weight: 500; color: #111827;
  font-family: 'Plus Jakarta Sans', sans-serif; outline: none;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}
.eb-input::placeholder { color: #C4C9D4; }
.eb-input:focus {
  border-color: #6366F1; background: #fff;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
}
.eb-input-autofilled {
  border-color: #6EE7B7 !important;
  background: #F0FDF4 !important;
}

/* ── Payment section ── */
.eb-pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.eb-pay-item {
  padding: 13px; text-align: center; border-radius: 12px;
  border: 2px solid #DDE3F5; font-size: 13px; font-weight: 600;
  color: #6B7280; cursor: pointer; transition: all 0.15s; position: relative;
}
.eb-pay-selected { border-color: #2563EB !important; background: #EFF6FF !important; color: #2563EB !important; }
.eb-pay-disabled { opacity: 0.45; cursor: not-allowed; }
.eb-coming-soon { display: block; font-size: 10px; font-weight: 700; color: #9CA3AF; margin-top: 2px; }
.eb-pay-note { font-size: 12px; color: #9CA3AF; }

/* ── Right: Summary card ── */
.eb-right { position: sticky; top: 78px; height: fit-content; animation: eb-fadeUp 0.35s ease both; }
.eb-summary-card {
  background: #fff; border-radius: 22px; border: 1px solid #DDE3F5;
  padding: 22px; box-shadow: 0 2px 14px rgba(59,130,246,0.06);
}
.eb-summary-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 800; color: #6B7280;
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;
}
.eb-esim-badge {
  background: #EFF6FF; color: #1D4ED8; font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px; border: 1px solid #BFDBFE; margin-left: auto;
}

/* ── Plan info in summary ── */
.eb-plan-name-block { margin-bottom: 14px; }
.eb-plan-name { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 4px; line-height: 1.2; }
.eb-plan-network { font-size: 12px; color: #9CA3AF; font-weight: 500; }

.eb-spec-box {
  background: #F8FAFF; border: 1px solid #DDE3F5;
  border-radius: 14px; padding: 14px; margin-bottom: 16px;
}
.eb-spec-row {
  display: flex; justify-content: space-between;
  padding: 7px 0; font-size: 13px;
  border-bottom: 1px solid #F3F4F6;
}
.eb-spec-row:last-child { border-bottom: none; }
.eb-spec-key { color: #6B7280; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.eb-spec-val { color: #111827; font-weight: 700; }
.eb-spec-val-green { color: #059669 !important; }

/* ── Price breakdown ── */
.eb-price-section { margin-top: 4px; }
.eb-price-row { display: flex; justify-content: space-between; font-size: 13.5px; color: #374151; font-weight: 500; padding: 5px 0; }
.eb-price-divider { height: 1px; background: #F3F4F6; margin: 12px 0; }
.eb-price-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #111827; }

/* ── Info rows ── */
.eb-info-section { margin-top: 16px; padding-top: 14px; border-top: 1px solid #F3F4F6; display: flex; flex-direction: column; gap: 8px; }
.eb-info-row { display: flex; justify-content: space-between; font-size: 12px; }
.eb-info-key { color: #9CA3AF; }
.eb-info-val { color: #2563EB; font-weight: 600; }

/* ── Countries ── */
.eb-countries-head {
  font-size: 10px; font-weight: 800; color: #9CA3AF;
  text-transform: uppercase; letter-spacing: 0.07em;
  margin-bottom: 8px; margin-top: 14px;
}
.eb-countries-wrap { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
.eb-ctry {
  padding: 4px 10px; border-radius: 8px;
  background: #F0F4FF; border: 1px solid #DDE3F5;
  font-size: 11.5px; font-weight: 600; color: #4B5563;
}

/* ── FUP note ── */
.eb-fup {
  background: #FFFBEB; border: 1px solid #FDE68A;
  border-radius: 12px; padding: 10px 12px;
  font-size: 12px; color: #92400E; font-weight: 500;
  display: flex; gap: 8px; align-items: flex-start;
  margin-bottom: 14px; line-height: 1.5;
}

/* ── CTA Button ── */
.eb-pay-btn {
  width: 100%; margin-top: 18px; padding: 14px;
  background: linear-gradient(135deg, #2563EB, #6366F1);
  border: none; border-radius: 14px; color: #fff;
  font-size: 15px; font-weight: 700; font-family: inherit;
  cursor: pointer; box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  transition: opacity 0.15s, transform 0.12s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.eb-pay-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.eb-pay-btn:active:not(:disabled) { transform: scale(0.97); }
.eb-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.eb-pay-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: eb-spin 0.7s linear infinite;
}
.eb-cancel-btn {
  width: 100%; margin-top: 8px; padding: 10px;
  background: none; border: none; color: #9CA3AF;
  font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: inherit; transition: color 0.15s;
}
.eb-cancel-btn:hover { color: #4B5563; }
.eb-secure-note {
  text-align: center; margin-top: 6px;
  font-size: 11px; color: #9CA3AF; font-weight: 500;
  display: flex; align-items: center; justify-content: center; gap: 4px;
}

/* ── Login Modal ── */
.eb-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  animation: eb-overlayIn 0.2s ease; padding: 20px;
}
.eb-modal {
  background: #fff; border: 1px solid #DDE3F5;
  border-radius: 24px; padding: 36px 32px;
  max-width: 400px; width: 100%; text-align: center;
  animation: eb-modalSlide 0.25s ease;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.eb-modal-emoji { font-size: 48px; margin-bottom: 16px; }
.eb-modal-title { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.eb-modal-sub { font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 28px; }
.eb-modal-btn {
  width: 100%; height: 52px; border: none; border-radius: 14px;
  background: linear-gradient(135deg, #2563EB, #6366F1);
  color: #fff; font-size: 15px; font-weight: 700;
  font-family: inherit; cursor: pointer; margin-bottom: 10px; transition: opacity 0.15s;
}
.eb-modal-btn:hover { opacity: 0.9; }
.eb-modal-dismiss {
  background: none; border: none; font-size: 13px; color: #9CA3AF;
  cursor: pointer; font-family: inherit; font-weight: 600; padding: 6px;
  transition: color 0.15s;
}
.eb-modal-dismiss:hover { color: #6B7280; }

/* ── Responsive ── */
@media (max-width: 860px) {
  .eb-layout { grid-template-columns: 1fr; padding: 14px 12px; gap: 14px; }
  .eb-right { position: static; }
  .eb-fields { grid-template-columns: 1fr; }
  .eb-field-full { grid-column: 1; }
  .eb-phone-wrap { grid-template-columns: 1fr; }
  .eb-pay-grid { grid-template-columns: 1fr 1fr; }
  .eb-hero { padding: 16px; }
  .eb-hero-steps { display: none; }
  .eb-nav { padding: 0 14px; }
}
`;


const COUNTRIES = [
  { code: "IN", dialCode: "+91",  label: "🇮🇳 India" },
  { code: "AE", dialCode: "+971", label: "🇦🇪 UAE" },
  { code: "US", dialCode: "+1",   label: "🇺🇸 USA" },
  { code: "GB", dialCode: "+44",  label: "🇬🇧 UK" },
  { code: "TH", dialCode: "+66",  label: "🇹🇭 Thailand" },
  { code: "SG", dialCode: "+65",  label: "🇸🇬 Singapore" },
  { code: "JP", dialCode: "+81",  label: "🇯🇵 Japan" },
  { code: "AU", dialCode: "+61",  label: "🇦🇺 Australia" },
  { code: "DE", dialCode: "+49",  label: "🇩🇪 Germany" },
  { code: "FR", dialCode: "+33",  label: "🇫🇷 France" },
  { code: "IT", dialCode: "+39",  label: "🇮🇹 Italy" },
  { code: "MY", dialCode: "+60",  label: "🇲🇾 Malaysia" },
  { code: "ID", dialCode: "+62",  label: "🇮🇩 Indonesia" },
];
// ─── Field Component ─────────────────────────────────────────────────────────
const Field = ({
  label, name, value, onChange, placeholder = "",
  autoFilled = false, type = "text", fullWidth = false,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; autoFilled?: boolean; type?: string; fullWidth?: boolean;
}) => (
  <div className={fullWidth ? "eb-field-full" : ""}>
    <label className="eb-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`eb-input${autoFilled ? " eb-input-autofilled" : ""}`}
    />
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────
export default function EsimBuyNowPage() {
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useUser();
  const { data: plan, isLoading: planLoading } = usePlanById(planId);
  const { mutate: createOrder, isPending } = useCreateEsimOrder();

  const isLoggedIn = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const [selectedPayment] = useState("COD");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
   countryCode: "IN",
    phoneNumber: "",
  });

  // Show login modal on mount if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      setShowLoginModal(true);
    }
  }, [user, userLoading]);

  // Auto-fill from useUser data
  useEffect(() => {
    if (!user) return;
    const filled: string[] = [];
    const updates: Partial<typeof form> = {};

    const fullName: string = user.fullName || "";
    const parts = fullName.trim().split(" ");

    if (parts[0]) { updates.firstName = parts[0]; filled.push("firstName"); }
    if (parts[1]) { updates.lastName = parts.slice(1).join(" "); filled.push("lastName"); }
    if (user.email)       { updates.email       = user.email;       filled.push("email"); }
    if (user.phone)       { updates.phoneNumber = user.phone;       filled.push("phoneNumber"); }
    if (user.countryCode) {
  const match = COUNTRIES.find(
    c => c.code === user.countryCode || c.dialCode === user.countryCode
  );
  updates.countryCode = match ? match.code : "IN";
  filled.push("countryCode");
}
    if (user.countryCode) { updates.countryCode = user.countryCode; filled.push("countryCode"); }
    

    setForm(prev => ({ ...prev, ...updates }));
    setAutoFilledFields(filled);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setAutoFilledFields(prev => prev.filter(f => f !== name));
  };

  const handleBuy = () => {
    if (!user) { setShowLoginModal(true); return; }
    if (!planId) return;

    if (!form.firstName.trim()) return toast.error("Enter your first name");
    if (!form.lastName.trim())  return toast.error("Enter your last name");
    if (!form.email.trim())     return toast.error("Enter your email address");
    if (!form.address.trim())   return toast.error("Enter your address");
    if (!form.city.trim())      return toast.error("Enter your city");
    if (!form.state.trim())     return toast.error("Enter your state");
    if (!form.pincode.trim())   return toast.error("Enter your pincode");

    createOrder(
      {
        planId,
        ...form,
        paymentMethod: "COD",
      },
      {
        onSuccess: (result) => {
          if (result?.isKycRequired) {
            toast.success("KYC required — redirecting…");
            window.open(result.ekycLink, "_blank");
          } else {
            toast.success("eSIM order placed 📱");
          }
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          navigate("/profile?tab=orders");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Order failed ❌");
        },
      }
    );
  };

  const networkTag = plan?.network?.includes("5G")
    ? "5G" : plan?.network?.includes("4G") ? "4G LTE" : plan?.network;

  // ── Loading ──
  if (userLoading || planLoading) return (
    <>
      <style>{styles}</style>
      <div className="eb-loading">
        <div className="eb-spinner" />
        <p style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>
          Loading{planLoading ? " plan" : ""}…
        </p>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="eb-root">

        {/* ── Login Modal ── */}
        {showLoginModal && (
          <div className="eb-overlay">
            <div className="eb-modal">
              <div className="eb-modal-emoji">🔐</div>
              <div className="eb-modal-title">Login Required</div>
              <div className="eb-modal-sub">
                You need to be logged in to purchase an eSIM plan. Login to continue and your details will be auto-filled.
              </div>
              <button
                className="eb-modal-btn"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-login-modal"));
                  setShowLoginModal(false);
                }}
              >
                Login to Continue
              </button>
              <button
                className="eb-modal-dismiss"
                onClick={() => setShowLoginModal(false)}
              >
                Browse as guest
              </button>
            </div>
          </div>
        )}

        {/* ── Nav ── */}
        <nav className="eb-nav">
          <button className="eb-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="eb-nav-center">
            <span className="eb-nav-icon">📱</span>
            <span className="eb-nav-title">Get eSIM</span>
          </div>
          <div style={{ width: 72 }} />
        </nav>

        {/* ── eSIM Hero Banner ── */}
        <div className="eb-hero">
          <div className="eb-hero-left">
            <div className="eb-hero-icon">📱</div>
            <div>
              <div className="eb-hero-title">eSIM Activation</div>
              <div className="eb-hero-sub">No physical SIM · Instant digital activation · Works on any eSIM device</div>
            </div>
          </div>
          <div className="eb-hero-steps">
            {["Place Order", "Get QR Code", "Scan & Install", "Active"].map((s, i) => (
              <div key={s} className="eb-hero-step">
                <div className="eb-hero-step-num">{i + 1}</div>
                <div className="eb-hero-step-lbl">{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="eb-layout">

          {/* ── LEFT ── */}
          <div className="eb-left">

            {/* Step 1 — Personal Info */}
            <div className="eb-card">
              <div className="eb-card-step">Step 1</div>
              <h2 className="eb-card-title">
                {user ? `Hey ${user.fullName?.split(" ")[0] || "there"} 👋` : "Personal Information"}
              </h2>
              <p className="eb-card-sub">Your name and contact details for the eSIM</p>

              {autoFilledFields.length > 0 && (
                <div className="eb-autofill-badge">
                  ✓ Details auto-filled from your account
                </div>
              )}

              <div className="eb-fields">
                <Field label="First Name" name="firstName" value={form.firstName}
                  onChange={handleChange} placeholder="John"
                  autoFilled={autoFilledFields.includes("firstName")} />
                <Field label="Last Name" name="lastName" value={form.lastName}
                  onChange={handleChange} placeholder="Doe"
                  autoFilled={autoFilledFields.includes("lastName")} />

                <div className="eb-field-full">
                  <Field label="Email Address" name="email" value={form.email}
                    onChange={handleChange} placeholder="john@example.com" type="email"
                    fullWidth autoFilled={autoFilledFields.includes("email")} />
                </div>

                <div className="eb-field-full">
  <label className="eb-label">Phone Number</label>
  <div className="eb-phone-wrap">
    <select
      name="countryCode"
      value={form.countryCode}
      onChange={(e) => {
        setForm(prev => ({ ...prev, countryCode: e.target.value }));
        setAutoFilledFields(prev => prev.filter(f => f !== "countryCode"));
      }}
      className={`eb-select${autoFilledFields.includes("countryCode") ? " eb-select-autofilled" : ""}`}
    >
      {COUNTRIES.map(c => (
        <option key={c.code} value={c.code}>
          {c.label} ({c.dialCode})
        </option>
      ))}
    </select>
    <input
      type="tel"
      name="phoneNumber"
      value={form.phoneNumber}
      onChange={handleChange}
      className={`eb-input${autoFilledFields.includes("phoneNumber") ? " eb-input-autofilled" : ""}`}
      placeholder="9876543210"
    />
  </div>
</div>
              </div>
            </div>

            {/* Step 2 — Billing Address */}
            <div className="eb-card">
              <div className="eb-card-step">Step 2</div>
              <h2 className="eb-card-title">Billing Address</h2>
              <p className="eb-card-sub">Where should we send the invoice?</p>
              <div className="eb-fields">
                <div className="eb-field-full">
                  <Field label="Address" name="address" value={form.address}
                    onChange={handleChange} placeholder="Street, Area, Landmark"
                    fullWidth />
                </div>
                <Field label="City" name="city" value={form.city}
                  onChange={handleChange} placeholder="Mumbai" />
                <Field label="State" name="state" value={form.state}
                  onChange={handleChange} placeholder="Maharashtra" />
                <Field label="Pincode" name="pincode" value={form.pincode}
                  onChange={handleChange} placeholder="400001" />
              </div>
            </div>

            {/* Step 3 — Payment */}
            <div className="eb-card">
              <div className="eb-card-step">Step 3</div>
              <h2 className="eb-card-title">Payment Method</h2>
              <p className="eb-card-sub">How would you like to pay?</p>
              <div className="eb-pay-grid">
                {["UPI", "Card", "Net Banking", "COD"].map((method) => {
                  const isCOD = method === "COD";
                  return (
                    <div
                      key={method}
                      className={`eb-pay-item${isCOD && selectedPayment === method ? " eb-pay-selected" : ""}${!isCOD ? " eb-pay-disabled" : ""}`}
                    >
                      {method}
                      {!isCOD && <span className="eb-coming-soon">Soon</span>}
                    </div>
                  );
                })}
              </div>
              <p className="eb-pay-note">Only Cash on Delivery is available right now.</p>
            </div>

          </div>

          {/* ── RIGHT — Order Summary ── */}
          <div className="eb-right">
            <div className="eb-summary-card">
              <div className="eb-summary-header">
                <Package size={15} />
                <span>Order Summary</span>
                <span className="eb-esim-badge">📱 eSIM</span>
              </div>

              {plan && (
                <>
                  <div className="eb-plan-name-block">
                    <div className="eb-plan-name">{plan.name}</div>
                    <div className="eb-plan-network">{plan.network}</div>
                  </div>

                  <div className="eb-spec-box">
                    {[
                      {
                        icon: <Wifi size={11} />, label: "Data",
                        val: plan.isUnlimited ? "Unlimited" : plan.dataLimit,
                        green: plan.isUnlimited,
                      },
                      { icon: <Clock size={11} />, label: "Validity", val: plan.validityDays ? `${plan.validityDays} Days` : null },
                      { icon: <Phone size={11} />, label: "Calls", val: plan.callInSeconds != null ? `${plan.callInSeconds}s` : null },
                      { icon: <MessageSquare size={11} />, label: "SMS / Day", val: plan.sms != null ? `${plan.sms}` : null },
                      { icon: <Zap size={11} />, label: "Network", val: networkTag },
                      { icon: <Globe size={11} />, label: "Coverage", val: plan.coverage },
                    ].filter(s => s.val).map((s, i) => (
                      <div key={i} className="eb-spec-row">
                        <span className="eb-spec-key">{s.icon} {s.label}</span>
                        <span className={`eb-spec-val${s.green ? " eb-spec-val-green" : ""}`}>{s.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="eb-price-section">
                    <div className="eb-price-row"><span>Plan Price</span><span>₹{plan.price}</span></div>
                    <div className="eb-price-row"><span>Delivery</span><span style={{ color: "#16A34A", fontWeight: 700 }}>FREE</span></div>
                    <div className="eb-price-divider" />
                    <div className="eb-price-total-row"><span>Total</span><span>₹{plan.price}</span></div>
                  </div>

                  {plan.fupPolicy && (
                    <div className="eb-fup" style={{ marginTop: 14 }}>
                      <span>⚡</span>
                      <span>{plan.fupPolicy}</span>
                    </div>
                  )}

                  {plan.countries?.length > 0 && (
                    <>
                      <div className="eb-countries-head">
                        {plan.countries.length} Countr{plan.countries.length === 1 ? "y" : "ies"} Covered
                      </div>
                      <div className="eb-countries-wrap">
                        {plan.countries.slice(0, 10).map((c: any) => (
                          <div key={c._id} className="eb-ctry">🏳️ {c.name}</div>
                        ))}
                        {plan.countries.length > 10 && (
                          <div className="eb-ctry">+{plan.countries.length - 10} more</div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="eb-info-section">
                    <div className="eb-info-row">
                      <span className="eb-info-key">Order Type</span>
                      <span className="eb-info-val">eSIM — Digital</span>
                    </div>
                    <div className="eb-info-row">
                      <span className="eb-info-key">Payment</span>
                      <span className="eb-info-val">Cash on Delivery</span>
                    </div>
                    <div className="eb-info-row">
                      <span className="eb-info-key">Delivery</span>
                      <span className="eb-info-val">QR Code via Email</span>
                    </div>
                  </div>
                </>
              )}

              <button
                className="eb-pay-btn"
                onClick={handleBuy}
                disabled={isPending}
              >
                {isPending ? (
                  <><div className="eb-pay-spinner" /> Placing Order…</>
                ) : (
                  <>Activate eSIM — ₹{plan?.price ?? "—"} →</>
                )}
              </button>
              <button className="eb-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
              <div className="eb-secure-note">
                <ShieldCheck size={12} /> Secure checkout · Instant eSIM activation
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}