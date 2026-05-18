import { useEffect, useState } from "react";
import { fetchBalanceSheet } from "../../api/accounting";
import { PieChart } from "lucide-react";

const COLORS = {
  Assets:      { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  Liabilities: { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200"   },
  Equity:      { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Revenue:     { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  Expenses:    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

export default function BalanceSheet() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalanceSheet()
      .then(d => setRows(Array.isArray(d) ? d : d.rows || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><PieChart size={22} className="text-purple-500" /> Balance Sheet</h1>
          <p className="page-sub">Financial position as of today</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-32 rounded-xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="erp-card py-16 text-center text-slate-400">
          <PieChart size={40} className="mx-auto mb-3 opacity-30" />
          <p>No balance sheet data available.</p>
          <p className="text-xs mt-1">Record transactions to populate the balance sheet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
          {rows.map((r, i) => {
            const c = COLORS[r.type] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
            return (
              <div key={r.id || r.type || i} className={`erp-card p-5 border-l-4 ${c.border} ${c.bg} animate-fadeIn`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${c.text}`}>{r.type}</p>
                    <p className={`text-2xl font-bold ${c.text}`}>PKR {Number(r.balance || 0).toLocaleString()}</p>
                  </div>
                  <span className={`badge ${c.bg} ${c.text} border ${c.border}`}>{r.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
