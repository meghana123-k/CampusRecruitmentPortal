import { Router } from 'express';
import { body } from 'express-validator';
import { applyForJob, getAllApplications } from '../controllers/applicationController';
import { validate } from '../middleware/validation';

// Validation rules
const validateApplicationData = [
  body('applicantName').notEmpty().withMessage('Name is required'),
  body('applicantEmail').isEmail().withMessage('Valid email is required'),
  body('graduationYear')
    .notEmpty()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Valid graduation year is required'),
  body('skills').notEmpty().withMessage('Skills are required'),
  body('coverLetter')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
];

// Router
const router = Router();

// Routes
router.post('/', validate(validateApplicationData), applyForJob);
router.get('/', getAllApplications);

export default router;