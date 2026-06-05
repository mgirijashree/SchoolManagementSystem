import React, { useState } from "react";
import { Search, Bell } from "lucide-react";

const AdminTopBar = ({ 
  searchPlaceholder = "Search ...", 
  onSearch, 
  notificationCount = 3 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Keystroke Search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Trigger callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 shadow-xs">
      {/* Search Input Bar */}
      <div className="relative w-full sm:w-[50%]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="w-full bg-[#F4F9F9] rounded-full py-2.5 pl-12 pr-4 outline-none text-sm focus:ring-2 focus:ring-[#E59B33]/20 transition-all"
        />
      </div>

      {/* Right-Side Dashboard Controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
        {/* Alerts Center Notification */}
        <button 
          onClick={() => alert(`You have ${notificationCount} new notifications!`)}
          className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
        >
          <Bell size={22} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Admin Personal Context */}
        <div className="flex items-center gap-3">
          <img 
            src="./src/assets/teacher.jpg" 
            className="w-10 h-10 rounded-full object-cover" 
            alt="User Profile" 
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100";
            }}
          />
          <div>
            <h4 className="font-bold text-gray-800 text-sm leading-tight">Shree</h4>
            <p className="text-gray-400 text-xs font-medium">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;