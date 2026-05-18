import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../api/customers";
import BranchSelector from "./components/BranchSelector";
import { UserCheck, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const BLANK = { company: "", branch: "", customer_name: "", contact_no: "", area: "", address: "" };

export default function NewCustomer() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim()) { showToast("Customer name is required", "error"); return; }
    setSaving(true);
    try {
      await createCustomer(form);
      showToast("Customer created successfully!");
      setForm(BLANK);
    } catch (err) {
      showToast("Failed to create customer: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-popIn flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "error" ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <UserCheck size={22} className="text-emerald-500" /> New Customer
          </h1>
          <p className="page-sub">Register a new customer in the system</p>
        </div>
        <button onClick={() => navigate("/admin/customers")} className="btn-outline flex items-center gap-1">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="erp-card p-6 animate-scaleIn max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
              <input
                placeholder="Company name"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="erp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
              <BranchSelector value={form.branch} onChange={branch => setForm({ ...form, branch })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Name *</label>
              <input
                required
                placeholder="Full customer name"
                value={form.customer_name}
                onChange={e => setForm({ ...form, customer_name: e.target.value })}
                className="erp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact No</label>
              <input
                placeholder="Phone number"
                value={form.contact_no}
                onChange={e => setForm({ ...form, contact_no: e.target.value })}
                className="erp-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Area</label>
              <input
                placeholder="Area / locality"
                value={form.area}
                onChange={e => setForm({ ...form, area: e.target.value })}
                className="erp-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <textarea
              rows={3}
              placeholder="Full address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="erp-input resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1">
              <CheckCircle2 size={15} />
              {saving ? "Creating…" : "Create Customer"}
            </button>
            <button type="button" onClick={() => setForm(BLANK)} className="btn-outline">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}
