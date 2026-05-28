import {
  LayoutDashboard,
  MapPinned,
  Package,
  History,
  User,
  KeyRound,
  LogOut,
  Bell,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../../../constants/routes";
import { logout } from "../../../utils/logout";
import { useUnreadCount } from "../../../hooks/useNotifications";

const navItems = [
  { to: APP_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { to: APP_ROUTES.earnings, label: "Earnings", icon: Wallet },
  { to: APP_ROUTES.orders, label: "My Orders", icon: Package },
  { to: APP_ROUTES.map, label: "Live Map", icon: MapPinned },
  { to: APP_ROUTES.history, label: "History", icon: History },
  { to: APP_ROUTES.notifications, label: "Notifications", icon: Bell },
  { to: APP_ROUTES.profile, label: "Profile", icon: User },
  { to: APP_ROUTES.changePassword, label: "Change Password", icon: KeyRound },
];

const Sidebar = () => {
  const unreadCount = useUnreadCount();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 font-bold text-white">
          MR
        </div>
        <div>
          <div className="font-semibold text-slate-900">MR Panel</div>
          <div className="text-xs text-slate-500">SIM delivery ops</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {to === APP_ROUTES.notifications && unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
