import { Router } from 'express';
import { listEmployees, addEmployee } from '../controllers/employeeController.js';
import authMiddleware, { adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all employee routes
router.use(authMiddleware);

router.get('/', listEmployees);
router.post('/', adminOnly, addEmployee); // Only admins can add

export default router;
