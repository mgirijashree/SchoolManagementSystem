import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  Wallet,
  MessageSquare,
  BarChart3,
  Folder,
  Settings,
  CheckSquare,
  LogOut,
  X
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {

  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { label: "User Management", path: "/user-management", icon: <Users /> },
    { label: "Academic", path: "/academic", icon: <BookOpen /> },
    { label: "Attendance", path: "/attendance", icon: <CalendarCheck /> },
    { label: "Fees", path: "/fees", icon: <Wallet /> },
    { label: "Communication", path: "/communication", icon: <MessageSquare /> },
    { label: "Reports", path: "/reports", icon: <BarChart3 /> },
    { label: "Documents", path: "/documents", icon: <Folder /> },
    { label: "Settings", path: "/settings", icon: <Settings /> },
    { label: "Approvals", path: "/approvals", icon: <CheckSquare /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
   

      {/* 2. MOBILE BACKGROUND DIM OVERLAY */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. RESPONSIVE SIDEBAR SHELL (NO INNER SCROLL) */}
      <aside
        className={`
        fixed
        top-0
        left-0
        h-screen
        w-72
        bg-[#E59B33]
        text-white
        flex
        flex-col
        justify-between
        z-50

        transform
        transition-transform
        duration-300

        ${isOpen ? "translate-x-0" : "-translate-x-full"}

        lg:translate-x-0
        `}
        >
        {/* Main Wrapper: Takes up all available space above footer */}
        <div className="flex flex-col flex-1 min-h-0">
          
          {/* Branding Header Panel */}
          <div className="p-6 flex items-center justify-between gap-3 border-b border-white/10 lg:border-none flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-wide">EDUSMART</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Container: Scaled to fill height cleanly without overflow */}
          <nav
            className="
            flex-1
            overflow-y-auto
            px-4
            py-4
            space-y-2
            "
            >
            {navItems.map((item) => {
              const isActivePath = location.pathname === item.path;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-2 rounded-xl font-medium text-base transition-all duration-150 flex-1 flex items-center ${
                      isActive
                        ? "bg-black/15 text-white shadow-inner border-l-4 border-white font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {React.cloneElement(item.icon, { 
                    className: `w-5 h-5 flex-shrink-0 ${isActivePath ? "text-white" : "text-white/70"}` 
                  })}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Account Profile Footer Section */}
        <div className="p-4 border-t border-white/10 bg-[#D48A25]/30 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
              <img
                src="/src/assets/teacher.jpg"
                alt="User profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<span class="font-bold text-sm text-white">SJ</span>`;
                }}
              />
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">Shree</p>
              <p className="text-xs text-white/70">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/20 transition text-sm font-medium bg-white/5 border border-white/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      
    </>
  );
};

export default AdminSidebar;