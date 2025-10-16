// routes/inventory.js
import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Get all inventory items
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add inventory item
router.post('/', async (req, res) => {
  const { name, quantity } = req.body;
  if (!name || quantity === undefined) {
    return res.status(400).json({ error: 'Name and quantity required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO inventory (name, quantity) VALUES ($1, $2) RETURNING *',
      [name, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
