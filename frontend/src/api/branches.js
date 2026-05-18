import { API_BASE } from "./config";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchBranches() {
  const res = await fetch(`${API_BASE}/branches`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createBranch(data) {
  const res = await fetch(`${API_BASE}/branches`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateBranch(id, data) {
  const res = await fetch(`${API_BASE}/branches/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteBranch(id) {
  const res = await fetch(`${API_BASE}/branches/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchBranchUsers() {
  const res = await fetch(`${API_BASE}/branches/users`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch branch users");
  return res.json();
}
