import React, { useState } from "react";
import { Search, Bell } from "lucide-react";

const AdminTopBar = ({
  searchPlaceholder = "Search ...",
  onSearch,
  notificationCount = 3
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header
      className="
      bg-white
      px-5
      py-3
      border-b
      border-gray-100
      flex
      items-center
      justify-between
      gap-4
      min-h-[72px]
      "
    >

      {/* Search */}
      <div className="relative flex-1 max-w-[550px]">

        <Search
          className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
          w-5
          h-5
          "
        />

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="
          w-full
          bg-[#F4F9F9]
          rounded-full
          py-2.5
          pl-12
          pr-4
          text-sm
          outline-none
          focus:ring-2
          focus:ring-[#2A3EB1]/20
          transition
          "
        />

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button
          onClick={() =>
            alert(
              `You have ${notificationCount} new notifications!`
            )
          }
          className="
          relative
          p-2
          rounded-full
          hover:bg-gray-100
          transition
          "
        >

          <Bell
            size={22}
            className="text-gray-500"
          />

          {notificationCount > 0 && (
            <span
              className="
              absolute
              top-1
              right-1
              w-4
              h-4
              bg-red-500
              rounded-full
              flex
              items-center
              justify-center
              text-[10px]
              text-white
              font-bold
              "
            >
              {notificationCount > 9
                ? "9+"
                : notificationCount}
            </span>
          )}

        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">

          <img
            src="/src/assets/teacher.jpg"
            alt="Profile"
            className="
            w-10
            h-10
            rounded-full
            object-cover
            "
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100";
            }}
          />

          <div>

            <h4
              className="
              font-semibold
              text-sm
              text-gray-800
              "
            >
              Shree
            </h4>

            <p
              className="
              text-xs
              text-gray-400
              "
            >
              Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminTopBar;