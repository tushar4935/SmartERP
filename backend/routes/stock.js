import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  listCategories,
  addCategory,
  updateCategory,
  listStock,
  addStockItem,
  updateStockItem
} from "../controllers/stockController.js";

const router = Router();

router.use(authMiddleware);

// Stock Categories
router.get("/categories", listCategories);
router.post("/categories", addCategory);
router.put("/categories/:id", updateCategory);

// Stock Items
router.get("/items", listStock);
router.post("/items", addStockItem);
router.put("/items/:id", updateStockItem);

export default router;
