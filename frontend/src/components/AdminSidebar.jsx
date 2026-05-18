// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md mb-1 ${
      isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-60 bg-white border-r p-4 overflow-y-auto" style={{ height: "100vh" }}>
      <h3 className="text-xs text-gray-500 uppercase mb-3">Home</h3>
      <nav>
        <NavLink to="/dashboard" className={linkClass}>🏠 Dashboard</NavLink>
        <NavLink to="/admin-dashboard" className={linkClass}>📊 Admin Overview</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">User Setting</h3>
      <nav>
        <NavLink to="/admin/user-types" className={linkClass}>User Types</NavLink>
        <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Companies</h3>
      <nav>
        <NavLink to="/admin/companies" className={linkClass}>Companies</NavLink>
        <NavLink to="/admin/company-registration" className={linkClass}>Company Registration</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Account Setting</h3>
      <nav>
        <NavLink to="/admin/account-heads" className={linkClass}>Account Heads</NavLink>
        <NavLink to="/admin/account-controls" className={linkClass}>Account Controls</NavLink>
        <NavLink to="/admin/account-sub-controls" className={linkClass}>Account Sub Controls</NavLink>
        <NavLink to="/admin/account-flows" className={linkClass}>Account Flow</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Financial Year</h3>
      <nav>
        <NavLink to="/admin/financial-years" className={linkClass}>Financial Years</NavLink>
        <NavLink to="/admin/financial-years/new" className={linkClass}>New Financial Year</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Suppliers</h3>
      <nav>
        <NavLink to="/admin/suppliers" className={linkClass}>All Suppliers</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Customers</h3>
      <nav>
        <NavLink to="/admin/customers" className={linkClass}>All Customers</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Branches</h3>
      <nav>
        <NavLink to="/branches" className={linkClass}>Branches</NavLink>
        <NavLink to="/branch-users" className={linkClass}>Branch Users</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Employees</h3>
      <nav>
        <NavLink to="/admin/employees" className={linkClass}>Manage Employees</NavLink>
        <NavLink to="/employees" className={linkClass}>Employee Registration</NavLink>
        <NavLink to="/employees/payroll" className={linkClass}>Payroll</NavLink>
        <NavLink to="/employees/salary-history" className={linkClass}>Paid Salaries History</NavLink>
      </nav>

      <h3 className="text-xs text-gray-500 uppercase mt-6 mb-3">Stock</h3>
      <nav>
        <NavLink to="/admin/stock" className={linkClass}>Stock Categories</NavLink>
      </nav>
    </aside>
  );
}
