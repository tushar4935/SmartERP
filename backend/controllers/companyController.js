// backend/controllers/companyController.js
import pool from "../config/db.js";

/**
 * Companies controller
 */

// GET /api/companies  -> list companies
export const listCompanies = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, logo_url, address, contact_no, email FROM companies ORDER BY id");
    return res.json(result.rows);
  } catch (err) {
    console.error("listCompanies error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/companies/:id
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, name, logo_url, address, contact_no, email FROM companies WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("getCompany error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/companies  (admin only)
export const createCompany = async (req, res) => {
  try {
    const { name, logo_url, address, contact_no, email } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Name required" });

    const result = await pool.query(
      `INSERT INTO companies (name, logo_url, address, contact_no, email, created_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,logo_url,address,contact_no,email`,
      [name, logo_url || null, address || null, contact_no || null, email || null, req.user?.id || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createCompany error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/companies/:id  (admin only)
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, address, contact_no, email } = req.body;

    const result = await pool.query(
      `UPDATE companies SET name=$1, logo_url=$2, address=$3, contact_no=$4, email=$5, updated_at=now()
       WHERE id=$6 RETURNING id,name,logo_url,address,contact_no,email`,
      [name, logo_url || null, address || null, contact_no || null, email || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("updateCompany error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/companies/:id (admin only)
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM companies WHERE id=$1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteCompany error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
