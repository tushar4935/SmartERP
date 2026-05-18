// frontend/src/pages/admin/FinancialYearEdit.jsx
import React, { useEffect, useState } from "react";
import { createFinancialYear, getFinancialYear, updateFinancialYear } from "../../api/financialYears";
import { useParams, useNavigate } from "react-router-dom";

export default function FinancialYearEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", is_active: false });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getFinancialYear(id);
        setForm({
          name: data.name,
          start_date: data.start_date,
          end_date: data.end_date,
          is_active: data.is_active
        });
      } catch (err) {
        alert("Failed to load");
        navigate("/admin/financial-years");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.start_date || !form.end_date) return alert("Please fill required fields");
    setSaving(true);
    try {
      if (id) {
        await updateFinancialYear(id, form);
        alert("Updated");
      } else {
        await createFinancialYear(form);
        alert("Created");
      }
      navigate("/admin/financial-years");
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">{id ? "Edit Financial Year" : "New Financial Year"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Financial Year (e.g. 2024-2025) *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Start Date *</label>
            <input type="date" value={form.start_date || ""} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-sm">End Date *</label>
            <input type="date" value={form.end_date || ""} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border px-3 py-2 rounded" required />
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <span className="text-sm">Set as active financial year</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate("/admin/financial-years")} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
