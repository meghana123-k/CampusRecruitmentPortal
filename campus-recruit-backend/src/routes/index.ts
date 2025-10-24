import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import jobRoutes from './jobRoutes';
import applicationRoutes from './applicationRoutes';
import dashboardRoutes from './dashboardRoute';

const router = Router();

// API version prefix
const API_VERSION = '/api/v1';
// Route definitions
router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/jobs`, jobRoutes);
router.use(`${API_VERSION}/applications`, applicationRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Recruitment Management Portal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API documentation endpoint
router.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Campus Recruitment Management Portal API',
    version: '1.0.0',
    endpoints: {
      auth: `${API_VERSION}/auth`,
      users: `${API_VERSION}/users`,
      jobs: `${API_VERSION}/jobs`,
      applications: `${API_VERSION}/applications`,
    },
    documentation: {
      authentication: 'JWT-based authentication required for most endpoints',
      roles: ['admin', 'student', 'recruiter'],
      pagination: 'Use ?page=1&limit=10 for paginated results',
      filtering: 'Use query parameters for filtering results',
    },
  });
});

export default router;
