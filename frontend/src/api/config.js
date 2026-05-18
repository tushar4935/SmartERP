// Centralized API base URL for all fetch-based API modules.
// Vite exposes env vars via import.meta.env (not process.env).
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
