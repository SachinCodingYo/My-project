import { Menu, Bell, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store";
import { useUserProfile } from "../../hooks/useUserProfile";

type Props = {
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
};

const Navbar = ({ toggleSidebar, toggleMobileSidebar }: Props) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: user } = useUserProfile();
  const navigate = useNavigate();

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.fullName ?? "")
    .split(" ")
    .map((n: string) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between bg-[#0f172a] p-4 text-white border-b border-gray-800">

      {/* Mobile menu */}
      <button onClick={toggleMobileSidebar} className="md:hidden">
        <Menu size={22} />
      </button>

      {/* Desktop sidebar toggle */}
      <button onClick={toggleSidebar} className="hidden md:block">
        <Menu />
      </button>

      <div className="flex items-center gap-4">

        <input
          placeholder="Search orders, SIMs..."
          className="hidden md:block bg-black text-sm px-4 py-2 rounded-lg outline-none w-64"
        />

        <Bell />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {user?.image ? (
              <img
                src={user.image}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                {initials}
              </div>
            )}

            <div className="text-sm hidden sm:block">
              <div>{user?.fullName ?? ""}</div>
              <div className="text-gray-400 text-xs">
                {user?.role}
              </div>
            </div>
          </div>

          {/* Dropdown */}
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg z-50">

              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-600/20 cursor-pointer"
                onClick={() => {
                  setOpenDropdown(false);
                  // console.log("Go to profile");
                  navigate("/profile")
                }}
              >
                <User size={16} />
                Profile
              </div>

              <div
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-600/20 cursor-pointer text-red-400"
              >
                <LogOut size={16} />
                Logout
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;