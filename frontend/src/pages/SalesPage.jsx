// frontend/src/pages/SalesPage.jsx
import React from "react";

export default function SalesPage() {
  return (
    <div className="page-container">
      <h2>Sales Module</h2>
      <p>Manage orders, invoices, and sales reports here.</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Tushar</td>
            <td>Laptop</td>
            <td>2</td>
            <td>$1800</td>
            <td>Edit | Delete</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
