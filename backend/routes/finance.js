import { Router } from 'express';
import { listTransactions, addTransaction } from '../controllers/financeController.js';
import authMiddleware, { adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all finance routes
router.use(authMiddleware);
router.use(adminOnly); // Only admins can access finance

router.get('/transactions', listTransactions);
router.post('/transactions', addTransaction);

export default router;
