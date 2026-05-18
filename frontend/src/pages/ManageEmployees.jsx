import React, { useEffect, useState } from "react";
import { fetchEmployees, deleteEmployee } from "../api/employees";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Search, Eye, Edit2, Trash2 } from "lucide-react";

export default function ManageEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    let mounted = true;
    fetchEmployees()
      .then(data => { if (mounted) setEmployees(data.employees || []); })
      .catch(console.error)
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees(p => p.filter(e => e.id !== id));
    } catch { alert("Delete failed."); }
  };

  const filtered = employees.filter(e =>
    (e.full_name    || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.designation  || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.contact      || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users size={22} className="text-indigo-500" /> Manage Employees
          </h1>
          <p className="page-sub">{employees.length} employees in the system</p>
        </div>
        <button onClick={() => navigate("/admin/employees/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, designation or contact…"
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
              <tr><th>#</th><th>Name</th><th>Branch</th><th>Contact</th><th>Designation</th><th>Salary</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No employees found.</p>
                  </td>
                </tr>
              ) : filtered.map((emp, i) => (
                <tr key={emp.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{emp.full_name}</td>
                  <td><span className="badge badge-blue">{emp.branch_title || "—"}</span></td>
                  <td className="text-slate-500">{emp.contact || "—"}</td>
                  <td><span className="badge badge-gray">{emp.designation || "—"}</span></td>
                  <td className="text-emerald-600 font-medium">
                    {emp.salary ? `PKR ${Number(emp.salary).toLocaleString()}` : "—"}
                  </td>
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
