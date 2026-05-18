import React, { useEffect, useState } from "react";
import { fetchAccountHeads, deleteAccountHead } from "../../api/accountHeads";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Edit2, Trash2, Hash } from "lucide-react";

export default function AccountHeadsList() {
  const navigate = useNavigate();
  const [heads, setHeads]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountHeads()
      .then(d => setHeads(Array.isArray(d) ? d : d.heads || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this account head?")) return;
    try {
      await deleteAccountHead(id);
      setHeads(p => p.filter(h => h.id !== id));
    } catch { alert("Delete failed"); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BookOpen size={22} className="text-violet-500" /> Account Heads
          </h1>
          <p className="page-sub">Top-level chart of accounts</p>
        </div>
        <button onClick={() => navigate("/admin/account-heads/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Account Head
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
              <tr><th>#</th><th>Account Head</th><th>Code</th><th>Created By</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {heads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400">
                    <BookOpen size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No account heads found.</p>
                  </td>
                </tr>
              ) : heads.map((h, i) => (
                <tr key={h.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{h.name}</td>
                  <td>
                    <span className="badge badge-blue flex items-center gap-1 w-fit">
                      <Hash size={11} /> {h.code || "—"}
                    </span>
                  </td>
                  <td className="text-slate-500">{h.created_by || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/account-heads/${h.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
