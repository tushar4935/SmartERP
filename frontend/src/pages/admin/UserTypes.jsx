import React, { useEffect, useState } from "react";
import { getUserTypes, createUserType, updateUserType, deleteUserType } from "../../api/userTypes";
import { Shield, Plus, Edit2, Trash2, CheckCircle2, X } from "lucide-react";

export default function UserTypes() {
  const [types, setTypes]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName]       = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);

  const refresh = () =>
    getUserTypes()
      .then(d => setTypes(Array.isArray(d) ? d : d.types || []))
      .catch(console.error);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateUserType(editing.id, { name });
        setEditing(null);
      } else {
        await createUserType({ name });
      }
      setName("");
      await refresh();
    } catch (err) { alert("Save failed: " + (err.message || err)); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user type?")) return;
    try {
      await deleteUserType(id);
      setTypes(p => p.filter(x => x.id !== id));
    } catch (err) { alert("Delete failed: " + (err.message || err)); }
  };

  const startEdit = (t) => { setEditing(t); setName(t.name); };
  const cancelEdit = () => { setEditing(null); setName(""); };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield size={22} className="text-violet-500" /> User Types
          </h1>
          <p className="page-sub">Manage roles and access levels</p>
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className="erp-card p-5 animate-slideInLeft">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          {editing ? <Edit2 size={16} className="text-amber-500" /> : <Plus size={16} className="text-indigo-500" />}
          {editing ? `Editing: ${editing.name}` : "Add New User Type"}
        </h2>
        <div className="flex gap-3">
          <input
            className="erp-input flex-1"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            placeholder="Enter role name (e.g. Manager, Cashier)"
          />
          <button onClick={handleSave} disabled={saving || !name.trim()} className="btn-primary flex items-center gap-1">
            <CheckCircle2 size={15} />
            {saving ? "Saving…" : editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button onClick={cancelEdit} className="btn-outline flex items-center gap-1">
              <X size={15} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="erp-card overflow-hidden animate-slideInRight">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr><th>#</th><th>Role Name</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {types.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-slate-400">
                    <Shield size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No user types yet.</p>
                  </td>
                </tr>
              ) : types.map((t, i) => (
                <tr key={t.id} className={editing?.id === t.id ? "bg-amber-50" : ""}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">
                    <span className="badge badge-blue">{t.name}</span>
                  </td>
                  <td className="text-slate-500">{t.description || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(t)} className="p-1.5 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
