// frontend/src/api/companies.js

// Base API URL
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Auth header generator
const authHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -------------------------------------------------------------
// GET ALL COMPANIES
// -------------------------------------------------------------
export async function fetchCompanies() {
  const res = await fetch(`${BASE}/companies`, {
    headers: { "Content-Type": "application/json", ...authHeader() }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch companies failed: ${text}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// GET SINGLE COMPANY BY ID
// -------------------------------------------------------------
export async function getCompany(id) {
  const res = await fetch(`${BASE}/companies/${id}`, {
    headers: { "Content-Type": "application/json", ...authHeader() }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Get company failed: ${text}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// CREATE A COMPANY
// -------------------------------------------------------------
export async function createCompany(payload) {
  const res = await fetch(`${BASE}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create company failed: ${text}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// UPDATE A COMPANY
// -------------------------------------------------------------
export async function updateCompany(id, payload) {
  const res = await fetch(`${BASE}/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update company failed: ${text}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// DELETE A COMPANY
// -------------------------------------------------------------
export async function deleteCompany(id) {
  const res = await fetch(`${BASE}/companies/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete company failed: ${text}`);
  }

  return res.json();
}

// -------------------------------------------------------------
// UPLOAD LOGO (multipart/form-data)
// Endpoint: POST /api/companies/upload-logo
// Returns: { url: "uploaded_file_url" }
// -------------------------------------------------------------
export async function uploadCompanyLogo(file) {
  const form = new FormData();
  form.append("logo", file);

  const res = await fetch(`${BASE}/companies/upload-logo`, {
    method: "POST",
    headers: { ...authHeader() }, // DON'T add content-type here
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Logo upload failed: ${text}`);
  }

  return res.json(); // { url: "..." }
}
