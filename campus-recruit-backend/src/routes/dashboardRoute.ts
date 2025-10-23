import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/dashboard
router.get('/dashboard', authenticate, getDashboardData);

export default router;
