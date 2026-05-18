import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  listAccountFlows,
  createAccountFlow,
} from "../controllers/accountFlowController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listAccountFlows);
router.post("/", createAccountFlow);

export default router;

