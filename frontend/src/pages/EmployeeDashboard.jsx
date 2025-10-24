// src/pages/EmployeeDashboard.jsx
import React from "react";

/**
 * EmployeeDashboard - module-page replaced with Tailwind utilities
 *
 * Complexity: O(1) (layout)
 */

export default function EmployeeDashboard() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">My Tasks</h3>
          <p className="mt-2 text-lg font-semibold text-gray-800">12</p>
        </div>

        <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Team</h3>
          <p className="mt-2 text-lg font-semibold text-gray-800">5 members</p>
        </div>

        <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Leaves</h3>
          <p className="mt-2 text-lg font-semibold text-gray-800">2 left</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
        {/* Add your employee-specific widgets here */}
        <p className="text-sm text-gray-600">Welcome to your dashboard. Add charts or lists here.</p>
      </div>
    </div>
  );
}
