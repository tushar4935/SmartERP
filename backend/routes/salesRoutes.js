import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createSale,
  listSales,
  pendingSales,
  paySale,
  returnSale,
  pendingReturns,
} from "../controllers/salesController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSale);
router.get("/", listSales);
router.get("/pending", pendingSales);
router.post("/pay", paySale);
router.post("/return", returnSale);
router.get("/returns/pending", pendingReturns);

export default router;
