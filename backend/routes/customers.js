// backend/routes/customers.js
import { Router } from "express";
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "../controllers/customerController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// require auth for all customer endpoints
router.use(authMiddleware);

// list & view available to authenticated users
router.get("/", listCustomers);
router.get("/:id", getCustomer);

// admin-only create/update/delete
router.post("/", adminOnly, createCustomer);
router.put("/:id", adminOnly, updateCustomer);
router.delete("/:id", adminOnly, deleteCustomer);

export default router;
