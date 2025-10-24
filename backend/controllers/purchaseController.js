import pool from '../config/db.js';

// @desc    Get all purchases
// @route   GET /api/purchases
export const listPurchases = async (req, res) => {
  try {
    // Example: Join with a suppliers table if you have one
    const result = await pool.query('SELECT * FROM purchases ORDER BY purchase_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('listPurchases error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Add a new purchase
// @route   POST /api/purchases
export const addPurchase = async (req, res) => {
  const { supplier_id, total_amount, items } = req.body;
  if (!total_amount || !items) {
    return res.status(400).json({ error: 'total_amount and items are required' });
  }
  
  // Note: This is a simplified example.
  // A real system would use a database transaction to:
  // 1. INSERT into 'purchases' table
  // 2. INSERT into 'purchase_items' table
  // 3. UPDATE 'stock' table quantities
  
  try {
    const result = await pool.query(
      'INSERT INTO purchases (supplier_id, total_amount, items_json) VALUES ($1, $2, $3) RETURNING *',
      [supplier_id || null, total_amount, JSON.stringify(items)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addPurchase error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
