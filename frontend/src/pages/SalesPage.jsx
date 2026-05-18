import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSales } from "../api/sales";
import { ShoppingCart, Plus, Clock, RotateCcw, CheckCircle2, FileText } from "lucide-react";

export default function SalesPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSales()
      .then(d => setSales(Array.isArray(d) ? d : d.sales || []))
      .catch(() => setSales([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sales.filter(s =>
    (s.invoice_no || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const modules = [
    { label: "New Sale",       to: "/sales/new",             icon: Plus,         color: "bg-indigo-500" },
    { label: "All Sales",      to: "/sales",                 icon: ShoppingCart, color: "bg-blue-500"   },
    { label: "Pending",        to: "/sales/pending",         icon: Clock,        color: "bg-amber-500"  },
    { label: "Returns",        to: "/sales/returns",         icon: RotateCcw,    color: "bg-rose-500"   },
    { label: "Return Pending", to: "/sales/returns/pending", icon: FileText,     color: "bg-orange-500" },
  ];

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><ShoppingCart size={22} className="text-indigo-500"/> Sales</h1>
          <p className="page-sub">Manage all sales, invoices and returns</p>
        </div>
        <button onClick={() => navigate("/sales/new")} className="btn-primary flex items-center gap-2"><Plus size={16}/> New Sale</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 stagger">
        {modules.map(m => (
          <button key={m.to} onClick={() => navigate(m.to)}
            className="erp-card p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200 animate-fadeIn cursor-pointer">
            <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center`}>
              <m.icon size={20} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-700">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="erp-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-semibold text-slate-700">Recent Sales</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice / customer…" className="erp-input w-64" />
        </div>
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded"/>)}</div>
        ) : (
          <table className="erp-table">
            <thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th className="text-right">Total</th><th className="text-right">Paid</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">No sales found.</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td className="font-mono text-xs font-medium text-indigo-600">{s.invoice_no}</td>
                  <td>{s.customer_name || "—"}</td>
                  <td>{new Date(s.created_at).toLocaleDateString("en-PK")}</td>
                  <td className="text-right font-semibold">PKR {Number(s.total_amount).toLocaleString()}</td>
                  <td className="text-right text-green-600">PKR {Number(s.paid_amount || 0).toLocaleString()}</td>
                  <td><span className={`badge ${Number(s.remaining_amount) === 0 ? "badge-green" : "badge-orange"}`}>{Number(s.remaining_amount) === 0 ? "PAID" : "PENDING"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
