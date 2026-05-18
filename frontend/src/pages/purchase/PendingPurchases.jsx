import { useEffect, useState } from "react";
import { fetchPendingPurchases, payPurchase } from "../../api/purchases";
import { Clock, DollarSign, CheckCircle2, Search, AlertCircle } from "lucide-react";

export default function PendingPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [paying, setPaying]       = useState(null);
  const [amount, setAmount]       = useState("");
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    fetchPendingPurchases()
      .then(d => setPurchases(Array.isArray(d) ? d : d.purchases || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handlePay = async (purchaseId) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showToast("Enter a valid payment amount", "error");
      return;
    }
    setSaving(true);
    try {
      await payPurchase({ purchase_id: purchaseId, amount: Number(amount) });
      setPaying(null);
      setAmount("");
      showToast("Payment recorded successfully!");
      load();
    } catch (err) {
      showToast("Payment failed: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = purchases.filter(p =>
    (p.invoice_no    || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.supplier_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalOwed = purchases.reduce((s, p) => s + Number(p.remaining_amount || 0), 0);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-popIn flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Clock size={22} className="text-amber-500" /> Pending Purchases
          </h1>
          <p className="page-sub">Purchases with outstanding supplier payments</p>
        </div>
        <div className="erp-card px-4 py-3 flex items-center gap-3">
          <DollarSign size={18} className="text-amber-500" />
          <div>
            <p className="text-xs text-slate-500">Total Owed to Suppliers</p>
            <p className="font-bold text-slate-800">PKR {totalOwed.toLocaleString()}</p>
          </div>
        </div>
      </div>

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
                <th>Supplier</th>
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
                    <p>No pending purchases!</p>
                  </td>
                </tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold text-indigo-600">{p.invoice_no}</td>
                  <td className="font-medium">{p.supplier_name || "—"}</td>
                  <td className="text-right">PKR {Number(p.total_amount || 0).toLocaleString()}</td>
                  <td className="text-right text-emerald-600">PKR {Number(p.paid_amount || 0).toLocaleString()}</td>
                  <td className="text-right">
                    <span className="badge badge-orange">PKR {Number(p.remaining_amount || 0).toLocaleString()}</span>
                  </td>
                  <td>
                    {paying === p.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="Amount"
                          className="erp-input w-28 text-sm"
                          min={1}
                          max={p.remaining_amount}
                        />
                        <button
                          onClick={() => handlePay(p.id)}
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
                        onClick={() => { setPaying(p.id); setAmount(""); }}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        <DollarSign size={13} /> Pay
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
