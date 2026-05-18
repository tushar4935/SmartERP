// backend/controllers/accountController.js
import pool from "../config/db.js";

/**
 * Account Heads controller
 */

// GET /api/account-heads
export const listAccountHeads = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, code, description, created_by, created_at, updated_at
       FROM account_heads ORDER BY id`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("listAccountHeads error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/account-heads/:id
export const getAccountHead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, code, description, created_by, created_at, updated_at FROM account_heads WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("getAccountHead error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/account-heads  (admin only)
export const createAccountHead = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Name required" });

    const result = await pool.query(
      `INSERT INTO account_heads (name, code, description, created_by)
       VALUES ($1,$2,$3,$4) RETURNING id, name, code, description`,
      [name.trim(), code || '0', description || null, req.user?.id || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createAccountHead error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/account-heads/:id  (admin only)
export const updateAccountHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    const result = await pool.query(
      `UPDATE account_heads SET name=$1, code=$2, description=$3, updated_at=now()
       WHERE id=$4 RETURNING id, name, code, description`,
      [name.trim(), code || '0', description || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("updateAccountHead error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/account-heads/:id  (admin only)
export const deleteAccountHead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM account_heads WHERE id=$1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteAccountHead error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
