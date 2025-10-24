// frontend/src/api/api.js
import axios from "axios";

// ✅ Create a single Axios instance using .env backend URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// ✅ Automatically attach JWT token (if exists) to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------
// ✅ Auth Functions
// --------------------------------------
export const loginUser = async (email, password) => {
  try {
    const res = await API.post("/auth/login", { email, password });
    return res.data; // ✅ backend returns { message, token, user }
  } catch (err) {
    // ✅ If backend gives 401 or 400, forward exact message
    throw new Error(err.response?.data?.message || "Invalid credentials");
  }
};

// --------------------------------------
// ✅ User / HR Functions
// --------------------------------------
export const fetchUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

// --------------------------------------
// ✅ Inventory Functions
// --------------------------------------
export const fetchStock = async () => {
  const res = await API.get("/inventory");
  return res.data;
};

// ✅ Export instance for other modules
export default API;
