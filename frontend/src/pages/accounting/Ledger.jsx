import { useEffect, useState } from "react";
import { fetchLedger } from "../../api/accounting";
import { API_BASE } from "../../api/config";
import { BookMarked, Search } from "lucide-react";

const authH = () => { const t = localStorage.getItem("token"); return t ? { Authorization: `Bearer ${t}` } : {}; };

export default function Ledger() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/account-heads`, { headers: authH() })
      .then(r => r.json())
      .then(d => setAccounts(Array.isArray(d) ? d : d.heads || []))
      .catch(console.error);
  }, []);

  const fetchData = async () => {
    if (!accountId) return alert("Select an account");
    setLoading(true);
    try {
      const data = await fetchLedger(accountId);
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
          <h1 className="page-title flex items-center gap-2"><BookMarked size={22} className="text-indigo-500" /> Accounts Ledger</h1>
          <p className="page-sub">View transactions by account</p>
        </div>
      </div>

      <div className="erp-card p-5">
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-52">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Account</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} className="erp-select">
              <option value="">-- Select Account Head --</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <button onClick={fetchData} disabled={loading} className="btn-primary flex items-center gap-2 h-10">
            <Search size={15}/> {loading ? "Loading..." : "View Ledger"}
          </button>
        </div>
      </div>

      {searched && (
        <div className="erp-card overflow-hidden animate-fadeIn">
          {rows.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <BookMarked size={40} className="mx-auto mb-3 opacity-30" />
              <p>No ledger entries for this account.</p>
            </div>
          ) : (
            <>
              <table className="erp-table">
                <thead><tr><th>Date</th><th>Description</th><th>Reference</th><th className="text-right">Debit</th><th className="text-right">Credit</th><th className="text-right">Balance</th></tr></thead>
                <tbody>
                  {rows.map((r, i) => {
                    const balance = rows.slice(0, i + 1).reduce((s, x) => s + Number(x.debit||0) - Number(x.credit||0), 0);
                    return (
                      <tr key={r.id || i}>
                        <td>{new Date(r.created_at).toLocaleDateString("en-PK")}</td>
                        <td>{r.description || "—"}</td>
                        <td><span className="badge badge-gray">{r.reference_type || "—"}</span></td>
                        <td className="text-right text-red-600 font-medium">{r.debit ? `PKR ${Number(r.debit).toLocaleString()}` : "—"}</td>
                        <td className="text-right text-green-600 font-medium">{r.credit ? `PKR ${Number(r.credit).toLocaleString()}` : "—"}</td>
                        <td className={`text-right font-bold ${balance >= 0 ? "text-indigo-600" : "text-red-600"}`}>PKR {Math.abs(balance).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="px-4 py-3">Totals</td>
                    <td className="text-right px-4 py-3 text-red-600">PKR {totalDebit.toLocaleString()}</td>
                    <td className="text-right px-4 py-3 text-green-600">PKR {totalCredit.toLocaleString()}</td>
                    <td className="text-right px-4 py-3 text-indigo-700">PKR {Math.abs(totalDebit - totalCredit).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
