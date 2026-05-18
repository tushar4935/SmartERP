// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Home, Archive } from "lucide-react";

/*
  Sidebar: fixed left. Props:
   - collapsed: boolean (not used here, but Layout handles width)
   - mobileOpen: boolean -> show as overlay on mobile
   - onCloseMobile: function to close mobile sidebar
  Menu items below follow your provided structure. You can extend the MENU array later.
*/

const MENU = [
  // main navigation
  {
    section: "Home",
    items: [
      { to: "/dashboard",        label: "Dashboard",        icon: LayoutDashboard },
      { to: "/admin-dashboard",  label: "Admin Overview",   icon: LayoutDashboard },
    ],
  },

  // sub branches
  {
    section: "Sub Branchs",
    items: [
      { to: "/branches", label: "Branch's", icon: Home },
      { to: "/branch-users", label: "Users", icon: Users },
    ],
  },

  // employees
  {
    section: "Employee's",
    items: [
      { to: "/employees", label: "Employee Registration", icon: Users },
      { to: "/employees/payroll", label: "Payroll", icon: Archive },
      { to: "/employees/salary-history", label: "Paid Salaries History", icon: Archive },
    ],
  },

  // stock
  {
    section: "Stock",
    items: [{ to: "/admin/stock", label: "Stock Categories", icon: Archive }],
  },

  // (you can add "and so on" later)

  {
  label: "Supplier's",
  children: [
    {
      label: "New Supplier's",
      path: "/suppliers/new",
    },
    {
      label: "Branch Supplier's",
      path: "/suppliers/branch",
    },
    {
      label: "Sub Branch Supplier's",
      path: "/suppliers/sub-branch",
    },
  ],
},




];

export default function Sidebar({ collapsed = false, mobileOpen = false, onCloseMobile = () => {} }) {
  // simple class to control width from Layout
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed top-16 left-0 h-[calc(100vh-64px)] w-60 bg-white border-r shadow-sm flex-col z-20 overflow-auto`}
      >
        <div className="px-4 py-3">
          {MENU.map((group) => (
            <div key={group.section} className="mb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">{group.section}</div>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-slate-700 hover:bg-slate-50 ${
                          isActive ? "bg-sky-600 text-white" : ""
                        }`
                      }
                      end
                    >
                      <item.icon size={16} />
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-auto p-4 border-t">
          <button
            className="w-full text-sm text-left px-3 py-2 rounded-md hover:bg-slate-50"
            onClick={() => {
              // logout action: local cleanup and navigation (optional)
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black opacity-30" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-16 bottom-0 w-64 bg-white border-r shadow z-50 overflow-auto">
            <div className="p-4">
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Main Navigation</div>
                <NavLink to="/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 px-3 py-2 rounded-md">
                  <LayoutDashboard size={16} />
                  <span className="text-sm">Dashboard</span>
                </NavLink>
              </div>

              {MENU.map((group) => (
                <div key={group.section} className="mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-2">{group.section}</div>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={onCloseMobile}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-700 hover:bg-slate-50"
                        >
                          <item.icon size={16} />
                          <span className="text-sm">{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-4">
                <button
                  className="w-full text-sm text-left px-3 py-2 rounded-md hover:bg-slate-50"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
