import React, { useEffect, useState } from "react";
import { createSupplier, getSupplier, updateSupplier } from "../../api/suppliers";
import { useParams, useNavigate } from "react-router-dom";
import { Truck, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function SupplierEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "", branch: "", supplier_name: "", contact_no: "", email: "", address: "", description: "", assigned_user_id: ""
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!id) return;
    getSupplier(id)
      .then(data => setForm({
        company:          data.company          || "",
        branch:           data.branch           || "",
        supplier_name:    data.supplier_name    || "",
        contact_no:       data.contact_no       || "",
        email:            data.email            || "",
        address:          data.address          || "",
        description:      data.description      || "",
        assigned_user_id: data.assigned_user_id || "",
      }))
      .catch(() => { alert("Failed to load"); navigate("/admin/suppliers"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier_name.trim()) { showToast("Supplier name is required", "error"); return; }
    setSaving(true);
    try {
      if (id) { await updateSupplier(id, form); showToast("Supplier updated!"); }
      else    { await createSupplier(form);     showToast("Supplier created!"); }
      setTimeout(() => navigate("/admin/suppliers"), 1200);
    } catch { showToast("Save failed", "error"); }
    finally  { setSaving(false); }
  };

  if (loading) return (
    <div className="erp-page animate-fadeIn">
      <div className="erp-card p-8 max-w-2xl space-y-4">
        {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-10 rounded" />)}
      </div>
    </div>
  );

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
            <Truck size={22} className="text-orange-500" />
            {id ? "Edit Supplier" : "New Supplier"}
          </h1>
          <p className="page-sub">{id ? "Update supplier details" : "Register a new supplier"}</p>
        </div>
        <button onClick={() => navigate("/admin/suppliers")} className="btn-outline flex items-center gap-1">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="erp-card p-6 animate-scaleIn max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Supplier Name *</label>
              <input required value={form.supplier_name} onChange={set("supplier_name")} className="erp-input" placeholder="Full supplier name" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
              <input value={form.company} onChange={set("company")} className="erp-input" placeholder="Company / firm" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Contact No</label>
              <input value={form.contact_no} onChange={set("contact_no")} className="erp-input" placeholder="Phone number" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={set("email")} className="erp-input" placeholder="email@example.com" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
              <input value={form.branch} onChange={set("branch")} className="erp-input" placeholder="Branch name" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input value={form.address} onChange={set("address")} className="erp-input" placeholder="Physical address" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={set("description")} className="erp-input resize-none" placeholder="Additional notes" /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1">
              <CheckCircle2 size={15} />
              {saving ? "Saving…" : id ? "Update Supplier" : "Create Supplier"}
            </button>
            <button type="button" onClick={() => navigate("/admin/suppliers")} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
