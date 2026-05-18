import { API_BASE } from "./config";

const BASE = API_BASE || "/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// =======================
// GENERAL TRANSACTION
// =======================
export const createTransaction = async (payload) => {
  const res = await fetch(`${BASE}/accounting/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

// =======================
// LEDGER
// =======================
export const fetchLedger = async (accountId) => {
  const res = await fetch(`${BASE}/accounting/ledger/${accountId}`, {
    headers: authHeader(),
  });
  return res.json();
};

// =======================
// REPORTS
// =======================
export const fetchTrialBalance = async () =>
  (await fetch(`${BASE}/accounting/trial-balance`, { headers: authHeader() })).json();

export const fetchIncomeStatement = async () =>
  (await fetch(`${BASE}/accounting/income-statement`, { headers: authHeader() })).json();

export const fetchBalanceSheet = async () =>
  (await fetch(`${BASE}/accounting/balance-sheet`, { headers: authHeader() })).json();
