import React, { useEffect, useState } from "react";
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/employees";
import { fetchBranches } from "../api/branches";
import { Users, Plus, Edit2, Trash2, CheckCircle2, X, AlertCircle } from "lucide-react";

const BLANK = { branch_id: "", full_name: "", cnic: "", contact: "", designation: "", salary: "" };

export default function EmployeeRegistration() {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    Promise.allSettled([
      fetchEmployees().then(d => setEmployees(d.employees || [])),
      fetchBranches().then(d => setBranches(d.branches || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) { showToast("Full name is required", "error"); return; }
    setSaving(true);
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        setEmployees(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p));
        setEditingId(null);
        showToast("Employee updated!");
      } else {
        const res = await createEmployee(form);
        setEmployees(p => [res, ...p]);
        showToast("Employee added successfully!");
      }
      setForm(BLANK);
    } catch { showToast("Save failed", "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      branch_id:   emp.branch_id   || "",
      full_name:   emp.full_name   || "",
      cnic:        emp.cnic        || "",
      contact:     emp.contact     || "",
      designation: emp.designation || "",
      salary:      emp.salary      || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(p => p.filter(x => x.id !== id));
      showToast("Employee deleted");
    } catch { showToast("Delete failed", "error"); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 animate-popIn flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.type === "error" ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users size={22} className="text-indigo-500" /> Employees
          </h1>
          <p className="page-sub">{employees.length} employees registered</p>
        </div>
      </div>

      {/* Form */}
      <div className="erp-card p-6 animate-slideInLeft">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          {editingId ? <Edit2 size={16} className="text-amber-500" /> : <Plus size={16} className="text-indigo-500" />}
          {editingId ? "Update Employee" : "Add New Employee"}
        </h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
            <input
              placeholder="Full name"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              className="erp-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch</label>
            <select
              value={form.branch_id}
              onChange={e => setForm({ ...form, branch_id: e.target.value })}
              className="erp-select"
            >
              <option value="">— Select Branch —</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">CNIC</label>
            <input
              placeholder="35202-1234567-9"
              value={form.cnic}
              onChange={e => setForm({ ...form, cnic: e.target.value })}
              className="erp-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact</label>
            <input
              placeholder="Phone number"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
              className="erp-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation</label>
            <input
              placeholder="e.g. Manager, Cashier"
              value={form.designation}
              onChange={e => setForm({ ...form, designation: e.target.value })}
              className="erp-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Salary (PKR)</label>
            <input
              type="number"
              placeholder="Monthly salary"
              value={form.salary}
              onChange={e => setForm({ ...form, salary: e.target.value })}
              className="erp-input"
              min={0}
            />
          </div>
          <div className="col-span-full flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-1">
              <CheckCircle2 size={15} />
              {saving ? "Saving…" : editingId ? "Update Employee" : "Add Employee"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setForm(BLANK); setEditingId(null); }} className="btn-outline flex items-center gap-1">
                <X size={15} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="erp-card overflow-hidden animate-slideInRight">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Branch</th><th>Contact</th><th>Designation</th><th>Salary</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No employees yet. Add your first employee above.</p>
                  </td>
                </tr>
              ) : employees.map((emp, i) => (
                <tr key={emp.id} className={editingId === emp.id ? "bg-amber-50" : ""}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{emp.full_name}</td>
                  <td><span className="badge badge-blue">{emp.branch_title || "—"}</span></td>
                  <td className="text-slate-500">{emp.contact || "—"}</td>
                  <td><span className="badge badge-gray">{emp.designation || "—"}</span></td>
                  <td className="text-emerald-600 font-medium">
                    {emp.salary ? `PKR ${Number(emp.salary).toLocaleString()}` : "—"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(emp)} className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(emp.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
