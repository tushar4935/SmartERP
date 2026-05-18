// frontend/src/api/users.js
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchUsers() {
  const res = await fetch(`${BASE}/users`, { headers: { "Content-Type": "application/json", ...authHeader() }});
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function createUser(payload) {
  const res = await fetch(`${BASE}/users`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}
export async function deleteUser(id) {
  const res = await fetch(`${BASE}/users/${id}`, { method: "DELETE", headers: { ...authHeader() }});
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
