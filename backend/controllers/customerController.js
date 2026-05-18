// backend/controllers/customerController.js
import pool from "../config/db.js";

/**
 * Customers controller (Client scoped)
 */

// ===================================
// GET: List Customers
// Supports:
// - search (q)
// - branch customers
// - sub-branch customers
// ===================================
export const listCustomers = async (req, res) => {
  try {
    const { q, type, branch } = req.query;
    const clientId = req.user.client_id; // 🔐 client isolation

    let sql = `
      SELECT
        c.id,
        c.company,
        c.branch,
        c.customer_name,
        c.contact_no,
        c.area,
        c.address,
        c.assigned_user_id,
        u.name AS assigned_user_name,
        creator.email AS created_by_email
      FROM customers c
      LEFT JOIN users u ON c.assigned_user_id = u.id
      LEFT JOIN users creator ON c.created_by = creator.id
      WHERE c.client_id = $1
    `;

    const params = [clientId];

    // 🔍 Search
    if (q) {
      params.push(`%${q}%`);
      sql += `
        AND (
          c.customer_name ILIKE $${params.length}
          OR c.company ILIKE $${params.length}
          OR c.contact_no ILIKE $${params.length}
        )
      `;
    }

    // 🏢 Branch customers
    if (type === "branch" && branch) {
      params.push(branch);
      sql += ` AND c.branch = $${params.length}`;
    }

    // 🏬 Sub-branch customers
    if (type === "sub-branch" && branch) {
      params.push(`${branch}%`);
      sql += ` AND c.branch ILIKE $${params.length}`;
    }

    sql += " ORDER BY c.id DESC";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error("listCustomers error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===================================
// GET: Single Customer
// ===================================
export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM customers
       WHERE id = $1 AND client_id = $2`,
      [id, req.user.client_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getCustomer error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===================================
// POST: Create Customer
// ===================================
export const createCustomer = async (req, res) => {
  try {
    const {
      company,
      branch,
      customer_name,
      contact_no,
      area,
      address,
      assigned_user_id,
    } = req.body;

    if (!customer_name?.trim()) {
      return res.status(400).json({ error: "Customer name required" });
    }

    const result = await pool.query(
      `INSERT INTO customers
        (client_id, company, branch, customer_name,
         contact_no, area, address,
         assigned_user_id, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        req.user.client_id,
        company || null,
        branch || null,
        customer_name.trim(),
        contact_no || null,
        area || null,
        address || null,
        assigned_user_id || null,
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createCustomer error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===================================
// PUT: Update Customer
// ===================================
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      branch,
      customer_name,
      contact_no,
      area,
      address,
      assigned_user_id,
    } = req.body;

    if (!customer_name?.trim()) {
      return res.status(400).json({ error: "Customer name required" });
    }

    const result = await pool.query(
      `UPDATE customers
       SET company=$1,
           branch=$2,
           customer_name=$3,
           contact_no=$4,
           area=$5,
           address=$6,
           assigned_user_id=$7,
           updated_at = now()
       WHERE id=$8 AND client_id=$9
       RETURNING *`,
      [
        company || null,
        branch || null,
        customer_name.trim(),
        contact_no || null,
        area || null,
        address || null,
        assigned_user_id || null,
        id,
        req.user.client_id,
      ]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: "Not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateCustomer error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===================================
// DELETE: Customer
// ===================================
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM customers
       WHERE id=$1 AND client_id=$2
       RETURNING id`,
      [id, req.user.client_id]
    );

    if (!result.rowCount)
      return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("deleteCustomer error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
