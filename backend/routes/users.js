// backend/routes/users.js
import { Router } from "express";
import { listUsers, getUserById } from "../controllers/userController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all user routes
router.use(authMiddleware);

// Admin-only: get all users
router.get("/", adminOnly, listUsers);

// Admin-only: get user by ID
router.get("/:id", adminOnly, getUserById);

export default router;
