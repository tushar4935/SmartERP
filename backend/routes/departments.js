// routes/departments.js
import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Get all departments
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a department
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Department name required' });

  try {
    const result = await pool.query(
      'INSERT INTO departments (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
