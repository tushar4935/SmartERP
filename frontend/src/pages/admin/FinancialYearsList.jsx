import React, { useEffect, useState } from "react";
import { fetchFinancialYears, deleteFinancialYear } from "../../api/financialYears";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";

export default function FinancialYearsList() {
  const navigate = useNavigate();
  const [years, setYears]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialYears()
      .then(d => setYears(Array.isArray(d) ? d : d.years || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this financial year?")) return;
    try {
      await deleteFinancialYear(id);
      setYears(p => p.filter(y => y.id !== id));
    } catch { alert("Delete failed"); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Calendar size={22} className="text-blue-500" /> Financial Years
          </h1>
          <p className="page-sub">Manage accounting periods</p>
        </div>
        <button onClick={() => navigate("/admin/financial-years/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Year
        </button>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Year Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {years.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <Calendar size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No financial years found.</p>
                  </td>
                </tr>
              ) : years.map((y, i) => (
                <tr key={y.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{y.name}</td>
                  <td className="text-slate-500 text-sm">
                    {y.start_date ? new Date(y.start_date).toLocaleDateString("en-PK") : "—"}
                  </td>
                  <td className="text-slate-500 text-sm">
                    {y.end_date ? new Date(y.end_date).toLocaleDateString("en-PK") : "—"}
                  </td>
                  <td>
                    {y.is_active ? (
                      <span className="badge badge-green flex items-center gap-1 w-fit">
                        <CheckCircle2 size={11} /> Active
                      </span>
                    ) : (
                      <span className="badge badge-gray flex items-center gap-1 w-fit">
                        <XCircle size={11} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="text-slate-500">{y.created_by_email || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/financial-years/${y.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(y.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
