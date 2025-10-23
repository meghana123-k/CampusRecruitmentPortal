import { Router } from 'express';
import {
  applyForJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationsByJob,
  getApplicationStats,
  validateApplicationData,
  validateApplicationUpdate,
  validateApplicationId,
} from '../controllers/applicationController';
import { authenticate, recruiterOrAdmin, studentOrAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', studentOrAdmin, validate(validateApplicationData), applyForJob);

// Get applications (accessible by all authenticated users with role-based filtering)
router.get('/', getAllApplications);
router.get('/stats', getApplicationStats);
router.get('/:id', validate(validateApplicationId), getApplicationById);

// Recruiter/Admin routes
router.put('/:id/status', recruiterOrAdmin, validate([...validateApplicationId, ...validateApplicationUpdate]), updateApplicationStatus);
router.get('/job/:jobId', recruiterOrAdmin, getApplicationsByJob);

// Student/Admin routes
router.delete('/:id', studentOrAdmin, validate(validateApplicationId), deleteApplication);

export default router;
