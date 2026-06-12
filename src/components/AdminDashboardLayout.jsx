import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F4FAFA] min-h-screen">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="lg:ml-72">

        {/* Mobile Menu */}
        <div className="lg:hidden bg-white p-3">
          <button
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>
        </div>

        {/* Fixed Topbar */}
        <div className="fixed top-0 left-0 right-0 lg:left-72 z-20">
          <AdminTopBar
            searchPlaceholder="Search school metrics, logs, indices..."
          />
        </div>

        {/* Page */}
        <main
          className="
          pt-[90px]
          p-6
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminDashboardLayout;