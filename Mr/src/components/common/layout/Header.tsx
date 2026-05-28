import { Bell, LogOut, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { getInitials } from "../../../utils/format";
import { useState, useRef, useEffect } from "react";
import { logout } from "../../../utils/logout";
import { useUnreadCount } from "../../../hooks/useNotifications";
import { APP_ROUTES } from "../../../constants/routes";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useAppSelector((state) => state.auth.profile);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = useUnreadCount();
  const pageTitle = location.pathname.startsWith("/orders/")
    ? "Order Details"
    : ({
        "/dashboard": "Dashboard",
        "/earnings": "Earnings",
        "/orders": "My Orders",
        "/map": "Live Map",
        "/history": "History",
        "/notifications": "Notifications",
        "/profile": "Profile",
        "/change-password": "Change Password",
      }[location.pathname] ?? "MR Panel");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white">
          MR
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{pageTitle}</div>
          <div className="text-xs text-slate-500">Field delivery workspace</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(APP_ROUTES.notifications)}
          className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 hover:bg-brand-200 transition-colors"
          >
            {getInitials(profile?.fullName)}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50">
              {/* Profile Header */}
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">
                  {profile?.fullName}
                </div>
                <div className="text-xs text-slate-500">{profile?.mobile}</div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
