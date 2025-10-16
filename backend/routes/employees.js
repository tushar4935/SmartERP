// routes/employees.js
import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Get all employees
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add employee
router.post('/', async (req, res) => {
  const { name, email, department_id } = req.body;
  if (!name || !email || !department_id) {
    return res.status(400).json({ error: 'Name, email, and department_id required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO employees (name, email, department_id) VALUES ($1, $2, $3) RETURNING *',
      [name, email, department_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
