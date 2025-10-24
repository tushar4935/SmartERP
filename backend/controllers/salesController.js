import pool from '../config/db.js';

// @desc    Get all sales
// @route   GET /api/sales
export const listSales = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales ORDER BY sale_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('listSales error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Add a new sale
// @route   POST /api/sales
export const addSale = async (req, res) => {
  const { customer_id, total_amount, items } = req.body;
  if (!total_amount || !items) {
    return res.status(400).json({ error: 'total_amount and items are required' });
  }

  // Note: A real system would use a transaction to:
  // 1. INSERT into 'sales' table
  // 2. INSERT into 'sale_items' table
  // 3. UPDATE 'stock' table quantities (decrement)

  try {
    const result = await pool.query(
      'INSERT INTO sales (customer_id, total_amount, items_json) VALUES ($1, $2, $3) RETURNING *',
      [customer_id || null, total_amount, JSON.stringify(items)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addSale error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
