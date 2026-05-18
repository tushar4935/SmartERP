import { useEffect, useState } from "react";
import { fetchPendingSales, paySale } from "../../api/sales";
import { Clock, DollarSign, CheckCircle2, Search } from "lucide-react";

export default function PendingPayments() {
  const [sales, setSales]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying]   = useState(null);
  const [amount, setAmount]   = useState("");
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState("");

  const load = () =>
    fetchPendingSales()
      .then(d => setSales(Array.isArray(d) ? d : d.sales || []))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handlePay = async (saleId) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid payment amount");
      return;
    }
    setSaving(true);
    try {
      await paySale({ sale_id: saleId, amount: Number(amount) });
      setPaying(null);
      setAmount("");
      setLoading(true);
      load();
    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = sales.filter(s =>
    (s.invoice_no    || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPending = sales.reduce((sum, s) => sum + Number(s.remaining_amount || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Clock size={22} className="text-amber-500" /> Pending Payments
          </h1>
          <p className="page-sub">Sales with outstanding balances</p>
        </div>
        <div className="erp-card px-4 py-3 flex items-center gap-3">
          <DollarSign size={18} className="text-amber-500" />
          <div>
            <p className="text-xs text-slate-500">Total Outstanding</p>
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
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-14 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th className="text-right">Total</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Remaining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <CheckCircle2 size={36} className="mx-auto mb-2 opacity-30" />
                    <p>All payments cleared!</p>
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold text-indigo-600">{s.invoice_no}</td>
                  <td className="font-medium">{s.customer_name || "—"}</td>
                  <td className="text-right">PKR {Number(s.total_amount || 0).toLocaleString()}</td>
                  <td className="text-right text-emerald-600">PKR {Number(s.paid_amount || 0).toLocaleString()}</td>
                  <td className="text-right">
                    <span className="badge badge-orange">PKR {Number(s.remaining_amount || 0).toLocaleString()}</span>
                  </td>
                  <td>
                    {paying === s.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="Amount"
                          className="erp-input w-28 text-sm"
                          min={1}
                          max={s.remaining_amount}
                        />
                        <button
                          onClick={() => handlePay(s.id)}
                          disabled={saving}
                          className="btn-success text-xs px-3 py-1.5"
                        >
                          {saving ? "…" : "Pay"}
                        </button>
                        <button
                          onClick={() => { setPaying(null); setAmount(""); }}
                          className="btn-outline text-xs px-3 py-1.5"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setPaying(s.id); setAmount(""); }}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        <DollarSign size={13} /> Collect
                      </button>
                    )}
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
