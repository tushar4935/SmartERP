import { useEffect, useState } from "react";
import { fetchSaleReturns } from "../../api/sales";
import { Clock, RotateCcw, Search } from "lucide-react";

export default function ReturnPending() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchSaleReturns({ pending: true })
      .then(d => setReturns(Array.isArray(d) ? d : d.returns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = returns.filter(r =>
    (r.invoice_no    || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.customer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = returns.reduce((sum, r) => sum + Number(r.remaining_return || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Clock size={22} className="text-orange-500" /> Pending Sale Returns
          </h1>
          <p className="page-sub">Returns awaiting settlement</p>
        </div>
        <div className="erp-card px-4 py-3 flex items-center gap-3">
          <RotateCcw size={18} className="text-orange-500" />
          <div>
            <p className="text-xs text-slate-500">Total Pending</p>
            <p className="font-bold text-slate-800">PKR {totalPending.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by invoice or customer…"
            className="erp-input pl-9"
          />
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th className="text-right">Return Total</th>
                <th className="text-right">Remaining Return</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Clock size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No pending returns found.</p>
                  </td>
                </tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold text-indigo-600">{r.invoice_no}</td>
                  <td className="font-medium">{r.customer_name || "—"}</td>
                  <td className="text-right">PKR {Number(r.return_total || 0).toLocaleString()}</td>
                  <td className="text-right">
                    <span className="badge badge-orange">PKR {Number(r.remaining_return || 0).toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="badge badge-red">Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
