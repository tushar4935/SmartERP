import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBranch, updateBranch, fetchBranches } from "../api/branches";

export default function BranchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ level: "", title: "", contact: "", address: "" });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchBranches()
      .then((data) => {
        const branch = (data.branches || []).find((b) => String(b.id) === String(id));
        if (!branch) throw new Error("Not found");
        setForm({ level: branch.level || "", title: branch.title || "", contact: branch.contact || "", address: branch.address || "" });
      })
      .catch(() => { alert("Failed to load branch"); navigate("/branches"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Branch title is required");
    setSaving(true);
    try {
      if (id) {
        await updateBranch(id, form);
      } else {
        await createBranch(form);
      }
      navigate("/branches");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{id ? "Edit Branch" : "New Branch"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Level</label>
          <input
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Main, Sub"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Contact</label>
          <input
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="bg-sky-600 text-white px-4 py-2 rounded">
            {saving ? "Saving..." : id ? "Update Branch" : "Create Branch"}
          </button>
          <button type="button" onClick={() => navigate("/branches")} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
