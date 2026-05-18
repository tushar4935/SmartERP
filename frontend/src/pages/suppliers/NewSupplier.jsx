import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "../../api/suppliers";
import { Truck, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

const BLANK = { company: "", branch: "", supplier_name: "", contact_no: "", email: "", address: "", description: "" };

export default function NewSupplier() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(null);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier_name.trim()) { showToast("Supplier name is required", "error"); return; }
    setSaving(true);
    try {
      await createSupplier(form);
      showToast("Supplier created successfully!");
      setForm(BLANK);
    } catch (err) {
      showToast("Failed to create supplier: " + err.message, "error");
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
            <Truck size={22} className="text-orange-500" /> New Supplier
          </h1>
          <p className="page-sub">Register a new vendor in the system</p>
        </div>
        <button onClick={() => navigate("/admin/suppliers")} className="btn-outline flex items-center gap-1">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="erp-card p-6 animate-scaleIn max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier Name *</label>
              <input required placeholder="Full supplier name" value={form.supplier_name} onChange={set("supplier_name")} className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
              <input placeholder="Company / firm" value={form.company} onChange={set("company")} className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact No</label>
              <input placeholder="Phone number" value={form.contact_no} onChange={set("contact_no")} className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="email@example.com" value={form.email} onChange={set("email")} className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
              <input placeholder="Branch name" value={form.branch} onChange={set("branch")} className="erp-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input placeholder="Physical address" value={form.address} onChange={set("address")} className="erp-input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Additional notes about this supplier"
              value={form.description}
              onChange={set("description")}
              className="erp-input resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1">
              <CheckCircle2 size={15} />
              {saving ? "Saving…" : "Save Supplier"}
            </button>
            <button type="button" onClick={() => setForm(BLANK)} className="btn-outline">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}
