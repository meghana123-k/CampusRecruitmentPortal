import { Router } from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByRecruiter,
  getJobStats,
  validateJobData,
  validateJobId,
} from '../controllers/jobController';
import { authenticate, recruiterOrAdmin, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Public routes (no authentication required)
router.get('/', optionalAuth, getAllJobs);
router.get('/stats', optionalAuth, getJobStats);
router.get('/:id', optionalAuth, validate(validateJobId), getJobById);

// Protected routes
router.use(authenticate);

// Recruiter/Admin routes
router.post('/', recruiterOrAdmin, validate(validateJobData), createJob);
router.put('/:id', recruiterOrAdmin, validate([...validateJobId, ...validateJobData]), updateJob);
router.delete('/:id', recruiterOrAdmin, validate(validateJobId), deleteJob);

// Get jobs by recruiter
router.get('/recruiter/:recruiterId?', recruiterOrAdmin, getJobsByRecruiter);

export default router;
