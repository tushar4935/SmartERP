import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAccountControls } from "../../../api/accountControls";
import { API_BASE } from "../../../api/config";
import { GitBranch, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AccountSubControlForm() {
  const navigate = useNavigate();
  const [controls, setControls]   = useState([]);
  const [form, setForm]           = useState({ account_control_id: "", sub_control_account: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchAccountControls()
      .then(d => setControls(Array.isArray(d) ? d : d.controls || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!form.account_control_id || !form.sub_control_account.trim()) {
      showToast("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/account-sub-controls`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      navigate("/admin/account-sub-controls");
    } catch (err) { showToast("Failed: " + err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-popIn flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          <AlertCircle size={16} /> {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <GitBranch size={22} className="text-teal-500" /> New Account Sub-Control
          </h1>
          <p className="page-sub">Add a third-level account entry</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-outline flex items-center gap-1">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="erp-card p-6 animate-scaleIn max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Control Account</label>
          <select
            value={form.account_control_id}
            onChange={e => setForm({ ...form, account_control_id: e.target.value })}
            className="erp-select"
          >
            <option value="">— Select control account —</option>
            {controls.map(c => (
              <option key={c.id} value={c.id}>{c.control_account}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Sub-Control Name</label>
          <input
            type="text"
            value={form.sub_control_account}
            onChange={e => setForm({ ...form, sub_control_account: e.target.value })}
            placeholder="e.g. Cash in Hand"
            className="erp-input"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-1">
            <CheckCircle2 size={15} />
            {submitting ? "Saving…" : "Save"}
          </button>
          <button onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  );
}
