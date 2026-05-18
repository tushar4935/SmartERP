// backend/routes/userTypes.js
import { Router } from "express";
import {
  listUserTypes,
  getUserType,
  createUserType,
  updateUserType,
  deleteUserType,
} from "../controllers/userTypesController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// protect and limit to admin only
router.use(authMiddleware);
router.get("/", adminOnly, listUserTypes);
router.get("/:id", adminOnly, getUserType);
router.post("/", adminOnly, createUserType);
router.put("/:id", adminOnly, updateUserType);
router.delete("/:id", adminOnly, deleteUserType);

export default router;
