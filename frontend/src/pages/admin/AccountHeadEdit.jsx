// frontend/src/pages/admin/AccountHeadEdit.jsx
import React, { useEffect, useState } from "react";
import { createAccountHead, getAccountHead, updateAccountHead } from "../../api/accountHeads";
import { useParams, useNavigate } from "react-router-dom";

export default function AccountHeadEdit() {
  const { id } = useParams(); // undefined for new
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", code: "0", description: "" });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getAccountHead(id);
        setForm({ name: data.name || "", code: data.code || "0", description: data.description || "" });
      } catch (err) {
        alert("Failed to load");
        navigate("/admin/account-heads");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name required");
    setSaving(true);
    try {
      if (id) {
        await updateAccountHead(id, form);
        alert("Updated");
      } else {
        await createAccountHead(form);
        alert("Created");
      }
      navigate("/admin/account-heads");
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">{id ? "Edit Account Head" : "New Account Head"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Account Head Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block text-sm">Code</label>
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate("/admin/account-heads")} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
