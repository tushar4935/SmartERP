import { API_BASE } from "./config";
const BASE = API_BASE || "/api";

const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchAccountSubControls() {
  const res = await fetch(`${BASE}/account-sub-controls`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch sub controls");
  return res.json();
}
