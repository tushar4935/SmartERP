import pool from '../config/db.js';

// @desc    Get all financial transactions
// @route   GET /api/finance/transactions
export const listTransactions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('listTransactions error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Add a new transaction
// @route   POST /api/finance/transactions
export const addTransaction = async (req, res) => {
  const { type, amount, description, date } = req.body;
  if (!type || typeof amount !== 'number') {
    return res.status(400).json({ error: 'type and numeric amount required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO transactions (type, amount, description, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, amount, description || null, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addTransaction error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
