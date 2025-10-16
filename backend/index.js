// index.js - Main SmartERP backend server
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

import userRoutes from "./routes/users.js";
import departmentRoutes from "./routes/departments.js";
import employeeRoutes from "./routes/employees.js";
import inventoryRoutes from "./routes/inventory.js";
import financeRoutes from "./routes/finance.js";

const app = express();

// ======================
// 1️⃣ Middleware Setup
// ======================
app.use(cors());           // Enable CORS for frontend requests (like from Vite)
app.use(express.json());   // Parse incoming JSON requests

// ======================
// 2️⃣ Test Route
// ======================
app.get("/", (_req, res) => {
  res.send("✅ SmartERP Backend is Running Successfully!");
});

// ======================
// 3️⃣ API Routes
// ======================
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/finance", financeRoutes);

// ======================
// 4️⃣ Server Start
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
