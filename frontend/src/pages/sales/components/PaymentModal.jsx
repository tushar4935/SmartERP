import { useState } from "react";
import { paySale } from "../../../api/sales";
import { DollarSign, X, CheckCircle2 } from "lucide-react";

export default function PaymentModal({ sale, onClose, onSuccess }) {
  const [amount, setAmount]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!sale) return null;

  const handlePay = async () => {
    const num = Number(amount);
    if (!num || num <= 0) { alert("Enter a valid amount"); return; }
    if (num > Number(sale.remaining_amount)) { alert("Amount exceeds remaining balance"); return; }
    setSubmitting(true);
    try {
      await paySale({ sale_id: sale.id, amount: num });
      onSuccess?.();
      onClose();
    } catch (err) { alert("Payment failed: " + err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-scaleIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-500" /> Record Payment
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <X size={16} />
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Invoice</span>
            <span className="font-semibold text-indigo-600">{sale.invoice_no}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Remaining</span>
            <span className="font-bold text-amber-600">PKR {Number(sale.remaining_amount).toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="erp-input"
            max={sale.remaining_amount}
            min={1}
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePay}
            disabled={submitting}
            className="btn-success flex-1 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            {submitting ? "Processing…" : "Confirm Payment"}
          </button>
          <button onClick={onClose} className="btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  );
}
