import { API_BASE } from "./config";

const BASE = API_BASE || "/api";

const authHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchPurchases = () =>
  fetch(`${BASE}/purchases`, { headers: authHeader() }).then(res => res.json());

export const fetchPendingPurchases = () =>
  fetch(`${BASE}/purchases/pending`, { headers: authHeader() }).then(res => res.json());

export const createPurchase = (data) =>
  fetch(`${BASE}/purchases`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const payPurchase = (data) =>
  fetch(`${BASE}/purchases/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const returnPurchase = (data) =>
  fetch(`${BASE}/purchases/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const fetchPendingReturns = () =>
  fetch(`${BASE}/purchases/returns/pending`, {
    headers: authHeader(),
  }).then(res => res.json());
