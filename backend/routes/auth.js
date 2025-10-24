// backend/routes/auth.js
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

export default router;
