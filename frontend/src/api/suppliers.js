// frontend/src/api/suppliers.js

import { API_BASE } from "./config";

const BASE = API_BASE || "/api";

// 🔐 Attach auth token automatically
const authHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ======================================================
   📦 FETCH SUPPLIERS
   - All suppliers
   - Branch suppliers
   - Sub-branch suppliers
   - Search support
   ====================================================== */
export async function fetchSuppliers(params = {}) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${BASE}/suppliers?${query}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return res.json();
}

/* ======================================================
   ➕ CREATE SUPPLIER
   ====================================================== */
export async function createSupplier(payload) {
  const res = await fetch(`${BASE}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create supplier");
  }

  return res.json();
}

/* ======================================================
   ✏️ UPDATE SUPPLIER
   ====================================================== */
export async function updateSupplier(id, payload) {
  const res = await fetch(`${BASE}/suppliers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update supplier");
  }

  return res.json();
}

/* ======================================================
   🗑️ DELETE SUPPLIER
   ====================================================== */
export async function deleteSupplier(id) {
  const res = await fetch(`${BASE}/suppliers/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!res.ok) {
    throw new Error("Failed to delete supplier");
  }

  return res.json();
}

/* ======================================================
   🔍 GET SINGLE SUPPLIER (OPTIONAL – for edit/details page)
   ====================================================== */
export async function getSupplier(id) {
  const res = await fetch(`${BASE}/suppliers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch supplier");
  }

  return res.json();
}
