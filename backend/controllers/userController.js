import pool from '../config/db.js';

// @desc    Get all users
// @route   GET /api/users
export const listUsers = async (req, res) => {
  try {
    // Select all fields *except* password
    const result = await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('listUsers error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getUserById error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
