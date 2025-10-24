// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Enable CORS (must be before routes)
app.use(cors());

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Test database connection
pool
  .connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

// ✅ Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import departmentRoutes from "./routes/department.js";
import employeeRoutes from "./routes/employee.js";
import financeRoutes from "./routes/finance.js";
import inventoryRoutes from "./routes/inventory.js";
import purchaseRoutes from "./routes/purchase.js";
import salesRoutes from "./routes/sales.js";

// ✅ Use routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/sales", salesRoutes);

// ✅ Root route (so browser shows message instead of “Cannot GET /”)
app.get("/", (req, res) => {
  res.send("✅ SmartERP Backend running successfully");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
