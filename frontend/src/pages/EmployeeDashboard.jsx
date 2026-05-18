import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/employees";
import { fetchBranches } from "../api/branches";
import { Users, Building2, DollarSign, ClipboardList } from "lucide-react";

export default function EmployeeDashboard() {
  const navigate  = useNavigate();
  const user      = (() => { try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; } })();
  const [empCount,    setEmpCount]    = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchEmployees().then(d => setEmpCount((d.employees || []).length)),
      fetchBranches().then(d => setBranchCount((d.branches || []).length)),
    ]).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Employees", value: loading ? "…" : empCount,    icon: Users,      color: "bg-indigo-500", to: "/employees" },
    { label: "Branches",        value: loading ? "…" : branchCount, icon: Building2,  color: "bg-purple-500", to: "/branches"  },
    { label: "Payroll",         value: "Process",                    icon: DollarSign, color: "bg-rose-500",   to: "/employees/payroll" },
    { label: "Salary History",  value: "View",                       icon: ClipboardList, color: "bg-teal-500", to: "/employees/salary-history" },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="erp-page animate-fadeIn space-y-6">
      <div className="rounded-2xl bg-indigo-600 text-white px-6 py-5 shadow-md">
        <h1 className="text-xl font-bold">{greeting}, {user.name || "Employee"} 👋</h1>
        <p className="text-indigo-200 text-sm mt-1">
          {now.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {cards.map(c => (
          <button key={c.label} onClick={() => navigate(c.to)}
            className="erp-card p-5 flex flex-col items-start gap-3 hover:scale-105 transition-transform duration-200 animate-fadeIn text-left w-full">
            <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center shadow`}>
              <c.icon size={22} className="text-white"/>
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-800">{c.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="erp-card p-5 animate-slideInLeft">
          <h2 className="font-semibold text-slate-700 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Register New Employee",  to: "/employees",             color: "text-indigo-600" },
              { label: "Process Payroll",         to: "/employees/payroll",     color: "text-rose-600"   },
              { label: "View Salary History",     to: "/employees/salary-history", color: "text-teal-600" },
              { label: "Manage Branches",         to: "/branches",              color: "text-purple-600" },
            ].map(a => (
              <button key={a.to} onClick={() => navigate(a.to)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition flex items-center justify-between ${a.color} font-medium text-sm`}>
                {a.label} <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="erp-card p-5 animate-slideInRight">
          <h2 className="font-semibold text-slate-700 mb-4">HR Modules</h2>
          <div className="space-y-2">
            {[
              { label: "All Employees",           to: "/admin/employees"  },
              { label: "Branch Users",            to: "/branch-users"     },
              { label: "User Types",              to: "/admin/user-types" },
              { label: "System Users",            to: "/admin/users"      },
            ].map(a => (
              <button key={a.to} onClick={() => navigate(a.to)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition flex items-center justify-between text-slate-700 font-medium text-sm">
                {a.label} <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
