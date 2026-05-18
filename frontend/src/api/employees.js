// frontend/src/api/employees.js
import { API_BASE } from "./config";

// Fallback if API_BASE is undefined
const BASE = API_BASE || "/api";

// Attach token automatically
const authHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------------------------------------
// 📌 Fetch All Employees (keeps previous behavior)
// ---------------------------------------------
export async function fetchEmployees(query = {}) {
  const qs = new URLSearchParams(query).toString();
  const url = `${BASE}/employees${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch employees");

  return res.json(); // returns { employees: [...] }
}

// ---------------------------------------------
// 📌 Add employee
// ---------------------------------------------
export async function createEmployee(payload) {
  const res = await fetch(`${BASE}/employees`, {
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

// ---------------------------------------------
// 📌 Update employee
// ---------------------------------------------
export async function updateEmployee(id, payload) {
  const res = await fetch(`${BASE}/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

// ---------------------------------------------
// 📌 Delete an Employee
// ---------------------------------------------
export async function deleteEmployee(id) {
  const res = await fetch(`${BASE}/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) throw new Error("Delete failed");

  return res.json();
}

// ---------------------------------------------
// 📌 Payroll: process a salary
// ---------------------------------------------
export async function processPayroll(payload) {
  const res = await fetch(`${BASE}/employees/payrolls`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Process payroll failed");
  return res.json();
}

// ---------------------------------------------
// 📌 Fetch payroll history
// ---------------------------------------------
export async function fetchPayrolls() {
  const res = await fetch(`${BASE}/employees/payrolls`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error("Fetch payrolls failed");
  return res.json();
}

// ---------------------------------------------
// 📌 Fetch single payroll invoice
// ---------------------------------------------
export async function fetchPayrollInvoice(id) {
  const res = await fetch(`${BASE}/employees/payrolls/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error("Fetch invoice failed");
  return res.json();
}

// ---------------------------------------------
// GET single employee by ID
// ---------------------------------------------
export async function getEmployee(id) {
  const res = await fetch(`${BASE}/employees/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}
