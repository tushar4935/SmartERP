import { useEffect, useState } from "react";
import { fetchCustomers } from "../../api/customers";
import { API_BASE } from "../../api/config";
import { BookOpen, Search } from "lucide-react";

const authH = () => { const t = localStorage.getItem("token"); return t ? { Authorization: `Bearer ${t}` } : {}; };

export default function CustomerLedger() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchCustomers().then(d => setCustomers(Array.isArray(d) ? d : d.customers || [])).catch(console.error);
  }, []);

  const fetchLedger = async () => {
    if (!customerId) return alert("Please select a customer");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/customers/${customerId}/ledger`, { headers: authH() });
      const data = await res.json();
      setRows(Array.isArray(data) ? data : data.rows || data.transactions || []);
    } catch { setRows([]); }
    finally { setLoading(false); setSearched(true); }
  };

  const totalDebit  = rows.reduce((s, r) => s + Number(r.debit  || 0), 0);
  const totalCredit = rows.reduce((s, r) => s + Number(r.credit || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><BookOpen size={22} className="text-indigo-500" /> Customer Ledger</h1>
          <p className="page-sub">View all transactions for a specific customer</p>
        </div>
      </div>

      <div className="erp-card p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-52">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Customer</label>
            <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="erp-select">
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name} — {c.area || c.branch || ""}</option>)}
            </select>
          </div>
          <button onClick={fetchLedger} disabled={loading} className="btn-primary flex items-center gap-2 h-10">
            <Search size={15}/> {loading ? "Loading..." : "View Ledger"}
          </button>
        </div>
      </div>

      {searched && (
        <div className="erp-card overflow-hidden animate-fadeIn">
          {rows.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30"/>
              <p>No ledger entries for this customer.</p>
            </div>
          ) : (
            <table className="erp-table">
              <thead><tr><th>Date</th><th>Type</th><th>Description</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id || i}>
                    <td>{new Date(r.created_at).toLocaleDateString("en-PK")}</td>
                    <td><span className="badge badge-blue">{r.type || "TXN"}</span></td>
                    <td>{r.description || "—"}</td>
                    <td className="text-right text-red-600 font-medium">{r.debit ? `PKR ${Number(r.debit).toLocaleString()}` : "—"}</td>
                    <td className="text-right text-green-600 font-medium">{r.credit ? `PKR ${Number(r.credit).toLocaleString()}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="px-4 py-3">Totals</td>
                  <td className="text-right px-4 py-3 text-red-700">PKR {totalDebit.toLocaleString()}</td>
                  <td className="text-right px-4 py-3 text-green-700">PKR {totalCredit.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
