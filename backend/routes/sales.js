// backend/routes/sales.js
// -----------------------------------------
// ✅ FIXED VERSION
// Reason: Corrected import path (case-sensitive)
// -----------------------------------------

import { Router } from 'express';
import { listSales, addSale } from '../controllers/salesController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Protect all sales routes
router.use(authMiddleware);

// Route to list all sales
router.get('/', listSales);

// Route to add a new sale
router.post('/', addSale);

export default router;
