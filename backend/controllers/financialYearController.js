// backend/controllers/financialYearController.js
import pool from "../config/db.js";

/**
 * Financial Year controller
 */

// GET /api/financial-years
export const listFinancialYears = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fy.id, fy.name, fy.start_date, fy.end_date, fy.is_active, fy.created_by, u.email as created_by_email
       FROM financial_years fy
       LEFT JOIN users u ON fy.created_by = u.id
       ORDER BY fy.id DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("listFinancialYears error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/financial-years/:id
export const getFinancialYear = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, name, start_date, end_date, is_active, created_by FROM financial_years WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("getFinancialYear error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/financial-years   (admin only)
export const createFinancialYear = async (req, res) => {
  try {
    const { name, start_date, end_date, is_active } = req.body;
    if (!name || !start_date || !end_date) return res.status(400).json({ error: "Missing required fields" });

    // if is_active true, set all others false
    if (is_active) {
      await pool.query("UPDATE financial_years SET is_active = false WHERE is_active = true");
    }

    const result = await pool.query(
      `INSERT INTO financial_years (name, start_date, end_date, is_active, created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, name, start_date, end_date, is_active`,
      [name, start_date, end_date, is_active || false, req.user?.id || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createFinancialYear error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/financial-years/:id  (admin only)
export const updateFinancialYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, start_date, end_date, is_active } = req.body;
    if (is_active) {
      // deactivate others before activating this
      await pool.query("UPDATE financial_years SET is_active = false WHERE is_active = true");
    }
    const result = await pool.query(
      `UPDATE financial_years SET name=$1, start_date=$2, end_date=$3, is_active=$4, updated_at=now()
       WHERE id=$5 RETURNING id, name, start_date, end_date, is_active`,
      [name, start_date, end_date, is_active || false, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("updateFinancialYear error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/financial-years/:id  (admin only)
export const deleteFinancialYear = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM financial_years WHERE id=$1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteFinancialYear error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
