import { useEffect, useState } from "react";
import { fetchTrialBalance } from "../../api/accounting";
import { Scale } from "lucide-react";

export default function TrialBalance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrialBalance()
      .then(d => setData(Array.isArray(d) ? d : d.rows || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const totalDebit  = data.reduce((s, r) => s + Number(r.debit  || 0), 0);
  const totalCredit = data.reduce((s, r) => s + Number(r.credit || 0), 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Scale size={22} className="text-slate-600" /> Trial Balance</h1>
          <p className="page-sub">Summarised debit / credit balances for all accounts</p>
        </div>
        {!loading && (
          <span className={`badge ${balanced ? "badge-green" : "badge-red"} text-sm px-4`}>
            {balanced ? "✓ Balanced" : "⚠ Unbalanced"}
          </span>
        )}
      </div>

      <div className="erp-card overflow-hidden animate-scaleIn">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="shimmer h-10 rounded" />)}</div>
        ) : data.length === 0 ? (
          <div className="py-16 text-center text-slate-400"><Scale size={40} className="mx-auto mb-3 opacity-30" /><p>No data available yet.</p></div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>Account Name</th>
                <th className="text-right">Debit (PKR)</th>
                <th className="text-right">Credit (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={r.id || r.name || i}>
                  <td className="font-medium">{r.name || r.account}</td>
                  <td className="text-right text-red-600">{r.debit ? Number(r.debit).toLocaleString() : "—"}</td>
                  <td className="text-right text-green-600">{r.credit ? Number(r.credit).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td className="px-4 py-3">Total</td>
                <td className="text-right px-4 py-3 text-red-700">{totalDebit.toLocaleString()}</td>
                <td className="text-right px-4 py-3 text-green-700">{totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
