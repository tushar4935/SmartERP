import { Router } from "express";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";
import {
  listEmployees, getEmployee, addEmployee, updateEmployee, deleteEmployee,
  processPayroll, listPayrolls, getPayrollInvoice
} from "../controllers/employeeController.js";

const router = Router();
router.use(authMiddleware);

// Static routes MUST come before parameterized /:id routes
router.get("/payrolls", listPayrolls);
router.get("/payrolls/:id", getPayrollInvoice);
router.post("/payrolls", adminOnly, processPayroll);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", adminOnly, addEmployee);
router.put("/:id", adminOnly, updateEmployee);
router.delete("/:id", adminOnly, deleteEmployee);

export default router;
