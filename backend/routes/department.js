// backend/routes/department.js
import { Router } from "express";
import { listDepartments, addDepartment } from "../controllers/departmentController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all department routes (admins only)
router.use(authMiddleware, adminOnly);

// Get all departments
router.get("/", listDepartments);

// Add a new department
router.post("/", addDepartment);

export default router;
