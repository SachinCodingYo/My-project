import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex min-h-screen text-white relative bg-[#020617] w-full max-w-full overflow-x-hidden">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-full ${collapsed ? "md:w-16" : "md:w-64"}transform transition-all duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar collapsed={collapsed} closeMobile={() => setMobileOpen(false)} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden transition-all duration-300 ${collapsed ? "md:ml-16" : "md:ml-64"}`}
      >

        <Navbar
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AppLayout;