import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPurchases } from "../../api/purchases";
import { Package, Plus, Search, TrendingUp, Eye } from "lucide-react";

export default function PurchaseList() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    fetchPurchases()
      .then(d => setPurchases(Array.isArray(d) ? d : d.purchases || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = purchases.filter(p =>
    (p.invoice_no    || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.supplier_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent   = purchases.reduce((s, p) => s + Number(p.total_amount     || 0), 0);
  const totalPaid    = purchases.reduce((s, p) => s + Number(p.paid_amount      || 0), 0);
  const totalOwed    = purchases.reduce((s, p) => s + Number(p.remaining_amount || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Package size={22} className="text-green-500" /> All Purchases
          </h1>
          <p className="page-sub">Complete purchase history from all suppliers</p>
        </div>
        <button onClick={() => navigate("/purchases/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Purchase
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {[
          { label: "Total Purchased", value: `PKR ${totalSpent.toLocaleString()}`,  color: "bg-green-500"  },
          { label: "Total Paid",      value: `PKR ${totalPaid.toLocaleString()}`,   color: "bg-blue-500"   },
          { label: "Outstanding",     value: `PKR ${totalOwed.toLocaleString()}`,   color: "bg-amber-500"  },
        ].map(t => (
          <div key={t.label} className="erp-card p-4 flex items-center gap-3 animate-fadeIn">
            <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center shadow`}>
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{t.label}</p>
              <p className="text-base font-bold text-slate-800">{t.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by invoice or supplier…"
            className="erp-input pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Supplier</th>
                <th>Date</th>
                <th className="text-right">Total</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No purchases found.</p>
                  </td>
                </tr>
              ) : filtered.map((p, i) => {
                const status = p.status || (Number(p.remaining_amount || 0) === 0 ? "PAID" : "PENDING");
                return (
                  <tr key={p.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-semibold text-indigo-600">{p.invoice_no}</td>
                    <td className="font-medium">{p.supplier_name || "—"}</td>
                    <td className="text-slate-500 text-sm">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-PK") : "—"}
                    </td>
                    <td className="text-right font-semibold">PKR {Number(p.total_amount || 0).toLocaleString()}</td>
                    <td className="text-right text-emerald-600">PKR {Number(p.paid_amount || 0).toLocaleString()}</td>
                    <td className="text-right text-amber-600">PKR {Number(p.remaining_amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${status === "PAID" ? "badge-green" : "badge-orange"}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
