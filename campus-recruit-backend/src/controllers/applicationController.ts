import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Application, ApplicationStatus } from '../models/Application';

// Validation middleware
export const validateApplicationData = [
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

// Controller to handle job application
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { applicantName, applicantEmail, graduationYear, skills, coverLetter } = req.body;

    // Create new application
    const application = await Application.create({
      applicantName,
      applicantEmail,
      graduationYear: Number(graduationYear),
      skills,
      coverLetter,
      status: ApplicationStatus.PENDING,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error in applyForJob:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller to get all applications
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.findAll();
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};