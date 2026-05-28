import React, { useState, useEffect, useRef } from "react";
import { X, Globe, Bell, ChevronDown, User, LogOut, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RegisterForm from "../screens/RegisterForm";
import LoginForm from "../screens/LoginForm";
import ForgotPasswordForm from "../screens/ForgotPasswordForm";
import { useGetUserNotifications, useMarkNotificationRead } from "../hooks/useNotification";
import { useGetMe } from "../hooks/useGetMe";
import { useCart } from "../hooks/useCart";
import { getToken, removeToken } from "../utils/getTocken";
import { Toaster } from "react-hot-toast";

const NAV_LINKS = [
  { to: "/", label: "HOME" },
  { to: "/simstore", label: "SIM STORE" },
  { to: "/billpayments", label: "BILL PAYMENTS" },
   { to: "/esimapp", label: "Esim" },
  { to: "/rewards", label: "REWARDS" },
  { to: "/partner", label: "BECOME A PARTNER" },
];

const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [showLanguage, setShowLanguage] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const notificationRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const { data: me } = useGetMe();
  const userId = me?.id || "";
  const { data: notifications = [] } = useGetUserNotifications(userId);
  const { mutate: markRead } = useMarkNotificationRead();
  const unreadCount = notifications?.filter((n: any) => !n.isRead).length;

  // ── Cart count: only fetch when logged in ───────────────────────────────────
  const { data: cartData } = useCart();
  const cartCount = token && Array.isArray(cartData)
    ? cartData.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0)
    : 0;
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(event.target as Node)) setShowSupport(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) setShowLanguage(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setShowNotification(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { removeToken(); navigate("/"); };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Top Strip */}
      <div className="bg-blue-800 text-white fixed top-0 left-0 right-0 z-[10001] text-xs w-full px-6 md:px-10 py-2 flex justify-between items-center">
        <span className="font-medium tracking-wide">
          Your Safety — Our priority{" "}
          <Link to="/safety-info" className="text-blue-300 hover:text-white underline underline-offset-2 ml-1">
            Click to know more »
          </Link>
        </span>
        <div className="relative" ref={supportRef}>
          <button
            onClick={() => { setShowSupport(!showSupport); setShowProfile(false); }}
            className="flex items-center gap-1.5 bg-white/10 border border-white/25 px-3 py-1.5 rounded-md text-[11.5px] font-semibold hover:bg-white/20 transition"
          >
            Customer Support <ChevronDown size={12} />
          </button>
          {showSupport && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-[10000] overflow-visible animate-in">
              {[{ to: "/helpcenter", label: "Help Center" }, { to: "/trackrequest", label: "Track Request" }, { to: "/raisecomplaint", label: "Raise Complaint" }, { to: "/contactus", label: "Contact Us" }].map(({ to, label }) => (
                <Link key={to} to={to} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">{label}</Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Navbar */}
      <nav
        className={`bg-white w-full fixed top-[33px] left-0 right-0 z-[999] border-b border-slate-200 ${
          scrolled ? "shadow-[0_4px_20px_rgba(37,99,235,0.10)]" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 md:px-10 h-[70px]">
          {/* Logo */}
          <Link to="/" className="text-[22px] font-extrabold tracking-tight flex items-end gap-0.5">
            <span className="text-blue-600">Rap</span>
            <span className="text-slate-900">port</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-2.5 ml-0.5" />
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-3 py-1.5 rounded-lg text-[12.5px] font-semibold tracking-widest transition-all duration-150 ${
                  isActive(to)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {label}
                {isActive(to) && (
                  <span className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 w-7 h-[3px] bg-blue-600 rounded-t-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">

            {/* ── Cart Icon (only when logged in) ── */}
            {token && (
              <button
                onClick={() => navigate("/cart")}
                className="relative w-[38px] h-[38px] flex items-center justify-center rounded-xl border-[1.5px] border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition"
                title="Cart"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] min-w-[17px] h-[17px] flex items-center justify-center rounded-full border-2 border-white font-bold px-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification */}
            {token && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="w-[38px] h-[38px] flex items-center justify-center rounded-xl border-[1.5px] border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition relative"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] min-w-[17px] h-[17px] flex items-center justify-center rounded-full border-2 border-white font-bold px-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotification && (
                  <div className="absolute right-0 mt-2 w-[290px] bg-white border-[1.5px] border-slate-200 rounded-2xl shadow-xl z-50 overflow-visible">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[13.5px] font-bold text-slate-900">Notifications</span>
                      <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">Mark as all read</span>
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 && (
                        <li className="px-4 py-6 text-slate-400 text-center text-sm">No notifications</li>
                      )}
                      {notifications.map((n: any) => (
                        <li
                          key={n._id}
                          onClick={() => markRead(n._id)}
                          className={`px-4 py-3 cursor-pointer flex gap-3 items-start hover:bg-slate-50 transition ${!n.isRead ? "bg-blue-50/70" : ""}`}
                        >
                          {!n.isRead
                            ? <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            : <span className="w-2 shrink-0" />}
                          <div>
                            <p className={`text-slate-800 text-[13px] leading-snug ${!n.isRead ? "font-semibold" : ""}`}>{n.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Language */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setShowLanguage(!showLanguage)}
                className="flex items-center gap-1.5 border-[1.5px] border-slate-200 px-3 h-[38px] rounded-xl text-[12px] font-bold text-slate-600 tracking-wider hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition"
              >
                <Globe size={14} className="text-blue-600" />
                {language}
                <ChevronDown size={12} />
              </button>
              {showLanguage && (
                <div className="absolute right-0 mt-2 w-32 bg-white border-[1.5px] border-slate-200 rounded-2xl shadow-xl z-50 overflow-visible">
                  {[["EN", "English"], ["HI", "Hindi"], ["ES", "Spanish"]].map(([code, label]) => (
                    <span
                      key={code}
                      onClick={() => { setLanguage(code); setShowLanguage(false); }}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Profile or Login */}
            {token ? (
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setShowProfile(!showProfile)}
                  className="w-[38px] h-[38px] rounded-full overflow-hidden cursor-pointer border-[2.5px] border-blue-600 hover:ring-4 hover:ring-blue-100 transition"
                >
                  <img src="https://i.pravatar.cc/100" alt="profile" className="w-full h-full object-cover" />
                </div>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border-[1.5px] border-slate-200 z-50 overflow-visible">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[13.5px] font-bold text-slate-900">{me?.fullName || "User"}</p>
                      <p className="text-[11px] text-slate-400">{me?.email || "Account"}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition">
                      <User size={14} /> View Profile
                    </Link>
                    <div className="border-t border-slate-100 mt-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="px-5 h-[38px] rounded-xl bg-blue-600 text-white text-[13px] font-bold tracking-wide hover:bg-blue-700 transition"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </nav>

      <Toaster position="top-center" containerStyle={{ top: 80 }} />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-[420px] p-8 rounded-2xl shadow-2xl relative">
            <button onClick={() => { setShowModal(false); setIsForgot(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition">
              <X size={20} />
            </button>
            {isForgot ? (
              <>
                <h2 className="text-xl font-bold text-blue-600 text-center mb-6">Forgot Password</h2>
                <ForgotPasswordForm onSuccess={() => { setShowModal(false); setIsForgot(false); }} />
              </>
            ) : (
              <>
                <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
                  <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${isLogin ? "bg-blue-100 text-blue-700" : "text-slate-500"}`}>Login</button>
                  <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${!isLogin ? "bg-blue-100 text-blue-700" : "text-slate-500"}`}>Signup</button>
                </div>
                {isLogin ? <LoginForm onSuccess={() => setShowModal(false)} /> : <RegisterForm onSuccess={() => setShowModal(false)} />}
                {isLogin && (
                  <div className="text-right mt-3">
                    <span onClick={() => setIsForgot(true)} className="text-sm text-slate-500 cursor-pointer hover:text-blue-600 hover:underline">
                      Forgot Password?
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;