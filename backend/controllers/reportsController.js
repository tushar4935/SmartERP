import pool from "../config/db.js";

/**
 * TRIAL BALANCE
 * GET /api/accounting/trial-balance
 */
export const trialBalance = async (req, res) => {
  const result = await pool.query(`
    SELECT a.name,
           SUM(t.debit) AS debit,
           SUM(t.credit) AS credit
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    GROUP BY a.name
  `);

  res.json(result.rows);
};

/**
 * INCOME STATEMENT
 */
export const incomeStatement = async (req, res) => {
  const result = await pool.query(`
    SELECT a.type,
           SUM(t.credit - t.debit) AS amount
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE a.type IN ('INCOME','EXPENSE')
    GROUP BY a.type
  `);

  res.json(result.rows);
};

/**
 * BALANCE SHEET
 */
export const balanceSheet = async (req, res) => {
  const result = await pool.query(`
    SELECT a.type,
           SUM(t.debit - t.credit) AS balance
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE a.type IN ('ASSET','LIABILITY','EQUITY')
    GROUP BY a.type
  `);

  res.json(result.rows);
};
