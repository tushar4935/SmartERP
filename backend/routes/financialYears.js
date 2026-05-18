// backend/routes/financialYears.js
import { Router } from "express";
import {
  listFinancialYears,
  getFinancialYear,
  createFinancialYear,
  updateFinancialYear,
  deleteFinancialYear
} from "../controllers/financialYearController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// require authentication
router.use(authMiddleware);

// list & view accessible to authenticated users
router.get("/", listFinancialYears);
router.get("/:id", getFinancialYear);

// admin-only create/update/delete
router.post("/", adminOnly, createFinancialYear);
router.put("/:id", adminOnly, updateFinancialYear);
router.delete("/:id", adminOnly, deleteFinancialYear);

export default router;
