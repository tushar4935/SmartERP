
import pool from "../config/db.js";

// GET /api/account-flows
export const listAccountFlows = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT af.*, u.email AS user_email
       FROM account_flows af
       LEFT JOIN users u ON af.created_by = u.id
       ORDER BY af.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("listAccountFlows", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/account-flows
export const createAccountFlow = async (req, res) => {
  const { activity, head_account, control_account, sub_control_account } = req.body;

  if (!activity || !head_account || !control_account) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO account_flows
       (activity, head_account, control_account, sub_control_account, created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [activity, head_account, control_account, sub_control_account, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createAccountFlow", err);
    res.status(500).json({ error: "Server error" });
  }
};
