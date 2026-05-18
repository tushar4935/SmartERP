// backend/routes/inventory.js
import { Router } from "express";
import {
  listInventory,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all inventory routes (admin only)
router.use(authMiddleware, adminOnly);

// Get all inventory items
router.get("/", listInventory);

// Add a new inventory item
router.post("/", addItem);

// Update an existing item
router.put("/:id", updateItem);

// Delete an item
router.delete("/:id", deleteItem);

export default router;
