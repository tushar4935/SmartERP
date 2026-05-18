
import pool from "../config/db.js";

// GET /api/account-sub-controls
export const listAccountSubControls = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT asc1.*, ac.head_account, ac.control_account, u.email AS user_email
       FROM account_sub_controls asc1
       JOIN account_controls ac ON asc1.account_control_id = ac.id
       LEFT JOIN users u ON asc1.created_by = u.id
       ORDER BY asc1.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("listAccountSubControls", err);
    res.status(500).json({ error: "Server error" });
  }
};
