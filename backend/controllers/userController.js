import pool from "../config/db.js";
import bcrypt from "bcryptjs";

// GET /api/users
export const listUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.contact_no, u.is_active,
              u.user_type_id, u.client_id, t.name AS user_type
       FROM users u
       LEFT JOIN user_types t ON u.user_type_id = t.id
       ORDER BY u.id`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("listUsers error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.contact_no, u.is_active,
              u.user_type_id, u.client_id, t.name AS user_type
       FROM users u
       LEFT JOIN user_types t ON u.user_type_id = t.id
       WHERE u.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("getUserById error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/users
// FIX: added client_id to INSERT so users are linked to a company.
// Without this, req.user.client_id is always null, causing every sales/purchase/
// customer query to filter by null — returning nothing or inserting bad data.
export const createUser = async (req, res) => {
  const { name, email, password, contact_no, user_type_id, client_id } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, contact_no, user_type_id, client_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, contact_no, user_type_id, client_id`,
      [name, email, password_hash, contact_no || null, user_type_id || null, client_id || null]
    );

    return res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("createUser error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, contact_no, user_type_id, is_active, client_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, contact_no = $2, user_type_id = $3,
           is_active = $4, client_id = $5, updated_at = now()
       WHERE id = $6
       RETURNING id, name, email, contact_no, user_type_id, is_active, client_id`,
      [
        name,
        contact_no || null,
        user_type_id || null,
        typeof is_active === "boolean" ? is_active : true,
        client_id || null,
        id,
      ]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("updateUser error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteUser error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
