// backend/routes/companies.js
import { Router } from "express";
import {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Public read list (if you want list view publicly for admin dashboard but still require auth, use authMiddleware)
// decision: require auth for listing — keep consistent with other routes
router.use(authMiddleware);

// List and view
router.get("/", listCompanies);
router.get("/:id", getCompany);

// Admin-only create/update/delete
router.post("/", adminOnly, createCompany);
router.put("/:id", adminOnly, updateCompany);
router.delete("/:id", adminOnly, deleteCompany);

export default router;
