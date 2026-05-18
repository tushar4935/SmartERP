import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Package, ShoppingCart, TrendingUp, Building2,
  Truck, UserCheck, DollarSign, ArrowUpRight, ArrowDownRight,
  BarChart3, ClipboardList, Clock, CheckCircle2
} from "lucide-react";
import { API_BASE } from "../api/config";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function StatCard({ label, value, icon: Icon, color, sub, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm p-5 flex items-start justify-between border-l-4 ${color} hover:shadow-md transition cursor-pointer`}
    >
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs mt-2 ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{Math.abs(trend)}% this month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full text-white ${color.replace("border-", "bg-").replace("-500","").concat("-100").replace("100","500")}`} style={{ background: "inherit" }}>
        <div className="p-2 rounded-xl bg-slate-100">
          <Icon size={22} className="text-slate-600" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ label, to, icon: Icon, color }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 ${color} hover:shadow-md transition w-full text-center`}
    >
      <Icon size={24} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  const [stats, setStats] = useState({
    employees: 0, customers: 0, suppliers: 0, branches: 0,
    stockItems: 0, payrolls: 0
  });
  const [recentPayrolls, setRecentPayrolls]   = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentSuppliers, setRecentSuppliers] = useState([]);
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
      const employees  = emps.status  === "fulfilled" ? (emps.value.employees  || []) : [];
      const customers  = custs.status === "fulfilled" ? (custs.value.customers || custs.value || []) : [];
      const suppliers  = supps.status === "fulfilled" ? (supps.value.suppliers || supps.value || []) : [];
      const branches   = brs.status   === "fulfilled" ? (brs.value.branches   || []) : [];
      const payrolls   = pays.status  === "fulfilled" ? (pays.value.payrolls  || []) : [];

      setStats({
        employees: employees.length,
        customers: Array.isArray(customers) ? customers.length : 0,
        suppliers: Array.isArray(suppliers) ? suppliers.length : 0,
        branches:  branches.length,
        stockItems: 0,
        payrolls: payrolls.length,
      });
      setRecentPayrolls(payrolls.slice(0, 5));
      setRecentCustomers((Array.isArray(customers) ? customers : []).slice(0, 5));
      setRecentSuppliers((Array.isArray(suppliers) ? suppliers : []).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-r from-sky-600 to-indigo-600 text-white rounded-2xl px-6 py-5 shadow">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {user.name || "User"} 👋</h1>
          <p className="text-sky-100 text-sm mt-1">
            {now.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate("/sales/new")} className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 transition">
            + New Sale
          </button>
          <button onClick={() => navigate("/purchases/new")} className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-indigo-400 border border-indigo-300 transition">
            + New Purchase
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
          <StatCard label="Total Employees"  value={stats.employees}  icon={Users}      color="border-blue-500"   sub="Across all branches"   trend={8}  onClick={() => navigate("/admin/employees")} />
          <StatCard label="Total Customers"  value={stats.customers}  icon={UserCheck}  color="border-emerald-500" sub="Registered customers"  trend={12} onClick={() => navigate("/admin/customers")} />
          <StatCard label="Total Suppliers"  value={stats.suppliers}  icon={Truck}      color="border-orange-500" sub="Active vendors"          trend={3}  onClick={() => navigate("/admin/suppliers")} />
          <StatCard label="Branches"         value={stats.branches}   icon={Building2}  color="border-purple-500" sub="Company branches"        onClick={() => navigate("/branches")} />
          <StatCard label="Salary Records"   value={stats.payrolls}   icon={DollarSign} color="border-rose-500"   sub="Total payroll entries"  onClick={() => navigate("/employees/salary-history")} />
          <StatCard label="Manage Stock"     value="View →"           icon={Package}    color="border-teal-500"   sub="Stock categories"        onClick={() => navigate("/admin/stock")} />
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-indigo-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <QuickLink label="New Sale"       to="/sales/new"                     icon={ShoppingCart}  color="border-blue-200 text-blue-600 hover:border-blue-400" />
          <QuickLink label="New Purchase"   to="/purchases/new"                 icon={TrendingUp}    color="border-green-200 text-green-600 hover:border-green-400" />
          <QuickLink label="New Customer"   to="/customers/new"                 icon={UserCheck}     color="border-emerald-200 text-emerald-600 hover:border-emerald-400" />
          <QuickLink label="New Supplier"   to="/suppliers/new"                 icon={Truck}         color="border-orange-200 text-orange-600 hover:border-orange-400" />
          <QuickLink label="Payroll"        to="/employees/payroll"             icon={DollarSign}    color="border-rose-200 text-rose-600 hover:border-rose-400" />
          <QuickLink label="All Sales"      to="/sales"                         icon={ClipboardList} color="border-indigo-200 text-indigo-600 hover:border-indigo-400" />
          <QuickLink label="Purchases"      to="/purchases"                     icon={Package}       color="border-teal-200 text-teal-600 hover:border-teal-400" />
          <QuickLink label="Journal"        to="/accounting/journal"            icon={ClipboardList} color="border-violet-200 text-violet-600 hover:border-violet-400" />
          <QuickLink label="Trial Balance"  to="/accounting/trial-balance"      icon={BarChart3}     color="border-slate-200 text-slate-600 hover:border-slate-400" />
          <QuickLink label="Balance Sheet"  to="/accounting/balance-sheet"      icon={BarChart3}     color="border-yellow-200 text-yellow-600 hover:border-yellow-400" />
          <QuickLink label="Employees"      to="/admin/employees"               icon={Users}         color="border-cyan-200 text-cyan-600 hover:border-cyan-400" />
          <QuickLink label="Branches"       to="/branches"                      icon={Building2}     color="border-pink-200 text-pink-600 hover:border-pink-400" />
        </div>
      </div>

      {/* ── 3-column data panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Payrolls */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <DollarSign size={16} className="text-rose-500" /> Recent Payrolls
            </h2>
            <button onClick={() => navigate("/employees/salary-history")} className="text-xs text-indigo-600 hover:underline">View all</button>
          </div>
          {recentPayrolls.length === 0 ? (
            <p className="text-sm text-slate-400">No salary records yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentPayrolls.map(p => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{p.employee_name || `Employee #${p.employee_id}`}</p>
                    <p className="text-xs text-slate-400">{p.salary_month} {p.salary_year}</p>
                  </div>
                  <span className="font-semibold text-emerald-600">PKR {Number(p.paid_amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <UserCheck size={16} className="text-emerald-500" /> Recent Customers
            </h2>
            <button onClick={() => navigate("/admin/customers")} className="text-xs text-indigo-600 hover:underline">View all</button>
          </div>
          {recentCustomers.length === 0 ? (
            <p className="text-sm text-slate-400">No customers yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentCustomers.map(c => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{c.customer_name}</p>
                    <p className="text-xs text-slate-400">{c.area || c.branch || "—"}</p>
                  </div>
                  <span className="text-xs text-slate-400">{c.contact_no}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Suppliers */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Truck size={16} className="text-orange-500" /> Recent Suppliers
            </h2>
            <button onClick={() => navigate("/admin/suppliers")} className="text-xs text-indigo-600 hover:underline">View all</button>
          </div>
          {recentSuppliers.length === 0 ? (
            <p className="text-sm text-slate-400">No suppliers yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentSuppliers.map(s => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{s.supplier_name}</p>
                    <p className="text-xs text-slate-400">{s.company || "—"}</p>
                  </div>
                  <span className="text-xs text-slate-400">{s.contact_no}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Module Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Sales Management",    desc: "View sales, pending payments, returns", icon: ShoppingCart, color: "bg-blue-50 border-blue-200",   btn: "Open Sales",      to: "/sales" },
          { title: "Purchase Management", desc: "Track purchases, pending & returns",    icon: TrendingUp,   color: "bg-green-50 border-green-200",  btn: "Open Purchases",  to: "/purchases" },
          { title: "HR & Payroll",        desc: "Employees, salaries, payroll records",  icon: Users,        color: "bg-purple-50 border-purple-200", btn: "Open HR",         to: "/admin/employees" },
          { title: "Accounting",          desc: "Journal, ledger, balance sheet",        icon: BarChart3,    color: "bg-amber-50 border-amber-200",   btn: "Open Accounts",   to: "/accounting/journal" },
        ].map(m => (
          <div key={m.title} className={`rounded-xl border p-5 ${m.color} flex flex-col justify-between`}>
            <div>
              <div className="mb-3"><m.icon size={26} className="text-slate-600" /></div>
              <h3 className="font-semibold text-slate-800 text-sm">{m.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
            </div>
            <button onClick={() => navigate(m.to)} className="mt-4 text-xs font-semibold text-indigo-600 hover:underline text-left">
              {m.btn} →
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
