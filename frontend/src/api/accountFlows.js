import { API_BASE } from "./config";
const BASE = API_BASE || "/api";

const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchAccountFlows() {
  const res = await fetch(`${BASE}/account-flows`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch flows");
  return res.json();
}

export async function getAccountFlow(id) {
  const res = await fetch(`${BASE}/account-flows/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function updateAccountFlow(id, payload) {
  const res = await fetch(`${BASE}/account-flows/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}
