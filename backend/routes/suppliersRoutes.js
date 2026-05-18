import express from "express";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";
import {
  createSupplier,
  listSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", listSuppliers);
router.get("/:id", getSupplier);
router.post("/", adminOnly, createSupplier);
router.put("/:id", adminOnly, updateSupplier);
router.delete("/:id", adminOnly, deleteSupplier);

export default router;
