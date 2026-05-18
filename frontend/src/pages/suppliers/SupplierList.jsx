import { useEffect, useState } from "react";
import { fetchSuppliers, deleteSupplier } from "../../api/suppliers";
import { useNavigate } from "react-router-dom";
import { Truck, Plus, Search, Trash2 } from "lucide-react";

export default function SupplierList() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  const load = () =>
    fetchSuppliers()
      .then(d => setSuppliers(Array.isArray(d) ? d : d.suppliers || []))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) { alert("Delete failed: " + err.message); }
  };

  const filtered = suppliers.filter(s =>
    (s.supplier_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.company       || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Truck size={22} className="text-orange-500" /> Suppliers
          </h1>
          <p className="page-sub">Manage your vendor network</p>
        </div>
        <button onClick={() => navigate("/suppliers/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Supplier
        </button>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search suppliers…"
            className="erp-input pl-9"
          />
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="shimmer h-12 rounded" />)}
          </div>
        ) : (
          <table className="erp-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Company</th><th>Contact</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-14 text-center text-slate-400">
                  <Truck size={36} className="mx-auto mb-2 opacity-30" /><p>No suppliers found.</p>
                </td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{s.supplier_name}</td>
                  <td>{s.company || "—"}</td>
                  <td className="text-slate-500">{s.contact_no || "—"}</td>
                  <td className="text-slate-500">{s.email || "—"}</td>
                  <td>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete">
                      <Trash2 size={15} />
                    </button>
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
