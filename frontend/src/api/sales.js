import { API_BASE } from "./config";

const BASE = API_BASE || "/api";

const authHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --------------------
// NEW SALE
// --------------------
export async function createSale(payload) {
  const res = await fetch(`${BASE}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Sale creation failed");
  return res.json();
}

// --------------------
// ALL SALES
// --------------------
export async function fetchSales(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/sales?${query}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch sales");
  return res.json();
}

// --------------------
// PENDING PAYMENTS
// --------------------
export async function fetchPendingSales() {
  const res = await fetch(`${BASE}/sales/pending`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch pending sales");
  return res.json();
}

// --------------------
// SALE RETURNS
// --------------------
export async function fetchSaleReturns(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/sales/returns?${query}`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch returns");
  return res.json();
}

export async function paySale(payload) {
  const res = await fetch(`${BASE}/sales/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Payment failed");
  return res.json();
}

export async function returnSale(payload) {
  const res = await fetch(`${BASE}/sales/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Return failed");
  return res.json();
}

export async function fetchPendingReturns() {
  const res = await fetch(`${BASE}/sales/returns/pending`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}
