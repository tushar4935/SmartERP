import React, { useEffect, useState } from "react";
import { createCustomer, getCustomer, updateCustomer } from "../../api/customers";
import { useParams, useNavigate } from "react-router-dom";
import { UserCheck, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "", branch: "", customer_name: "", contact_no: "", area: "", address: "", assigned_user_id: ""
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
    getCustomer(id)
      .then(data => setForm({
        company:          data.company          || "",
        branch:           data.branch           || "",
        customer_name:    data.customer_name    || "",
        contact_no:       data.contact_no       || "",
        area:             data.area             || "",
        address:          data.address          || "",
        assigned_user_id: data.assigned_user_id || "",
      }))
      .catch(() => { alert("Failed to load"); navigate("/admin/customers"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim()) { showToast("Customer name is required", "error"); return; }
    setSaving(true);
    try {
      if (id) { await updateCustomer(id, form); showToast("Customer updated!"); }
      else    { await createCustomer(form);     showToast("Customer created!"); }
      setTimeout(() => navigate("/admin/customers"), 1200);
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
            <UserCheck size={22} className="text-emerald-500" />
            {id ? "Edit Customer" : "New Customer"}
          </h1>
          <p className="page-sub">{id ? "Update customer details" : "Register a new customer"}</p>
        </div>
        <button onClick={() => navigate("/admin/customers")} className="btn-outline flex items-center gap-1">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="erp-card p-6 animate-scaleIn max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
              <input value={form.company} onChange={set("company")} className="erp-input" placeholder="Company name" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
              <input value={form.branch} onChange={set("branch")} className="erp-input" placeholder="Branch" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1.5">Customer Name *</label>
              <input required value={form.customer_name} onChange={set("customer_name")} className="erp-input" placeholder="Full customer name" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Contact No</label>
              <input value={form.contact_no} onChange={set("contact_no")} className="erp-input" placeholder="Phone number" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Area</label>
              <input value={form.area} onChange={set("area")} className="erp-input" placeholder="Area / locality" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <textarea rows={3} value={form.address} onChange={set("address")} className="erp-input resize-none" placeholder="Full address" /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1">
              <CheckCircle2 size={15} />
              {saving ? "Saving…" : id ? "Update Customer" : "Create Customer"}
            </button>
            <button type="button" onClick={() => navigate("/admin/customers")} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
