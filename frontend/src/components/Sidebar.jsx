import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  FileText,
  LogOut,
} from "lucide-react"; // modern icon set

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* --- Sidebar Header --- */}
      <div className="sidebar-header">SmartERP</div>

      {/* --- Navigation Links --- */}
      <ul className="sidebar-nav">
        <li>
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/hr"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Users size={18} />
            <span>HR Management</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/finance"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FileText size={18} />
            <span>Finance</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Package size={18} />
            <span>Inventory</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/sales"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <ShoppingCart size={18} />
            <span>Sales</span>
          </NavLink>
        </li>
      </ul>

      {/* --- Logout Button --- */}
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
