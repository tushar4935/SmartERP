// frontend/src/api/userTypes.js
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getUserTypes() {
  const res = await fetch(`${BASE}/user-types`, { headers: { "Content-Type": "application/json", ...authHeader() }});
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function createUserType(payload) {
  const res = await fetch(`${BASE}/user-types`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}
export async function updateUserType(id, payload) {
  const res = await fetch(`${BASE}/user-types/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...authHeader() }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}
export async function deleteUserType(id) {
  const res = await fetch(`${BASE}/user-types/${id}`, { method: "DELETE", headers: { ...authHeader() }});
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
