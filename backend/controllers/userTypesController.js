// backend/controllers/userTypesController.js
import pool from "../config/db.js";

/**
 * Controller for user_types
 */

// GET /api/user-types
export const listUserTypes = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, description FROM user_types ORDER BY id");
    return res.json(result.rows);
  } catch (err) {
    console.error("listUserTypes error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/user-types/:id
export const getUserType = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, name, description FROM user_types WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("getUserType error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/user-types
export const createUserType = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Name is required" });

    // unique constraint will protect duplicates, but check to give nicer message
    const exists = await pool.query("SELECT id FROM user_types WHERE name = $1", [name]);
    if (exists.rows.length > 0) return res.status(409).json({ error: "User type already exists" });

    const result = await pool.query(
      "INSERT INTO user_types(name, description) VALUES($1,$2) RETURNING id, name, description",
      [name, description || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createUserType error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/user-types/:id
export const updateUserType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await pool.query(
      "UPDATE user_types SET name=$1, description=$2, updated_at=now() WHERE id=$3 RETURNING id, name, description",
      [name, description || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("updateUserType error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/user-types/:id
export const deleteUserType = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally check for referencing users first
    const used = await pool.query("SELECT 1 FROM users WHERE user_type_id = $1 LIMIT 1", [id]);
    if (used.rows.length > 0) {
      // choose policy: reject deletion to avoid orphan users
      return res.status(400).json({ error: "Cannot delete: some users belong to this type" });
    }
    await pool.query("DELETE FROM user_types WHERE id = $1", [id]);
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteUserType error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
