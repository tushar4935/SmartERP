// backend/routes/branches.js
import { Router } from "express";
import {
  listBranches, getBranch, createBranch, updateBranch, deleteBranch,
  listBranchUsers, createBranchUser, updateBranchUser, deleteBranchUser
} from "../controllers/branchController.js";
import authMiddleware, { adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// require authentication for all
router.use(authMiddleware);

// Static/exact routes MUST come before parameterized /:id routes
router.get("/users", listBranchUsers);            // GET /api/branches/users
router.post("/users", adminOnly, createBranchUser);
router.put("/users/:id", adminOnly, updateBranchUser);
router.delete("/users/:id", adminOnly, deleteBranchUser);

// Branch endpoints
router.get("/", listBranches);
router.get("/:id", getBranch);

// Admin-only create/update/delete for branches
router.post("/", adminOnly, createBranch);
router.put("/:id", adminOnly, updateBranch);
router.delete("/:id", adminOnly, deleteBranch);

export default router;
