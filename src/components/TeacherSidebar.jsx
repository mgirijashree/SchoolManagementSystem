import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Calendar, 
  BookOpen, LogOut, Menu, X 
} from "lucide-react";

const TeacherSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. REMOVED Settings from navItems
  const navItems = [
    { label: "Dashboard", path: "/teacher/dashboard", icon: <LayoutDashboard /> },
    { label: "My Classes", path: "/teacher/classes", icon: <Users /> },
    { label: "Students", path: "/teacher/students", icon: <Users /> },
    { label: "Attendance", path: "/teacher/attendance", icon: <Calendar /> },
    { label: "Exams & Marks", path: "/teacher/exams", icon: <BookOpen /> },
    { label: "Messages", path: "/teacher/messages", icon: <Users /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* ... (Keep your Mobile Toggle Bar as is) ... */}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#2A3EB1] text-white flex flex-col justify-between z-50 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-6 flex items-center justify-between gap-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl"><BookOpen className="w-6 h-6" /></div>
              <span className="text-2xl font-bold tracking-wide">EDUSMART</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 flex flex-col gap-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive ? "bg-black/15 text-white border-l-4 border-white" : "text-white/80 hover:bg-white/10"
                  }`
                }
              >
                {React.cloneElement(item.icon, { size: 20 })}
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* 2. ADDED LOGOUT BUTTON INSIDE NAVIGATION */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3.5 px-4 py-3 mt-2 rounded-xl font-medium text-white/80 hover:bg-red-500/20 transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-white/10 bg-[#D48A25]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">SJ</div>
            <div>
              <p className="font-semibold text-sm">Girija</p>
              <p className="text-xs text-white/70">Teacher</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;