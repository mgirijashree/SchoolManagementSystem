import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F4FAFA] min-h-screen">
      
      {/* Sidebar - Controlled by sidebarOpen state */}
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Container */}
      <div className="flex flex-col lg:ml-72 min-h-screen">

        {/* FIXED HEADER CONTAINER 
          This combines the Mobile Menu and TopBar into one consistent fixed area
        */}
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-20 bg-white border-b border-gray-200">
          <div className="flex items-center px-4 py-2">
            {/* Mobile Hamburger - Only visible on small screens */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            {/* TopBar Component */}
            <div className="flex-1">
              <AdminTopBar searchPlaceholder="Search school metrics, logs, indices..." />
            </div>
          </div>
        </header>

        {/* Main Content - pt-[60px] or [70px] depending on your TopBar height */}
        <main className="pt-[70px] p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;