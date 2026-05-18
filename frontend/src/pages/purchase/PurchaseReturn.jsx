import { useEffect, useState } from "react";
import { fetchPurchases, returnPurchase } from "../../api/purchases";
import { RotateCcw, Package, CheckCircle2, AlertCircle } from "lucide-react";

export default function PurchaseReturn() {
  const [purchases, setPurchases]   = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [returnTotal, setReturnTotal] = useState("");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    fetchPurchases()
      .then(d => setPurchases(Array.isArray(d) ? d : d.purchases || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const selectedPurchase = purchases.find(p => String(p.id) === selectedId);

  const handleSubmit = async () => {
    if (!selectedId || !returnTotal || Number(returnTotal) <= 0) {
      showToast("Select a purchase and enter a valid return amount", "error");
      return;
    }
    if (selectedPurchase && Number(returnTotal) > Number(selectedPurchase.paid_amount || 0)) {
      showToast("Return amount cannot exceed paid amount", "error");
      return;
    }
    setSubmitting(true);
    try {
      await returnPurchase({ purchase_id: Number(selectedId), return_total: Number(returnTotal) });
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
            <RotateCcw size={22} className="text-red-500" /> Purchase Return
          </h1>
          <p className="page-sub">Return goods to supplier and adjust balance</p>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Purchase</label>
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="erp-select"
                >
                  <option value="">— Choose a purchase —</option>
                  {purchases.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.invoice_no} — {p.supplier_name} (Total: PKR {Number(p.total_amount || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPurchase && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm animate-fadeIn">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice</span>
                    <span className="font-semibold text-indigo-600">{selectedPurchase.invoice_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Supplier</span>
                    <span className="font-medium">{selectedPurchase.supplier_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total</span>
                    <span className="font-semibold">PKR {Number(selectedPurchase.total_amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid</span>
                    <span className="text-emerald-600 font-semibold">PKR {Number(selectedPurchase.paid_amount || 0).toLocaleString()}</span>
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
            <Package size={16} className="text-green-500" /> About Purchase Returns
          </h2>
          <div className="space-y-4 text-sm text-slate-600">
            {[
              "Select the original purchase invoice from the dropdown.",
              "Enter the return amount — it cannot exceed the amount already paid.",
              "Returns reduce the balance owed to the supplier.",
              "Processed returns appear in the Pending Returns tab.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
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
