import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  listAccountControls,
  createAccountControl,
} from "../controllers/accountControlController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listAccountControls);
router.post("/", createAccountControl);

export default router;
