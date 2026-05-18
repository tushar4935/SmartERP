import React, { useEffect, useState } from "react";
import { fetchCustomers, deleteCustomer } from "../../api/customers";
import { useNavigate } from "react-router-dom";
import { UserCheck, Plus, Search, Edit2, Trash2, Eye } from "lucide-react";

export default function CustomersList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    fetchCustomers()
      .then(d => setCustomers(Array.isArray(d) ? d : d.customers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      setCustomers(p => p.filter(c => c.id !== id));
    } catch { alert("Delete failed"); }
  };

  const filtered = customers.filter(c =>
    (c.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.contact_no    || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.area          || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <UserCheck size={22} className="text-emerald-500" /> All Customers
          </h1>
          <p className="page-sub">{customers.length} registered customers</p>
        </div>
        <button onClick={() => navigate("/admin/customers/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> New Customer
        </button>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, contact or area…"
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
                <th>Customer</th>
                <th>Branch</th>
                <th>Contact</th>
                <th>Area</th>
                <th>Address</th>
                <th>Assigned User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400">
                    <UserCheck size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No customers found.</p>
                  </td>
                </tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{c.customer_name}</td>
                  <td><span className="badge badge-blue">{c.branch || "—"}</span></td>
                  <td className="text-slate-500">{c.contact_no || "—"}</td>
                  <td className="text-slate-500">{c.area || "—"}</td>
                  <td className="text-slate-500 text-sm max-w-40 truncate">{c.address || "—"}</td>
                  <td className="text-slate-500">{c.assigned_user_name || "—"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/customers/${c.id}`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition" title="View"><Eye size={15}/></button>
                      <button onClick={() => navigate(`/admin/customers/${c.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
