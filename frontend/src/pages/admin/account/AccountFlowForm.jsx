import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccountFlow, updateAccountFlow } from "../../../api/accountFlows";
import { API_BASE } from "../../../api/config";
import { ArrowLeftRight, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const FIELDS = [
  { label: "Activity",                          field: "activity",            placeholder: "e.g. Sales Revenue",   required: true  },
  { label: "Head Account",                      field: "head_account",        placeholder: "e.g. Revenue",          required: true  },
  { label: "Control Account",                   field: "control_account",     placeholder: "e.g. Sales",            required: true  },
  { label: "Sub-Control Account (optional)",    field: "sub_control_account", placeholder: "e.g. Local Sales",      required: false },
];

export default function AccountFlowForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm]           = useState({ activity: "", head_account: "", control_account: "", sub_control_account: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading]     = useState(!!id);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!id) return;
    getAccountFlow(id)
      .then(data => setForm({
        activity:            data.activity            || "",
        head_account:        data.head_account        || "",
        control_account:     data.control_account     || "",
        sub_control_account: data.sub_control_account || "",
      }))
      .catch(() => { alert("Failed to load"); navigate("/admin/account-flows"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!form.activity || !form.head_account || !form.control_account) {
      showToast("Activity, head account, and control account are required");
      return;
    }
    setSubmitting(true);
    try {
      if (id) {
        await updateAccountFlow(id, form);
      } else {
        const res = await fetch(`${API_BASE}/account-flows`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      navigate("/admin/account-flows");
    } catch (err) { showToast("Failed: " + err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="erp-page animate-fadeIn">
      <div className="erp-card p-8 max-w-lg space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-10 rounded" />)}
      </div>
    </div>
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-popIn flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium bg-red-500">
          <AlertCircle size={16} /> {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ArrowLeftRight size={22} className="text-rose-500" />
            {id ? "Edit Account Flow" : "New Account Flow"}
          </h1>
          <p className="page-sub">Map a business activity to chart of accounts</p>
        </div>
        <button onClick={() => navigate(-1)} className="btn-outline flex items-center gap-1">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="erp-card p-6 animate-scaleIn max-w-lg space-y-4">
        {FIELDS.map(({ label, field, placeholder, required }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              placeholder={placeholder}
              className="erp-input"
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex items-center gap-1">
            <CheckCircle2 size={15} />
            {submitting ? "Saving…" : id ? "Update" : "Save"}
          </button>
          <button onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  );
}
