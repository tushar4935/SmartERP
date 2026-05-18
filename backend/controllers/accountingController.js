import pool from "../config/db.js";

/**
 * CREATE GENERAL TRANSACTION
 * POST /api/accounting/transaction
 */
export const createTransaction = async (req, res) => {
  const { debit_account_id, credit_account_id, amount, description } = req.body;
  const clientId = req.user.client_id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO transactions
       (client_id, account_id, debit, description)
       VALUES ($1,$2,$3,$4)`,
      [clientId, debit_account_id, amount, description]
    );

    await client.query(
      `INSERT INTO transactions
       (client_id, account_id, credit, description)
       VALUES ($1,$2,$3,$4)`,
      [clientId, credit_account_id, amount, description]
    );

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
