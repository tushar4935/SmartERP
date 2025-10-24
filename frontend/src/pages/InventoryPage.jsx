import React, { useState, useEffect } from 'react';
import { fetchStock } from '../api/api';

// This is the StockDetails component we discussed,
// now integrated as the InventoryPage
export default function InventoryPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        const data = await fetchStock();
        setStock(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch stock');
      }
      setLoading(false);
    };
    loadStock();
  }, []);

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="module-page">
      <h2>Inventory Module</h2>
      <p>Track stock, products, suppliers, and inventory reports here.</p>
      
      {/* You would add a "Add Item" button here */}
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>${item.unit_price}</td>
              <td>
                <button style={{ marginRight: 5 }}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
