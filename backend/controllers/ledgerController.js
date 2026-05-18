import pool from "../config/db.js";

/**
 * GET LEDGER
 * GET /api/accounting/ledger/:accountId
 */
export const getLedger = async (req, res) => {
  const { accountId } = req.params;

  const result = await pool.query(
    `SELECT *
     FROM transactions
     WHERE account_id = $1
     ORDER BY created_at ASC`,
    [accountId]
  );

  res.json(result.rows);
};
