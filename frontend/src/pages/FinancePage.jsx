// src/pages/FinancePage.jsx
import React from "react";

/**
 * FinancePage - module-page replaced with Tailwind containers
 *
 * Complexity: O(1) layout-only
 */

export default function FinancePage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Finance</h1>
        <div className="text-sm text-gray-500">Overview</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
          <h4 className="text-xs text-gray-500">Revenue (monthly)</h4>
          <p className="mt-2 text-lg font-semibold text-gray-800">$24,500</p>
        </div>

        <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
          <h4 className="text-xs text-gray-500">Expenses</h4>
          <p className="mt-2 text-lg font-semibold text-gray-800">$8,200</p>
        </div>

        <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
          <h4 className="text-xs text-gray-500">Net</h4>
          <p className="mt-2 text-lg font-semibold text-gray-800">$16,300</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 border border-gray-100 shadow-sm">
        {/* Add charts or tables */}
        <p className="text-sm text-gray-600">Add financial charts here.</p>
      </div>
    </div>
  );
}
