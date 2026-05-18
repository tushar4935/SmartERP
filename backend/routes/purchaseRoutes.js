import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createPurchase,
  listPurchases,
  pendingPurchases,
  payPurchase,
  returnPurchase,
  pendingPurchaseReturns,
} from "../controllers/purchaseController.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createPurchase);
router.get("/", listPurchases);
router.get("/pending", pendingPurchases);
router.post("/pay", payPurchase);
router.post("/return", returnPurchase);
router.get("/returns/pending", pendingPurchaseReturns);

export default router;
