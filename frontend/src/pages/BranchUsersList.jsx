import React, { useEffect, useState } from "react";
import { fetchBranchUsers } from "../api/branches";
import { Users, Search, Shield } from "lucide-react";

export default function BranchUsersList() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchBranchUsers()
      .then(d => setUsers(d.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    (u.name      || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email     || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.user_type || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="erp-page animate-fadeIn space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Users size={22} className="text-indigo-500" /> Branch Users
          </h1>
          <p className="page-sub">{users.length} users assigned to branches</p>
        </div>
      </div>

      <div className="erp-card p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or user type…"
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
                <th>Branch</th>
                <th>User Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Users size={36} className="mx-auto mb-2 opacity-30" />
                    <p>No branch users found.</p>
                  </td>
                </tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-semibold">{u.name}</td>
                  <td className="text-slate-500">{u.email}</td>
                  <td className="text-slate-500">{u.contact || "—"}</td>
                  <td><span className="badge badge-blue">{u.branch_title || `Branch #${u.branch_id || "—"}`}</span></td>
                  <td>
                    <span className="badge badge-green flex items-center gap-1 w-fit">
                      <Shield size={11} /> {u.user_type || "—"}
                    </span>
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
