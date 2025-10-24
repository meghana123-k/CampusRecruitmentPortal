import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import jobRoutes from './jobRoutes';
import applicationRoutes from './applicationRoutes';
import dashboardRoutes from './dashboardRoute';
import express from 'express';
import path from 'path';

const router = Router();
const API_VERSION = '/api/v1';

router.use(`${API_VERSION}/auth`, authRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/jobs`, jobRoutes);
router.use(`${API_VERSION}/applications`, applicationRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardRoutes);

// Serve resumes
router.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// API doc
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
      dashboard: `${API_VERSION}/dashboard`,
    },
  });
});

export default router;
