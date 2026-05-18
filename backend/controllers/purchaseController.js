import pool from "../config/db.js";

/**
 * CREATE NEW PURCHASE
 * POST /api/purchases
 */
export const createPurchase = async (req, res) => {
  const clientId = req.user.client_id;
  const userId = req.user.id;
  const { supplier_id, items, total_amount } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: "Purchase items required" });
  }

  const invoiceNo = `PUR-${Date.now()}`;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fy = await client.query(
      "SELECT id FROM financial_years WHERE is_active = true LIMIT 1"
    );
    if (!fy.rows.length) throw new Error("No active financial year");

    const purchaseRes = await client.query(
      `INSERT INTO purchases
       (invoice_no, client_id, supplier_id, financial_year_id, total_amount, paid_amount, status, created_by)
       VALUES ($1,$2,$3,$4,$5,0,'PENDING',$6)
       RETURNING *`,
      [invoiceNo, clientId, supplier_id, fy.rows[0].id, total_amount, userId]
    );

    const purchaseId = purchaseRes.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO purchase_items (purchase_id, stock_item_id, qty, unit_price)
         VALUES ($1,$2,$3,$4)`,
        [purchaseId, item.id, item.qty, item.price]
      );
      await client.query(
        `UPDATE stock_items SET current_qty = current_qty + $1 WHERE id = $2`,
        [item.qty, item.id]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(purchaseRes.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createPurchase error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

/**
 * GET ALL PURCHASES
 * GET /api/purchases
 */
export const listPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, s.supplier_name
       FROM purchases p
       JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.client_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("listPurchases error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PENDING PURCHASES
 * GET /api/purchases/pending
 */
export const pendingPurchases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, s.supplier_name
       FROM purchases p
       JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.client_id = $1 AND p.remaining_amount > 0
       ORDER BY p.created_at DESC`,
      [req.user.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("pendingPurchases error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PAY PURCHASE
 * POST /api/purchases/pay
 */
export const payPurchase = async (req, res) => {
  const { purchase_id, amount } = req.body;

  if (!purchase_id || !amount) {
    return res.status(400).json({ error: "purchase_id and amount required" });
  }

  try {
    await pool.query(
      `INSERT INTO purchase_payments (purchase_id, amount, paid_by) VALUES ($1,$2,$3)`,
      [purchase_id, amount, req.user.id]
    );

    // FIX: removed remaining_amount — it is a computed/generated column in the purchases table.
    // Only update paid_amount and status; remaining_amount is derived automatically.
    await pool.query(
      `UPDATE purchases
       SET paid_amount = paid_amount + $1,
           status = CASE
             WHEN paid_amount + $1 >= total_amount THEN 'PAID'
             ELSE 'PENDING'
           END
       WHERE id = $2`,
      [amount, purchase_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("payPurchase error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PURCHASE RETURN
 * POST /api/purchases/return
 */
export const returnPurchase = async (req, res) => {
  const { purchase_id, return_total } = req.body;

  if (!purchase_id || !return_total) {
    return res.status(400).json({ error: "purchase_id and return_total required" });
  }

  try {
    // FIX: removed remaining_return from INSERT — it is a GENERATED ALWAYS column
    // in purchase_returns, computed as (return_total - paid_return).
    const result = await pool.query(
      `INSERT INTO purchase_returns (purchase_id, return_total, paid_return)
       VALUES ($1,$2,0)
       RETURNING *`,
      [purchase_id, return_total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("returnPurchase error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PENDING PURCHASE RETURNS
 * GET /api/purchases/returns/pending
 */
export const pendingPurchaseReturns = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, p.invoice_no, s.supplier_name
       FROM purchase_returns pr
       JOIN purchases p ON pr.purchase_id = p.id
       JOIN suppliers s ON p.supplier_id = s.id
       WHERE p.client_id = $1 AND pr.remaining_return > 0
       ORDER BY pr.created_at DESC`,
      [req.user.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("pendingPurchaseReturns error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
