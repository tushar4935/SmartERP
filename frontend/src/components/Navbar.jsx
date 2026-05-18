// src/components/Navbar.jsx
import React from "react";
import { Bell } from "lucide-react";

/*
  Navbar: fixed height, shadow, right-side user info + notification.
  Uses local uploaded screenshot as logo (update path if needed).
*/
const Navbar = ({ onToggleSidebar, onOpenMobile }) => {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin", role: "admin" };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-30 flex items-center justify-between px-4">
      {/* left: menu toggle + brand */}
      <div className="flex items-center gap-3">
        {/* desktop toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* mobile menu button */}
        <button
          onClick={onOpenMobile}
          className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-sky-500 flex items-center justify-center shadow-md hidden sm:flex">
            <span className="text-white font-bold text-sm">SE</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">SmartERP</span>
            <small className="text-xs text-slate-500">Control Panel</small>
          </div>
        </div>
      </div>

      {/* right: search, notifications, user */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm px-2 py-2 w-56"
          />
        </div>

        <div className="relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-600 rounded-full">3</span>
        </div>

        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" alt="avatar" className="w-9 h-9 rounded-full border" />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
            <span className="text-xs text-slate-500">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
