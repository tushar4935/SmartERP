import React, { useEffect, useState } from "react";
import { fetchBranches, deleteBranch } from "../api/branches";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Edit2, Trash2, MapPin } from "lucide-react";

export default function BranchesList() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchBranches()
      .then(d => setBranches(d.branches || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this branch?")) return;
    try {
      await deleteBranch(id);
      setBranches(p => p.filter(b => b.id !== id));
    } catch { alert("Delete failed"); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Building2 size={22} className="text-purple-500" /> Branches
          </h1>
          <p className="page-sub">{branches.length} company branches</p>
        </div>
        <button onClick={() => navigate("/branches/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Branch
        </button>
      </div>

      {/* branch cards or table */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-32 rounded-xl" />)}
        </div>
      ) : branches.length === 0 ? (
        <div className="erp-card p-14 text-center text-slate-400">
          <Building2 size={36} className="mx-auto mb-2 opacity-30" />
          <p>No branches yet. Create your first branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {branches.map(b => (
            <div key={b.id} className="erp-card p-5 animate-fadeIn hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow">
                  <Building2 size={18} className="text-white" />
                </div>
                <span className="badge badge-blue">Level {b.level || "—"}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-base">{b.title}</h3>
              {b.contact && (
                <p className="text-xs text-slate-500 mt-1">{b.contact}</p>
              )}
              {b.address && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin size={11} /> {b.address}
                </p>
              )}
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/branches/${b.id}/edit`)}
                  className="flex-1 btn-outline text-xs flex items-center justify-center gap-1"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
