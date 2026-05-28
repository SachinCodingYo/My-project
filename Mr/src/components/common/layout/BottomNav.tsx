import { House, MapPinned, Package, User, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_ROUTES } from "../../../constants/routes";

const navItems = [
  { to: APP_ROUTES.dashboard, label: "Home", icon: House },
  { to: APP_ROUTES.earnings, label: "Earnings", icon: Wallet },
  { to: APP_ROUTES.orders, label: "Orders", icon: Package },
  { to: APP_ROUTES.map, label: "Map", icon: MapPinned },
  { to: APP_ROUTES.profile, label: "Profile", icon: User },
];

const BottomNav = () => {
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition",
                isActive ? "bg-brand-50 text-brand-700" : "text-slate-500",
              ].join(" ")
            }
          >
            <Icon className="mb-1 h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
