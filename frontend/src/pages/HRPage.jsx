import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees, deleteEmployee } from "../api/employees";
import { Users, Plus, Search, Trash2, Edit2, Eye } from "lucide-react";

export default function HRPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    fetchEmployees()
      .then(d => setEmployees(d.employees || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(p => p.filter(e => e.id !== id));
    } catch { alert("Delete failed"); }
  };

  const filtered = employees.filter(e =>
    (e.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.designation || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users size={22} className="text-purple-500"/> HR Management</h1>
          <p className="page-sub">Manage employees across all branches</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/employees/payroll")} className="btn-outline">Payroll</button>
          <button onClick={() => navigate("/admin/employees/new")} className="btn-primary flex items-center gap-1"><Plus size={16}/> Add Employee</button>
        </div>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or designation…" className="erp-input pl-9"/>
        </div>
      </div>

      <div className="erp-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="shimmer h-12 rounded"/>)}</div>
        ) : (
          <table className="erp-table">
            <thead><tr><th>#</th><th>Name</th><th>Designation</th><th>Contact</th><th>Branch</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-14 text-center text-slate-400"><Users size={36} className="mx-auto mb-2 opacity-30"/><p>No employees found.</p></td></tr>
              ) : filtered.map((emp, i) => (
                <tr key={emp.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{emp.full_name}</td>
                  <td><span className="badge badge-blue">{emp.designation || "—"}</span></td>
                  <td className="text-slate-500">{emp.contact || "—"}</td>
                  <td>{emp.branch_title || `Branch #${emp.branch_id || "—"}`}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/employees/${emp.id}`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition" title="View"><Eye size={15}/></button>
                      <button onClick={() => navigate(`/admin/employees/${emp.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(emp.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
