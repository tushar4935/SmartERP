import { useState } from "react";
import { BookOpen, Search, Calendar } from "lucide-react";
import { API_BASE } from "../../api/config";

const authHeader = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export default function Journal() {
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetch_ = async () => {
    if (!from || !to) return alert("Please select both dates");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/accounting/journal?from=${from}&to=${to}`, { headers: authHeader() });
      const data = await res.json();
      setRows(Array.isArray(data) ? data : data.transactions || data.rows || []);
    } catch { setRows([]); }
    finally { setLoading(false); setSearched(true); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><BookOpen size={22} className="text-violet-500" /> Journal</h1>
          <p className="page-sub">View all transactions by date range</p>
        </div>
      </div>

      <div className="erp-card p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">From</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="erp-input pl-8" />
            </div>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">To</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
              <input type="date" value={to} onChange={e => setTo(e.target.value)} className="erp-input pl-8" />
            </div>
          </div>
          <button onClick={fetch_} disabled={loading} className="btn-primary flex items-center gap-2 h-10">
            <Search size={15} /> {loading ? "Loading..." : "Retrieve"}
          </button>
        </div>
      </div>

      {searched && (
        <div className="erp-card overflow-hidden animate-fadeIn">
          {rows.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>No transactions found for the selected period.</p>
            </div>
          ) : (
            <table className="erp-table">
              <thead><tr><th>#</th><th>Date</th><th>Description</th><th>Reference</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id || i}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td>{new Date(r.created_at).toLocaleDateString("en-PK")}</td>
                    <td>{r.description || "—"}</td>
                    <td><span className="badge badge-blue">{r.reference_type || "MANUAL"}</span></td>
                    <td className="text-right font-medium text-red-600">{r.debit ? `PKR ${Number(r.debit).toLocaleString()}` : "—"}</td>
                    <td className="text-right font-medium text-green-600">{r.credit ? `PKR ${Number(r.credit).toLocaleString()}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
