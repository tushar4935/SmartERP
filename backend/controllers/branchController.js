// backend/controllers/branchController.js
import pool from "../config/db.js";

/* Branch controller */

export const listBranches = async (req, res) => {
  try {
    // Optionally filter by client (if req.user has client id)
    const text = `SELECT id, client_id, level, title, contact, address, created_by, created_at
                  FROM branches
                  ORDER BY id DESC`;
    const { rows } = await pool.query(text);
    return res.json({ branches: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM branches WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { client_id, level, title, contact, address } = req.body;
    const created_by = req.user?.id || null;
    const q = `INSERT INTO branches (client_id, level, title, contact, address, created_by)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const { rows } = await pool.query(q, [client_id || null, level || null, title, contact || null, address || null, created_by]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, title, contact, address } = req.body;
    const q = `UPDATE branches SET level=$1, title=$2, contact=$3, address=$4, updated_at=now() WHERE id=$5 RETURNING *`;
    const { rows } = await pool.query(q, [level, title, contact, address, id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM branches WHERE id=$1", [id]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* Branch Users controller */

export const listBranchUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM branch_users ORDER BY id DESC");
    return res.json({ users: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createBranchUser = async (req, res) => {
  try {
    const { branch_id, name, email, contact, user_type, user_id } = req.body;
    const q = `INSERT INTO branch_users (branch_id, user_id, name, email, contact, user_type)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const { rows } = await pool.query(q, [branch_id, user_id || null, name, email || null, contact || null, user_type || null]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateBranchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, user_type } = req.body;
    const q = `UPDATE branch_users SET name=$1, email=$2, contact=$3, user_type=$4 WHERE id=$5 RETURNING *`;
    const { rows } = await pool.query(q, [name, email, contact, user_type, id]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteBranchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM branch_users WHERE id=$1", [id]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
