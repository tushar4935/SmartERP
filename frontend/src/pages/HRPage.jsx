// src/pages/HRPage.jsx
import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import { fetchUsers } from "../api/api";

/**
 * HRPage - simple container using Tailwind utilities (removed module-page)
 *
 * Complexity: O(n) render where n = users.length (UserTable renders list)
 */

export default function HRPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">HR — Users</h1>
        <button className="rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm hover:bg-indigo-700">
          Add user
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading users...</div>
        ) : (
          <UserTable users={users} onEdit={(u) => console.log("edit", u)} onDelete={(u) => console.log("delete", u)} />
        )}
      </div>
    </div>
  );
}
