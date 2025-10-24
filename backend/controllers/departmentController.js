import pool from '../config/db.js';

// @desc    Get all departments
// @route   GET /api/departments
export const listDepartments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('listDepartments error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Add a new department
// @route   POST /api/departments
export const addDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  try {
    const result = await pool.query(
      'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addDepartment error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
