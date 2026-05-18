// backend/routes/accountHeads.js
import { Router } from "express";
import {
  listAccountHeads,
  getAccountHead,
  createAccountHead,
  updateAccountHead,
  deleteAccountHead
} from "../controllers/accountController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// require authentication for all account-head endpoints
router.use(authMiddleware);

// list & view available to authenticated users
router.get("/", listAccountHeads);
router.get("/:id", getAccountHead);

// admin-only create/update/delete
router.post("/", adminOnly, createAccountHead);
router.put("/:id", adminOnly, updateAccountHead);
router.delete("/:id", adminOnly, deleteAccountHead);

export default router;
