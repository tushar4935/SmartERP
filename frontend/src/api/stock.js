const BASE = "/api";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// =========================
// CATEGORIES
// =========================
export async function fetchCategories() {
  const res = await fetch(`${BASE}/stock/categories`, { headers: authHeader() });
  return res.json();
}

export async function createCategory(payload) {
  const res = await fetch(`${BASE}/stock/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateCategory(id, payload) {
  const res = await fetch(`${BASE}/stock/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// =========================
// STOCK ITEMS
// =========================
export async function fetchStock() {
  const res = await fetch(`${BASE}/stock/items`, { headers: authHeader() });
  return res.json();
}

export async function createStockItem(payload) {
  const res = await fetch(`${BASE}/stock/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateStockItem(id, payload) {
  const res = await fetch(`${BASE}/stock/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// Alias — some pages import fetchStockItems, others import fetchStock. Both work.
export const fetchStockItems = fetchStock;
