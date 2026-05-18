import express from "express";
import pool from "../config/db.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUT /api/admin/clients/:id/categories  (admin only)
router.put("/admin/clients/:id/categories", authMiddleware, adminOnly, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: "categories must be an array" });
    }

    const { rows } = await pool.query(
      `UPDATE clients SET categories = $1 WHERE id = $2 RETURNING id, email, categories`,
      [JSON.stringify(categories), clientId]
    );

    if (!rows[0]) return res.status(404).json({ error: "Client not found" });
    return res.json({ success: true, client: rows[0] });
  } catch (err) {
    console.error("admin/clients/:id/categories error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/client/categories  (authenticated user — own data)
router.get("/client/categories", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, categories FROM clients WHERE id = $1",
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    return res.json({ categories: rows[0].categories || [] });
  } catch (err) {
    console.error("client/categories error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
