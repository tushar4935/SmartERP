import { useEffect, useState } from "react";
import { fetchSales, returnSale } from "../../api/sales";
import { RotateCcw, ShoppingCart, CheckCircle2, AlertCircle } from "lucide-react";

export default function SaleReturns() {
  const [sales, setSales]           = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [returnTotal, setReturnTotal] = useState("");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    fetchSales()
      .then(d => setSales(Array.isArray(d) ? d : d.sales || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const selectedSale = sales.find(s => String(s.id) === selectedId);

  const handleSubmit = async () => {
    if (!selectedId || !returnTotal || Number(returnTotal) <= 0) {
      showToast("Select a sale and enter a valid return amount", "error");
      return;
    }
    if (selectedSale && Number(returnTotal) > Number(selectedSale.paid_amount || 0)) {
      showToast("Return amount cannot exceed paid amount", "error");
      return;
    }
    setSubmitting(true);
    try {
      await returnSale({ sale_id: Number(selectedId), return_total: Number(returnTotal) });
      showToast("Return recorded successfully!");
      setSelectedId("");
      setReturnTotal("");
    } catch (err) {
      showToast("Return failed: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            <RotateCcw size={22} className="text-red-500" /> Sale Return
          </h1>
          <p className="page-sub">Process refund for a completed sale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Return Form */}
        <div className="erp-card p-6 animate-slideInLeft space-y-5">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <RotateCcw size={16} className="text-red-500" /> Record Return
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-10 rounded" />)}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Sale</label>
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="erp-select"
                >
                  <option value="">— Choose a sale —</option>
                  {sales.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.invoice_no} — {s.customer_name} (Total: PKR {Number(s.total_amount || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedSale && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm animate-fadeIn">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice</span>
                    <span className="font-semibold text-indigo-600">{selectedSale.invoice_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer</span>
                    <span className="font-medium">{selectedSale.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total</span>
                    <span className="font-semibold">PKR {Number(selectedSale.total_amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid</span>
                    <span className="text-emerald-600 font-semibold">PKR {Number(selectedSale.paid_amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Return Amount</label>
                <input
                  type="number"
                  value={returnTotal}
                  onChange={e => setReturnTotal(e.target.value)}
                  placeholder="Enter return amount"
                  className="erp-input"
                  min={1}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || loading}
                className="btn-danger w-full flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                {submitting ? "Processing…" : "Record Return"}
              </button>
            </>
          )}
        </div>

        {/* Info Panel */}
        <div className="erp-card p-6 animate-slideInRight">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ShoppingCart size={16} className="text-blue-500" /> About Sale Returns
          </h2>
          <div className="space-y-4 text-sm text-slate-600">
            {[
              "Select the original sale invoice from the dropdown.",
              "Enter the return amount — it cannot exceed the amount already paid.",
              "Returns reduce the customer's outstanding balance.",
              "Processed returns appear in the Pending Returns tab.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-700">
            <strong>Note:</strong> Returns are irreversible. Double-check the amounts before submitting.
          </div>
        </div>
      </div>
    </div>
  );
}
