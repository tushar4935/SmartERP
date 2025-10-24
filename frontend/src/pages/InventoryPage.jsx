// src/pages/InventoryPage.jsx
import React, { useState, useEffect } from "react";
import { fetchStock } from "../api/api";

/**
 * InventoryPage - Tailwind CSS version
 * - Fully replaces old custom CSS (.module-page)
 * - Uses fetchStock() from api.js
 * - Responsive, clean design
 *
 * Complexity:
 *   - Time: O(n) (renders each stock item once)
 *   - Space: O(1) additional (except stock array)
 */

export default function InventoryPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        const data = await fetchStock();
        setStock(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch stock");
      } finally {
        setLoading(false);
      }
    };
    loadStock();
  }, []);

  // ---- Render States ----
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading inventory...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  // ---- Main UI ----
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Inventory Module
          </h2>
          <p className="text-sm text-gray-500">
            Track stock, products, suppliers, and reports here.
          </p>
        </div>

        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
          + Add Item
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Quantity</th>
              <th className="px-4 py-3 text-left">Unit Price</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {stock.length > 0 ? (
              stock.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-gray-700">{item.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.category}</td>
                  <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">
                    ${item.unit_price}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-100 transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No stock data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
