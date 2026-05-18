import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createEmployee, updateEmployee, getEmployee } from "../../api/employees";
import { fetchBranches } from "../../api/branches";

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ branch_id: "", full_name: "", cnic: "", contact: "", designation: "" });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBranches().then((d) => setBranches(d.branches || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    getEmployee(id)
      .then((data) => setForm({
        branch_id: data.branch_id || "",
        full_name: data.full_name || "",
        cnic: data.cnic || "",
        contact: data.contact || "",
        designation: data.designation || "",
      }))
      .catch(() => { alert("Failed to load employee"); navigate("/admin/employees"); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) return alert("Full name is required");
    setSaving(true);
    try {
      if (id) {
        await updateEmployee(id, form);
      } else {
        await createEmployee(form);
      }
      navigate("/admin/employees");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{id ? "Edit Employee" : "Add Employee"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Branch</label>
          <select
            value={form.branch_id}
            onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Branch --</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Full Name *</label>
          <input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">CNIC</label>
            <input
              value={form.cnic}
              onChange={(e) => setForm({ ...form, cnic: e.target.value })}
              className="w-full border px-3 py-2 rounded"
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
        </div>

        <div>
          <label className="block text-sm mb-1">Designation</label>
          <input
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded">
            {saving ? "Saving..." : id ? "Update Employee" : "Add Employee"}
          </button>
          <button type="button" onClick={() => navigate("/admin/employees")} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
