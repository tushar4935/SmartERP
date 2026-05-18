import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../api/users";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, Plus, Search, Eye, Edit2, Trash2, Shield } from "lucide-react";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchUsers()
      .then(d => setUsers(Array.isArray(d) ? d : d.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(p => p.filter(x => x.id !== id));
    } catch { alert("Delete failed"); }
  };

  const filtered = users.filter(u =>
    (u.name     || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email    || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.user_type|| "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <UsersIcon size={22} className="text-indigo-500" /> System Users
          </h1>
          <p className="page-sub">{users.length} registered users</p>
        </div>
        <button onClick={() => navigate("/admin/users/new")} className="btn-primary flex items-center gap-1">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or role…"
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
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <UsersIcon size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No users found.</p>
                  </td>
                </tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{u.name}</td>
                  <td className="text-slate-500">{u.email}</td>
                  <td className="text-slate-500">{u.contact_no || "—"}</td>
                  <td>
                    <span className="badge badge-blue flex items-center gap-1 w-fit">
                      <Shield size={11} /> {u.user_type || u.role || "—"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/users/${u.id}`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition" title="View"><Eye size={15}/></button>
                      <button onClick={() => navigate(`/admin/users/${u.id}/edit`)} className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition" title="Edit"><Edit2 size={15}/></button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition" title="Delete"><Trash2 size={15}/></button>
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
