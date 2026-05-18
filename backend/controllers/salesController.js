import pool from "../config/db.js";

/**
 * CREATE NEW SALE
 * POST /api/sales
 */
export const createSale = async (req, res) => {
  const clientId = req.user.client_id;
  const userId = req.user.id;
  const { customer_id, items, total_amount } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: "Sale items required" });
  }

  const invoiceNo = `INV-${Date.now()}`;
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const fy = await db.query(
      "SELECT id FROM financial_years WHERE is_active = true LIMIT 1"
    );
    if (!fy.rows.length) throw new Error("No active financial year found");

    // FIX: removed remaining_amount from INSERT — it is GENERATED ALWAYS AS
    // (total_amount - paid_amount) STORED. PostgreSQL computes it automatically.
    const saleRes = await db.query(
      `INSERT INTO sales
       (invoice_no, client_id, customer_id, financial_year_id,
        total_amount, paid_amount, status, created_by)
       VALUES ($1,$2,$3,$4,$5,0,'PENDING',$6)
       RETURNING *`,
      [invoiceNo, clientId, customer_id, fy.rows[0].id, total_amount, userId]
    );

    const saleId = saleRes.rows[0].id;

    for (const item of items) {
      await db.query(
        `INSERT INTO sale_items (sale_id, stock_item_id, qty, unit_price)
         VALUES ($1,$2,$3,$4)`,
        [saleId, item.id, item.qty, item.price]
      );
      await db.query(
        `UPDATE stock_items SET current_qty = current_qty - $1 WHERE id = $2`,
        [item.qty, item.id]
      );
    }

    await db.query("COMMIT");
    res.status(201).json(saleRes.rows[0]);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("createSale error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    db.release();
  }
};

/**
 * ALL SALES
 * GET /api/sales
 */
export const listSales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.customer_name
       FROM sales s
       JOIN customers c ON s.customer_id = c.id
       WHERE s.client_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("listSales error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PENDING PAYMENT SALES
 * GET /api/sales/pending
 */
export const pendingSales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.customer_name
       FROM sales s
       JOIN customers c ON s.customer_id = c.id
       WHERE s.client_id = $1 AND s.remaining_amount > 0
       ORDER BY s.created_at DESC`,
      [req.user.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("pendingSales error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PAY SALE AMOUNT
 * POST /api/sales/pay
 */
export const paySale = async (req, res) => {
  const { sale_id, amount } = req.body;

  if (!sale_id || !amount) {
    return res.status(400).json({ error: "sale_id and amount are required" });
  }

  try {
    await pool.query(
      `INSERT INTO sale_payments (sale_id, amount, received_by) VALUES ($1,$2,$3)`,
      [sale_id, amount, req.user.id]
    );

    // FIX: removed remaining_amount from UPDATE — generated column,
    // PostgreSQL recomputes it automatically when paid_amount changes.
    await pool.query(
      `UPDATE sales
       SET paid_amount = paid_amount + $1,
           status = CASE
             WHEN paid_amount + $1 >= total_amount THEN 'PAID'
             ELSE 'PENDING'
           END
       WHERE id = $2`,
      [amount, sale_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("paySale error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * SALE RETURN
 * POST /api/sales/return
 */
export const returnSale = async (req, res) => {
  const { sale_id, return_total } = req.body;

  if (!sale_id || !return_total) {
    return res.status(400).json({ error: "sale_id and return_total required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO sale_returns (sale_id, return_total, paid_return)
       VALUES ($1,$2,0)
       RETURNING *`,
      [sale_id, return_total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("returnSale error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PENDING RETURNS
 * GET /api/sales/returns/pending
 */
export const pendingReturns = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, s.invoice_no, c.customer_name
       FROM sale_returns sr
       JOIN sales s ON sr.sale_id = s.id
       JOIN customers c ON s.customer_id = c.id
       WHERE s.client_id = $1 AND sr.remaining_return > 0
       ORDER BY sr.created_at DESC`,
      [req.user.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("pendingReturns error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
