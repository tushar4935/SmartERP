// frontend/src/api/customers.js

import { API_BASE } from "./config";

const BASE = API_BASE || "/api";

// attach auth token
const authHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ======================================
// Fetch customers
// Supports:
// - search: q
// - branch customers
// - sub-branch customers
// ======================================
export async function fetchCustomers(params = {}) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${BASE}/customers?${query}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ======================================
// Get single customer
// ======================================
export async function getCustomer(id) {
  const res = await fetch(`${BASE}/customers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ======================================
// Create customer
// ======================================
export async function createCustomer(payload) {
  const res = await fetch(`${BASE}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ======================================
// Update customer
// ======================================
export async function updateCustomer(id, payload) {
  const res = await fetch(`${BASE}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

// ======================================
// Delete customer
// ======================================
export async function deleteCustomer(id) {
  const res = await fetch(`${BASE}/customers/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
