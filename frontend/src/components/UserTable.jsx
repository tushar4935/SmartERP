// src/components/UserTable.jsx
import React from "react";

/**
 * UserTable - Tailwindized
 * - Replaces old custom classes (user-table, actions, edit-btn, delete-btn)
 * - Simple, responsive table layout using Tailwind utilities
 *
 * Complexity:
 * - Rendering complexity: O(n) where n = users.length
 * - Space: O(1) additional (apart from users prop)
 */

const UserTable = ({ users = [], onEdit, onDelete }) => {
  if (!users.length) {
    return (
      <p className="text-sm text-gray-500">No user data available.</p>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Role / Dept
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Qty/Meta
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Salary / Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((u, idx) => (
            <tr key={u.id ?? idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{u.name}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{u.role ?? u.department ?? "-"}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{u.meta ?? "-"}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{u.salary ?? u.price ?? "-"}</td>

              {/* Actions cell */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit && onEdit(u)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete && onDelete(u)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Example row fallback / sample (you can remove) */}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
