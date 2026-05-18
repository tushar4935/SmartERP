import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { listAccountSubControls } from "../controllers/accountSubControlController.js";

const router = Router();

router.use(authMiddleware);
router.get("/", listAccountSubControls);

export default router;

