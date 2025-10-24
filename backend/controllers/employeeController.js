import pool from '../config/db.js';

// @desc    Get all employees
// @route   GET /api/employees
export const listEmployees = async (req, res) => {
  const { dept_id } = req.query;
  try {
    let query = 'SELECT * FROM employees';
    let params = [];
    if (dept_id) {
      query += ' WHERE department_id = $1';
      params.push(dept_id);
    }
    query += ' ORDER BY id';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('listEmployees error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Add a new employee
// @route   POST /api/employees
export const addEmployee = async (req, res) => {
  const { name, email, department_id, role, salary } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO employees (name, email, department_id, role, salary) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, department_id || null, role || 'employee', salary || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addEmployee error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
