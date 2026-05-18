// backend/controllers/supplierController.js
import pool from "../config/db.js";

/**
 * CREATE SUPPLIER
 * POST /api/suppliers
 */
export const createSupplier = async (req, res) => {
  try {
    const {
      company,
      branch,
      supplier_name,
      contact_no,
      email,
      address,
      description,
      assigned_user_id,
    } = req.body;

    if (!supplier_name?.trim()) {
      return res.status(400).json({ error: "Supplier name required" });
    }

    const result = await pool.query(
      `INSERT INTO suppliers
       (client_id, company, branch, supplier_name, contact_no, email, address, description, assigned_user_id, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        req.user.client_id,
        company || null,
        branch || null,
        supplier_name.trim(),
        contact_no || null,
        email || null,
        address || null,
        description || null,
        assigned_user_id || null,
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createSupplier error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * LIST SUPPLIERS
 * GET /api/suppliers
 * ?q=&type=branch|sub-branch&branch=
 */
export const listSuppliers = async (req, res) => {
  try {
    const { q, type, branch } = req.query;
    const clientId = req.user.client_id;

    let sql = `
      SELECT s.*, u.name AS assigned_user_name, creator.email AS created_by_email
      FROM suppliers s
      LEFT JOIN users u ON s.assigned_user_id = u.id
      LEFT JOIN users creator ON s.created_by = creator.id
      WHERE s.client_id = $1
    `;
    const params = [clientId];

    // 🔍 Search
    if (q) {
      params.push(`%${q}%`);
      sql += `
        AND (
          s.supplier_name ILIKE $${params.length}
          OR s.company ILIKE $${params.length}
          OR s.contact_no ILIKE $${params.length}
        )
      `;
    }

    // 🏢 Branch suppliers
    if (type === "branch" && branch) {
      params.push(branch);
      sql += ` AND s.branch = $${params.length}`;
    }

    // 🏬 Sub-branch suppliers
    if (type === "sub-branch" && branch) {
      params.push(`${branch}%`);
      sql += ` AND s.branch ILIKE $${params.length}`;
    }

    sql += " ORDER BY s.id DESC";

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error("listSuppliers error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET SINGLE SUPPLIER
 * GET /api/suppliers/:id
 */
export const getSupplier = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM suppliers
       WHERE id = $1 AND client_id = $2`,
      [req.params.id, req.user.client_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getSupplier error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * UPDATE SUPPLIER
 * PUT /api/suppliers/:id
 */
export const updateSupplier = async (req, res) => {
  try {
    const {
      company,
      branch,
      supplier_name,
      contact_no,
      email,
      address,
      description,
      assigned_user_id,
    } = req.body;

    const result = await pool.query(
      `UPDATE suppliers SET
        company=$1,
        branch=$2,
        supplier_name=$3,
        contact_no=$4,
        email=$5,
        address=$6,
        description=$7,
        assigned_user_id=$8,
        updated_at=now()
       WHERE id=$9 AND client_id=$10
       RETURNING *`,
      [
        company || null,
        branch || null,
        supplier_name?.trim(),
        contact_no || null,
        email || null,
        address || null,
        description || null,
        assigned_user_id || null,
        req.params.id,
        req.user.client_id,
      ]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("updateSupplier error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE SUPPLIER
 * DELETE /api/suppliers/:id
 */
export const deleteSupplier = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM suppliers
       WHERE id=$1 AND client_id=$2
       RETURNING id`,
      [req.params.id, req.user.client_id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteSupplier error", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
