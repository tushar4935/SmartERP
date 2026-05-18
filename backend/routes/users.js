// backend/routes/users.js
import { Router } from "express";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all user routes - user must be authenticated
router.use(authMiddleware);

// Admin-only endpoints
router.get("/", adminOnly, listUsers);
router.get("/:id", adminOnly, getUserById);
router.post("/", adminOnly, createUser);
router.put("/:id", adminOnly, updateUser);
router.delete("/:id", adminOnly, deleteUser);

export default router;
