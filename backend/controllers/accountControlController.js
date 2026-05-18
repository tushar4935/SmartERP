import pool from "../config/db.js";

// GET /api/account-controls
export const listAccountControls = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ac.*, u.email AS user_email
       FROM account_controls ac
       LEFT JOIN users u ON ac.created_by = u.id
       ORDER BY ac.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("listAccountControls", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/account-controls
export const createAccountControl = async (req, res) => {
  const { head_account, control_account } = req.body;

  if (!head_account || !control_account) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO account_controls (head_account, control_account, created_by)
       VALUES ($1,$2,$3) RETURNING *`,
      [head_account, control_account, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createAccountControl", err);
    res.status(500).json({ error: "Server error" });
  }
};
