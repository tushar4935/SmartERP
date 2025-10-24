// src/pages/SalesPage.jsx
import React from "react";

/**
 * SalesPage - replaced page-container with Tailwind
 *
 * Complexity: O(1) layout
 */

export default function SalesPage() {
  // if you fetch sales data, switch to state & useEffect
  const sampleSales = [
    { id: 1, product: "Laptop", qty: 2, total: "$1800" },
    { id: 2, product: "Phone", qty: 5, total: "$2500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Sales</h1>
        <div className="text-sm text-gray-500">Recent transactions</div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sampleSales.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{s.product}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.qty}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.total}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-100">View</button>
                    <button className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Invoice</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
