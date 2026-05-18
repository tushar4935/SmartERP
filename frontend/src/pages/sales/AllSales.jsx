import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSales } from "../../api/sales";
import { ShoppingCart, Search, Plus, Eye, TrendingUp } from "lucide-react";

export default function AllSales() {
  const navigate = useNavigate();
  const [sales, setSales]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchSales()
      .then(d => setSales(Array.isArray(d) ? d : d.sales || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sales.filter(s =>
    (s.invoice_no     || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_name  || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const totalPaid    = sales.reduce((sum, s) => sum + Number(s.paid_amount  || 0), 0);
  const totalPending = sales.reduce((sum, s) => sum + Number(s.remaining_amount || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ShoppingCart size={22} className="text-blue-500" /> All Sales
          </h1>
          <p className="page-sub">Complete sales history across all branches</p>
        </div>
        <button onClick={() => navigate("/sales/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Sale
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-4 stagger">
        {[
          { label: "Total Revenue",  value: `PKR ${totalRevenue.toLocaleString()}`,  color: "bg-blue-500"   },
          { label: "Total Collected", value: `PKR ${totalPaid.toLocaleString()}`,    color: "bg-emerald-500" },
          { label: "Outstanding",    value: `PKR ${totalPending.toLocaleString()}`,  color: "bg-amber-500"  },
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
            placeholder="Search by invoice or customer…"
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
                <th>Customer</th>
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
                    <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No sales found.</p>
                  </td>
                </tr>
              ) : filtered.map((s, i) => {
                const isPaid = Number(s.remaining_amount || 0) === 0;
                return (
                  <tr key={s.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-semibold text-indigo-600">{s.invoice_no}</td>
                    <td className="font-medium">{s.customer_name || "—"}</td>
                    <td className="text-slate-500 text-sm">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString("en-PK") : "—"}
                    </td>
                    <td className="text-right font-semibold">PKR {Number(s.total_amount || 0).toLocaleString()}</td>
                    <td className="text-right text-emerald-600">PKR {Number(s.paid_amount || 0).toLocaleString()}</td>
                    <td className="text-right text-amber-600">PKR {Number(s.remaining_amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${isPaid ? "badge-green" : "badge-orange"}`}>
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/sales/${s.id}`)}
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
