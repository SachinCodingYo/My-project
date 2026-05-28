import { useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../utils/logout";
import { navLinks } from "../../constant/NavRoutes";

type Props = {
    collapsed: boolean;
    closeMobile?: () => void;
};

const Sidebar = ({ collapsed, closeMobile }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (name: string) => {
        setOpenMenu(openMenu === name ? null : name);
    };

    return (
        <div
            className={`bg-[#0f172a] text-gray-300 h-dvh p-4 flex flex-col transition-all duration-300 overflow-y-auto hide-scrollbar overflow-x-hidden ${collapsed ? "w-16" : "w-64"}`}
        >
            <div className="flex items-center justify-between mb-6 md:hidden">
                <div className="text-white font-semibold">TeleLink</div>

                <button onClick={closeMobile}>
                    <Icons.X size={20} />
                </button>
            </div>
            {/* Logo */}
            <div className="hidden md:flex mb-8 items-center gap-2 justify-center md:justify-start">
    <img
        src="/logo.png"
        alt="Logo"
        className={`${collapsed ? "w-8 h-8" : "w-8 h-8"}`}
    />
    {!collapsed && <span className="text-white font-semibold text-lg">TeleLink</span>}
</div>

            <ul className="space-y-2 flex-1 pr-1 overflow-y-auto hide-scrollbar overflow-x-hidden">
                {navLinks.map((item) => {
                    const Icon = Icons[item.icon as keyof typeof Icons] as LucideIcon;

                    const isChildActive =
                        item.children?.some((child) => location.pathname === child.path) ??
                        false;

                    const isOpen = openMenu === item.name || isChildActive;

                    // ---------------- DROPDOWN MENU ----------------
                    if (item.children) {
                        return (
                            <li key={item.name}>
                                <div
                                    onClick={() => !collapsed && toggleMenu(item.name)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer relative ${isChildActive
                                        ? "bg-indigo-600 text-white"
                                        : isOpen
                                            ? "bg-indigo-600/40 text-white"
                                            : "hover:bg-indigo-600/20"}
`}
                                >
                                    {/* Left active indicator */}
                                    {isChildActive && (
                                        <span className="absolute left-0 top-0 h-full w-1 bg-indigo-400 rounded-r" />
                                    )}

                                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                                        <Icon size={18} />
                                        {!collapsed && <span>{item.name}</span>}
                                    </div>

                                    {!collapsed && (
                                        <Icons.ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                </div>

                                {!collapsed && isOpen && (
                                    <ul className="ml-8 mt-2 space-y-2 text-sm">
                                        {item.children.map((child) => {
                                            const ChildIcon = Icons[child.icon as keyof typeof Icons] as LucideIcon;

                                            const active = location.pathname === child.path;

                                            return (
                                                <li
                                                    key={child.name}
                                                    onClick={() => navigate(child.path!)}
                                                    className={`flex items-center gap-3 p-2 rounded cursor-pointer relative
        ${active
                                                            ? "bg-indigo-600 text-white"
                                                            : "hover:bg-indigo-600/20"
                                                        }`}
                                                >
                                                    {/* Left active indicator */}
                                                    {active && (
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-indigo-400 rounded-r" />
                                                    )}
                                                    <ChildIcon size={16} className="text-indigo-400" />
                                                    {child.name}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    }

                    // ---------------- NORMAL MENU ----------------
                    const active = location.pathname === item.path;

                    return (
                        <li
                            key={item.name}
                            onClick={() => {
                                navigate(item.path!);
                                closeMobile?.();
                            }}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer relative
              ${active
                                    ? "bg-indigo-600 text-white"
                                    : "hover:bg-indigo-600/20"
                                }`}
                        >
                            {/* Left active indicator */}
                            {active && (
                                <span className="absolute left-0 top-0 h-full w-1 bg-indigo-400 rounded-r" />
                            )}

                            <Icon size={18} />
                            {!collapsed && <span>{item.name}</span>}
                        </li>
                    );
                })}
            </ul>

            {/* Bottom Section */}
            <div className="mt-auto pt-1 space-y-3">
                <div onClick={() => { navigate("/settings"); closeMobile?.(); }} className="flex items-center gap-3 p-2 hover:bg-indigo-600/20 rounded-lg cursor-pointer">
                    <Icons.Settings size={18} />
                    {!collapsed && "Settings"}
                </div>

                <div
                    onClick={logout}
                    className="flex items-center gap-3 p-2 hover:bg-red-600/20 rounded-lg cursor-pointer"
                >
                    <Icons.LogOut size={18} />
                    {!collapsed && "Logout"}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;