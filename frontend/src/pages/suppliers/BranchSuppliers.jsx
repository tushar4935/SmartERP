import { useEffect, useState } from "react";
import { fetchSuppliers } from "../../api/suppliers";
import { useNavigate } from "react-router-dom";
import { Truck, Search, Edit2 } from "lucide-react";

export default function BranchSuppliers() {
  const navigate = useNavigate();
  const [branch, setBranch]   = useState("");
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!branch.trim()) return;
    setLoading(true);
    fetchSuppliers({ type: "branch", branch })
      .then(d => setData(Array.isArray(d) ? d : d.suppliers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [branch]);

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Truck size={22} className="text-orange-500" /> Branch Suppliers
          </h1>
          <p className="page-sub">Filter suppliers by branch name</p>
        </div>
      </div>

      <div className="erp-card p-5 animate-slideInLeft">
        <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          <Search size={15} /> Branch Name
        </label>
        <input
          value={branch}
          onChange={e => setBranch(e.target.value)}
          placeholder="Enter branch name…"
          className="erp-input max-w-xs"
        />
      </div>

      {branch && (
        <div className="erp-card overflow-hidden animate-slideInRight">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
            </div>
          ) : (
            <table className="erp-table">
              <thead>
                <tr><th>#</th><th>Supplier</th><th>Company</th><th>Contact</th><th>Email</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-400">No suppliers in this branch.</td></tr>
                ) : data.map((s, i) => (
                  <tr key={s.id}>
                    <td className="text-slate-400 text-xs">{i + 1}</td>
                    <td className="font-semibold">{s.supplier_name}</td>
                    <td>{s.company || "—"}</td>
                    <td className="text-slate-500">{s.contact_no || "—"}</td>
                    <td className="text-slate-500">{s.email || "—"}</td>
                    <td>
                      <button onClick={() => navigate(`/admin/suppliers/${s.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"><Edit2 size={15}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
