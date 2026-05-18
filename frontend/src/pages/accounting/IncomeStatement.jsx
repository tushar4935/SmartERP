import { useEffect, useState } from "react";
import { fetchIncomeStatement } from "../../api/accounting";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function IncomeStatement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomeStatement()
      .then(d => setRows(Array.isArray(d) ? d : d.rows || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const revenue  = rows.filter(r => r.type === "Revenue").reduce((s, r) => s + Number(r.amount || 0), 0);
  const expenses = rows.filter(r => r.type === "Expenses").reduce((s, r) => s + Number(r.amount || 0), 0);
  const net = revenue - expenses;

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><TrendingUp size={22} className="text-emerald-500" /> Income Statement</h1>
          <p className="page-sub">Profit & loss summary</p>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        <div className="erp-card p-5 border-l-4 border-green-400 animate-fadeIn">
          <div className="flex items-center gap-2 text-green-600 mb-1"><TrendingUp size={16}/><span className="text-xs font-semibold uppercase">Revenue</span></div>
          <p className="text-2xl font-bold text-green-700">PKR {revenue.toLocaleString()}</p>
        </div>
        <div className="erp-card p-5 border-l-4 border-red-400 animate-fadeIn">
          <div className="flex items-center gap-2 text-red-600 mb-1"><TrendingDown size={16}/><span className="text-xs font-semibold uppercase">Expenses</span></div>
          <p className="text-2xl font-bold text-red-700">PKR {expenses.toLocaleString()}</p>
        </div>
        <div className={`erp-card p-5 border-l-4 animate-fadeIn ${net >= 0 ? "border-indigo-400" : "border-orange-400"}`}>
          <div className={`flex items-center gap-2 mb-1 ${net >= 0 ? "text-indigo-600" : "text-orange-600"}`}><Minus size={16}/><span className="text-xs font-semibold uppercase">Net {net >= 0 ? "Profit" : "Loss"}</span></div>
          <p className={`text-2xl font-bold ${net >= 0 ? "text-indigo-700" : "text-orange-700"}`}>PKR {Math.abs(net).toLocaleString()}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-14 rounded-xl"/>)}</div>
      ) : rows.length === 0 ? (
        <div className="erp-card py-16 text-center text-slate-400">
          <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
          <p>No income statement data yet. Record transactions to get started.</p>
        </div>
      ) : (
        <div className="erp-card overflow-hidden animate-fadeIn">
          <table className="erp-table">
            <thead><tr><th>Category</th><th>Account</th><th className="text-right">Amount (PKR)</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id || r.type + i}>
                  <td><span className={`badge ${r.type === "Revenue" ? "badge-green" : "badge-red"}`}>{r.type}</span></td>
                  <td className="font-medium">{r.account || r.name || "—"}</td>
                  <td className={`text-right font-semibold ${r.type === "Revenue" ? "text-green-600" : "text-red-600"}`}>{Number(r.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
