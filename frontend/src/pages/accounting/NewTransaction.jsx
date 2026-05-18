import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../../api/accounting";
import { API_BASE } from "../../api/config";
import { ArrowLeftRight, Save } from "lucide-react";

const authH = () => { const t = localStorage.getItem("token"); return t ? { Authorization: `Bearer ${t}` } : {}; };

export default function NewTransaction() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ debit_account_id: "", credit_account_id: "", amount: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/account-heads`, { headers: authH() })
      .then(r => r.json())
      .then(d => setAccounts(Array.isArray(d) ? d : d.heads || []))
      .catch(console.error);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.debit_account_id || !form.credit_account_id || !form.amount) return alert("All fields required");
    setSaving(true);
    try {
      await createTransaction(form);
      alert("Transaction saved successfully!");
      navigate("/accounting/journal");
    } catch (err) { alert("Failed: " + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="erp-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><ArrowLeftRight size={22} className="text-indigo-500" /> New Transaction</h1>
          <p className="page-sub">Record a general journal entry</p>
        </div>
      </div>

      <div className="erp-card p-6 max-w-xl animate-scaleIn">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Debit Account</label>
            <select value={form.debit_account_id} onChange={e => setForm({...form, debit_account_id: e.target.value})} className="erp-select" required>
              <option value="">-- Select Debit Account --</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Credit Account</label>
            <select value={form.credit_account_id} onChange={e => setForm({...form, credit_account_id: e.target.value})} className="erp-select" required>
              <option value="">-- Select Credit Account --</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (PKR)</label>
            <input type="number" min="1" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="erp-input" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description / Narration</label>
            <textarea rows={3} placeholder="Reason for this transaction..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="erp-input resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save size={15} /> {saving ? "Saving..." : "Save Transaction"}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
