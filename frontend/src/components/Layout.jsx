// src/components/Layout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";          // Client sidebar
import AdminSidebar from "./AdminSidebar"; // Admin sidebar
import Navbar from "./Navbar";

export default function Layout() {
  // Read user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ------------------------- */}
      {/* Sidebar (Role-based)      */}
      {/* ------------------------- */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-40">
        {isAdmin ? <AdminSidebar /> : <Sidebar />}
      </aside>

      {/* ------------------------- */}
      {/* Main Content Wrapper      */}
      {/* ------------------------- */}
      <div className="flex flex-col flex-1 ml-64">

        {/* Navbar (fixed top, full width minus sidebar) */}
        <header className="fixed top-0 left-64 right-0 z-30">
          <Navbar />
        </header>

        {/* Main content (scrollable area) */}
        <main className="mt-16 p-6 overflow-y-auto min-h-[calc(100vh-64px)] bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
