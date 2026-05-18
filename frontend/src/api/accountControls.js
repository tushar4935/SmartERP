import { API_BASE } from "./config";

const BASE = API_BASE || "/api";

const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchAccountControls() {
  const res = await fetch(`${BASE}/account-controls`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch account controls");
  return res.json();
}

export async function createAccountControl(payload) {
  const res = await fetch(`${BASE}/account-controls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

export async function updateAccountControl(id, payload) {
  const res = await fetch(`${BASE}/account-controls/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

export async function getAccountControl(id) {
  const res = await fetch(`${BASE}/account-controls/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

