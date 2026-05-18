import { useEffect, useState } from "react";
import { fetchCategories } from "../../../api/stock";
import CategoryModal from "./CategoryModal";
import { FolderOpen, Plus, Edit2 } from "lucide-react";

export default function StockCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [open, setOpen]             = useState(false);
  const [editData, setEditData]     = useState(null);

  const load = () =>
    fetchCategories()
      .then(d => setCategories(Array.isArray(d) ? d : d.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditData(null); setOpen(true); };
  const openEdit = (c) => { setEditData(c); setOpen(true); };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FolderOpen size={22} className="text-teal-500" /> Stock Categories
          </h1>
          <p className="page-sub">{categories.length} categories configured</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr><th>#</th><th>Category Name</th><th>Created By</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-slate-400">
                    <FolderOpen size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No categories yet.</p>
                  </td>
                </tr>
              ) : categories.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{c.name}</td>
                  <td className="text-slate-500">{c.created_by_email || "—"}</td>
                  <td>
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <CategoryModal
          close={() => setOpen(false)}
          onSaved={() => { setOpen(false); load(); }}
          editData={editData}
        />
      )}
    </div>
  );
}
