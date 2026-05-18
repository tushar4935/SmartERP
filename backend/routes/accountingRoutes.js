import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTransaction } from "../controllers/accountingController.js";
import { getLedger } from "../controllers/ledgerController.js";
import {
  trialBalance,
  incomeStatement,
  balanceSheet,
} from "../controllers/reportsController.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/transaction", createTransaction);
router.get("/ledger/:accountId", getLedger);
router.get("/trial-balance", trialBalance);
router.get("/income-statement", incomeStatement);
router.get("/balance-sheet", balanceSheet);

export default router;
