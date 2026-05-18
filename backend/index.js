import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import pool from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

pool
  .connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

// ─── Auth + Users ────────────────────────────────────────────
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import userTypesRoutes from "./routes/userTypes.js";

// ─── HR / Departments / Employees ────────────────────────────
import departmentRoutes from "./routes/department.js";
import employeeRoutes from "./routes/employee.js";
import employeesRoutes from "./routes/employees.js";

// ─── Finance / Inventory ─────────────────────────────────────
import financeRoutes from "./routes/finance.js";
import inventoryRoutes from "./routes/inventory.js";

// ─── Sales ───────────────────────────────────────────────────
// FIX: was imported twice (sales.js AND salesRoutes.js). Kept only salesRoutes.js
// because it includes all endpoints: create, list, pending, pay, return, pendingReturns.
import salesRoutes from "./routes/salesRoutes.js";

// ─── Purchases ───────────────────────────────────────────────
// FIX: was imported twice (purchase.js AND purchaseRoutes.js). Kept only purchaseRoutes.js.
import purchaseRoutes from "./routes/purchaseRoutes.js";

// ─── Suppliers ───────────────────────────────────────────────
// FIX: was imported twice (suppliers.js AND suppliersRoutes.js). Kept suppliersRoutes.js
// because it uses the correct auth middleware (auth.js, not authMiddleware.js).
import suppliersRoutes from "./routes/suppliersRoutes.js";

// ─── Companies / Financial Years / Customers ─────────────────
import companiesRoutes from "./routes/companies.js";
import financialYearsRoutes from "./routes/financialYears.js";
import customersRoutes from "./routes/customers.js";

// ─── Accounting ──────────────────────────────────────────────
// FIX: file was named " accountingRoutes.js" (leading space) — renamed to accountingRoutes.js
import accountingRoutes from "./routes/accountingRoutes.js";

// ─── Stock / Account Chart of Accounts ───────────────────────
import stockRoutes from "./routes/stock.js";
import accountControlsRoutes from "./routes/accountControls.js";
import accountSubControlsRoutes from "./routes/accountSubControls.js";
import accountFlowsRoutes from "./routes/accountFlows.js";
import accountHeadsRoutes from "./routes/accountHeads.js";

// ─── Admin / Branches ─────────────────────────────────────────
import adminClientRoutes from "./routes/adminClientRoutes.js";
import branchesRoutes from "./routes/branches.js";

// ─── File Uploads ─────────────────────────────────────────────
import uploadRoutes from "./routes/upload.js";

// ═══════════════════════════════════════════════════════════════
// Register Routes
// ═══════════════════════════════════════════════════════════════

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-types", userTypesRoutes);

app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employees", employeesRoutes);

app.use("/api/finance", financeRoutes);
app.use("/api/inventory", inventoryRoutes);

app.use("/api/sales", salesRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/suppliers", suppliersRoutes);

app.use("/api/companies", companiesRoutes);
app.use("/api/financial-years", financialYearsRoutes);
app.use("/api/customers", customersRoutes);

app.use("/api/accounting", accountingRoutes);

app.use("/api/stock", stockRoutes);
app.use("/api/account-controls", accountControlsRoutes);
app.use("/api/account-sub-controls", accountSubControlsRoutes);
app.use("/api/account-flows", accountFlowsRoutes);
app.use("/api/account-heads", accountHeadsRoutes);

app.use("/api", adminClientRoutes);
app.use("/api/branches", branchesRoutes);

app.use("/uploads", express.static(path.resolve("backend/uploads")));
app.use("/api", uploadRoutes);

// ─── Root ─────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("SmartERP Backend running");
});

// ─── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
