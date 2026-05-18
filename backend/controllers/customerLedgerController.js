import pool from "../config/db.js";

export const customerLedger = async (req, res) => {
  const { customer_id } = req.params;

  const result = await pool.query(
    `
    SELECT
      'Sale' AS type,
      invoice_no,
      total_amount AS debit,
      0 AS credit,
      created_at
    FROM sales
    WHERE customer_id = $1

    UNION ALL

    SELECT
      'Payment',
      reference_no,
      0,
      amount,
      created_at
    FROM customer_payments
    WHERE customer_id = $1

    ORDER BY created_at
    `,
    [customer_id]
  );

  res.json(result.rows);
};
