// routes/finance.js
import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Get all finance records
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add finance record
router.post('/', async (req, res) => {
  const { description, amount, date } = req.body;
  if (!description || !amount || !date) {
    return res.status(400).json({ error: 'Description, amount, date required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO finance (description, amount, date) VALUES ($1, $2, $3) RETURNING *',
      [description, amount, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
