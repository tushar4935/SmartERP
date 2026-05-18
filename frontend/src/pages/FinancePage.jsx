import { useNavigate } from "react-router-dom";
import { BookOpen, Scale, TrendingUp, PieChart, ArrowLeftRight, BookMarked } from "lucide-react";

const modules = [
  { icon: ArrowLeftRight, label: "New Transaction",  sub: "Record a journal entry",       to: "/accounting/new",            color: "bg-indigo-600" },
  { icon: BookMarked,     label: "Ledger",            sub: "View account ledger",          to: "/accounting/ledger",         color: "bg-blue-600"   },
  { icon: BookOpen,       label: "Journal",           sub: "Browse daily transactions",    to: "/accounting/journal",        color: "bg-violet-600" },
  { icon: Scale,          label: "Trial Balance",     sub: "Debit vs Credit summary",      to: "/accounting/trial-balance",  color: "bg-slate-700"  },
  { icon: TrendingUp,     label: "Income Statement",  sub: "Revenue & expense report",     to: "/accounting/income",         color: "bg-emerald-600"},
  { icon: PieChart,       label: "Balance Sheet",     sub: "Assets, liabilities & equity", to: "/accounting/balance-sheet",  color: "bg-purple-600" },
];

export default function FinancePage() {
  const navigate = useNavigate();
  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Finance & Accounting</h1>
          <p className="page-sub">Manage accounts, reports, and financial records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
        {modules.map(m => (
          <button key={m.to} onClick={() => navigate(m.to)}
            className="erp-card p-6 text-left hover:scale-105 transition-transform duration-200 animate-fadeIn group">
            <div className={`w-12 h-12 rounded-2xl ${m.color} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
              <m.icon size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">{m.label}</h3>
            <p className="text-sm text-slate-500 mt-1">{m.sub}</p>
            <span className="mt-4 inline-block text-xs text-indigo-600 font-semibold">Open →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
