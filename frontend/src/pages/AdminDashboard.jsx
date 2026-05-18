import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Package, ShoppingCart, BarChart3, TrendingUp, DollarSign, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { API_BASE } from "../api/config";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]   = useState({ employees: 0, customers: 0, suppliers: 0, branches: 0, payrolls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const h = { headers: authHeader() };
    Promise.allSettled([
      fetch(`${API_BASE}/employees`, h).then(r => r.json()),
      fetch(`${API_BASE}/customers`, h).then(r => r.json()),
      fetch(`${API_BASE}/suppliers`, h).then(r => r.json()),
      fetch(`${API_BASE}/branches`, h).then(r => r.json()),
      fetch(`${API_BASE}/employees/payrolls`, h).then(r => r.json()),
    ]).then(([emps, custs, supps, brs, pays]) => {
      setStats({
        employees: emps.status  === "fulfilled" ? (emps.value.employees  || []).length : 0,
        customers: custs.status === "fulfilled" ? (Array.isArray(custs.value) ? custs.value : custs.value.customers || []).length : 0,
        suppliers: supps.status === "fulfilled" ? (Array.isArray(supps.value) ? supps.value : supps.value.suppliers || []).length : 0,
        branches:  brs.status   === "fulfilled" ? (brs.value.branches   || []).length : 0,
        payrolls:  pays.status  === "fulfilled" ? (pays.value.payrolls  || []).length : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Employees",   value: stats.employees, icon: Users,        color: "bg-indigo-500",  to: "/admin/employees" },
    { label: "Customers",   value: stats.customers, icon: FileText,     color: "bg-emerald-500", to: "/admin/customers" },
    { label: "Suppliers",   value: stats.suppliers, icon: ShoppingCart, color: "bg-amber-500",   to: "/admin/suppliers" },
    { label: "Branches",    value: stats.branches,  icon: Building2,    color: "bg-purple-500",  to: "/branches"        },
    { label: "Salary Recs", value: stats.payrolls,  icon: DollarSign,   color: "bg-rose-500",    to: "/employees/salary-history" },
    { label: "Stock",       value: "View",          icon: Package,      color: "bg-teal-500",    to: "/admin/stock"     },
  ];

  const barData = [
    { name: "HR",        value: stats.employees },
    { name: "Customers", value: stats.customers },
    { name: "Suppliers", value: stats.suppliers },
    { name: "Branches",  value: stats.branches  },
    { name: "Payrolls",  value: stats.payrolls  },
  ];

  const pieData = [
    { name: "Employees", value: stats.employees || 1 },
    { name: "Customers", value: stats.customers || 1 },
    { name: "Suppliers", value: stats.suppliers || 1 },
    { name: "Branches",  value: stats.branches  || 1 },
  ];

  const activities = [
    "New invoice generated",
    "Inventory updated: +10 units",
    "New employee added",
    "Salary processed for this month",
    "New customer registered",
  ];

  return (
    <div className="erp-page animate-fadeIn space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-sky-500 text-white px-6 py-5 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <p className="text-indigo-100 text-sm mt-1">System-wide statistics and controls</p>
        </div>
        <BarChart3 size={36} className="text-white opacity-80" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 stagger">
        {statCards.map(c => (
          <button
            key={c.label}
            onClick={() => navigate(c.to)}
            className="erp-card p-4 flex flex-col items-start gap-3 hover:scale-105 transition-transform duration-200 animate-fadeIn text-left"
          >
            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow`}>
              <c.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-800">{loading ? "…" : c.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="erp-card p-5 animate-slideInLeft">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-500" /> Module Overview
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="erp-card p-5 animate-slideInRight">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" /> Distribution
          </h2>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {pieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-slate-600">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[i] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity + Quick Nav */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="erp-card p-5 animate-slideInLeft">
          <h2 className="font-semibold text-slate-700 mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {activities.map((item, i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 transition text-sm text-slate-700">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="erp-card p-5 animate-slideInRight">
          <h2 className="font-semibold text-slate-700 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Employees",       to: "/admin/employees"     },
              { label: "Customers",       to: "/admin/customers"     },
              { label: "Suppliers",       to: "/admin/suppliers"     },
              { label: "Branches",        to: "/branches"            },
              { label: "Salary History",  to: "/employees/salary-history" },
              { label: "Payroll",         to: "/employees/payroll"   },
              { label: "Journal",         to: "/accounting/journal"  },
              { label: "Stock",           to: "/admin/stock"         },
            ].map(a => (
              <button
                key={a.to}
                onClick={() => navigate(a.to)}
                className="text-left px-3 py-2.5 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition text-sm text-indigo-600 font-medium flex items-center justify-between"
              >
                {a.label} <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
