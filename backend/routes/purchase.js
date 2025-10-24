import { Router } from 'express';
import { listPurchases, addPurchase } from '../controllers/purchaseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Protect all purchase routes
router.use(authMiddleware);

router.get('/', listPurchases);
router.post('/', addPurchase);

export default router;
