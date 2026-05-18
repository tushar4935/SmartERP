import React, { useEffect, useState } from "react";
import { fetchCompanies, deleteCompany } from "../../api/companies";
import { useNavigate } from "react-router-dom";
import { Briefcase, Plus, Eye, Edit2, Trash2, Building2 } from "lucide-react";

export default function CompaniesList() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchCompanies()
      .then(d => setCompanies(Array.isArray(d) ? d : d.companies || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this company?")) return;
    try {
      await deleteCompany(id);
      setCompanies(p => p.filter(c => c.id !== id));
    } catch { alert("Delete failed"); }
  };

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Briefcase size={22} className="text-sky-500" /> Companies
          </h1>
          <p className="page-sub">{companies.length} registered companies</p>
        </div>
        <button onClick={() => navigate("/admin/company-registration")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> Add Company
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-36 rounded-xl" />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="erp-card p-14 text-center text-slate-400">
          <Building2 size={36} className="mx-auto mb-2 opacity-30" />
          <p>No companies registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {companies.map(c => (
            <div key={c.id} className="erp-card p-5 animate-fadeIn hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.name} className="h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center shadow">
                    <Briefcase size={18} className="text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-base">{c.name}</h3>
              {c.address && <p className="text-xs text-slate-500 mt-1">{c.address}</p>}
              {c.contact  && <p className="text-xs text-slate-400 mt-0.5">{c.contact}</p>}
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/admin/company/${c.id}`)}
                  className="flex-1 btn-outline text-xs flex items-center justify-center gap-1"
                >
                  <Eye size={13} /> View
                </button>
                <button
                  onClick={() => navigate(`/admin/company/${c.id}/edit`)}
                  className="flex-1 btn-outline text-xs flex items-center justify-center gap-1"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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
