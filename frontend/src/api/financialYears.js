// frontend/src/api/financialYears.js
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchFinancialYears() {
  const res = await fetch(`${BASE}/financial-years`, { headers: { "Content-Type": "application/json", ...authHeader() }});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getFinancialYear(id) {
  const res = await fetch(`${BASE}/financial-years/${id}`, { headers: { "Content-Type": "application/json", ...authHeader() }});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createFinancialYear(payload) {
  const res = await fetch(`${BASE}/financial-years`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateFinancialYear(id, payload) {
  const res = await fetch(`${BASE}/financial-years/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteFinancialYear(id) {
  const res = await fetch(`${BASE}/financial-years/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
