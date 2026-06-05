import React, { useState } from "react";
import { Search, Bell } from "lucide-react";

const TeacherTopBar = ({ onSearch, notificationCount = 0 }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <header className="bg-white p-4 lg:px-8 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 w-full">
      
      {/* 1. Search Bar - Takes full width on mobile, 40% on desktop */}
      <div className="relative w-full lg:w-[40%] order-1 lg:order-none">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full bg-[#F4F9F9] rounded-full py-2.5 pl-12 pr-4 outline-none text-sm border border-transparent focus:border-[#E59B33] transition-all"
        />
      </div>

      {/* 2. Right-Side Account Identity */}
      <div className="flex items-center gap-4 sm:gap-6 order-2">
        
        {/* Notification Icon */}
        <button className="relative text-gray-600 hover:text-[#E59B33] transition-colors">
          <Bell size={22} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User Identity - Hidden on extra small phones if needed, or stays compact */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <h4 className="font-bold text-gray-900 text-sm leading-tight">Girija</h4>
            <p className="text-gray-500 text-xs font-medium">Teacher</p>
          </div>
          <img 
            src="/src/assets/teacher.jpg" 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200" 
            alt="Teacher" 
          />
        </div>
      </div>
    </header>
  );
};

export default TeacherTopBar;