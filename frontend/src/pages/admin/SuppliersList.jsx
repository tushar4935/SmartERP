import React, { useEffect, useState } from "react";
import { fetchSuppliers, deleteSupplier } from "../../api/suppliers";
import { useNavigate } from "react-router-dom";
import { Truck, Plus, Search, Edit2, Trash2, Eye } from "lucide-react";

export default function SuppliersList() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    fetchSuppliers()
      .then(d => setSuppliers(Array.isArray(d) ? d : d.suppliers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      setSuppliers(p => p.filter(s => s.id !== id));
    } catch { alert("Delete failed"); }
  };

  const filtered = suppliers.filter(s =>
    (s.supplier_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.company       || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.contact_no    || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Truck size={22} className="text-orange-500" /> All Suppliers
          </h1>
          <p className="page-sub">{suppliers.length} active vendors</p>
        </div>
        <button onClick={() => navigate("/admin/suppliers/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Supplier
        </button>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company or contact…"
            className="erp-input pl-9"
          />
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Supplier</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Assigned User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400">
                    <Truck size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No suppliers found.</p>
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{s.supplier_name}</td>
                  <td><span className="badge badge-orange">{s.company || "—"}</span></td>
                  <td className="text-slate-500">{s.contact_no || "—"}</td>
                  <td className="text-slate-500">{s.email || "—"}</td>
                  <td className="text-slate-500">{s.branch || "—"}</td>
                  <td className="text-slate-500">{s.assigned_user_name || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/suppliers/${s.id}`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition" title="View"><Eye size={15}/></button>
                      <button onClick={() => navigate(`/admin/suppliers/${s.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
