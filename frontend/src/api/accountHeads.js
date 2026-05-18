// frontend/src/api/accountHeads.js
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchAccountHeads() {
  const res = await fetch(`${BASE}/account-heads`, { headers: { "Content-Type": "application/json", ...authHeader() }});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAccountHead(id) {
  const res = await fetch(`${BASE}/account-heads/${id}`, { headers: { "Content-Type": "application/json", ...authHeader() }});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createAccountHead(payload) {
  const res = await fetch(`${BASE}/account-heads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateAccountHead(id, payload) {
  const res = await fetch(`${BASE}/account-heads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteAccountHead(id) {
  const res = await fetch(`${BASE}/account-heads/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
