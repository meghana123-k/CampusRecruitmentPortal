import { Request, Response } from 'express';
import { body, ValidationChain, param } from 'express-validator';
import { Application, ApplicationStatus } from '../models/Application';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { Op } from 'sequelize';

// Validation rules for application creation
export const validateApplicationData: ValidationChain[] = [
  body('jobId')
    .isInt({ min: 1 })
    .withMessage('Job ID must be a positive integer'),
  body('coverLetter')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Cover letter must be less than 2000 characters'),
  body('resumeUrl')
    .optional()
    .isURL()
    .withMessage('Resume URL must be a valid URL'),
];

// Validation rules for application update
export const validateApplicationUpdate: ValidationChain[] = [
  body('status')
    .isIn(Object.values(ApplicationStatus))
    .withMessage('Invalid application status'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
];

// Validation rules for application ID parameter
export const validateApplicationId: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Application ID must be a positive integer'),
];

// Apply for a job (Student only)
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;
    
    // Check if job exists and is active
    const job = await Job.findByPk(jobId);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }
    
    if (!job.isOpenForApplications()) {
      res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      });
      return;
    }
    
    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      where: {
        studentId: req.userId,
        jobId: jobId,
      },
    });
    
    if (existingApplication) {
      res.status(409).json({
        success: false,
        message: 'You have already applied for this job',
      });
      return;
    }
    
    // Create new application
    const application = await Application.create({
      studentId: req.userId!,
      jobId: jobId,
      coverLetter,
      resumeUrl,
      status: ApplicationStatus.PENDING,
      appliedAt: new Date(),
    });
    
    // Fetch application with related data
    const applicationWithDetails = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'jobType'],
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application: applicationWithDetails },
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all applications
export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as ApplicationStatus;
    const jobId = req.query.jobId as string;
    const studentId = req.query.studentId as string;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (jobId) {
      whereClause.jobId = jobId;
    }
    
    if (studentId) {
      whereClause.studentId = studentId;
    }
    
    // If user is recruiter, only show applications for their jobs
    if (req.userRole === 'recruiter') {
      const recruiterJobs = await Job.findAll({
        where: { recruiterId: req.userId },
        attributes: ['id'],
      });
      const jobIds = recruiterJobs.map(job => job.id);
      whereClause.jobId = { [Op.in]: jobIds };
    }
    
    // If user is student, only show their applications
    if (req.userRole === 'student') {
      whereClause.studentId = req.userId;
    }
    
    const { count, rows: applications } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'jobType', 'recruiterId'],
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit,
      offset,
      order: [['appliedAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get application by ID
export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }
    
    // Check permissions
    const canView = req.userRole === 'admin' ||
                   application.studentId === req.userId ||
                   (req.userRole === 'recruiter' && application.job.recruiterId === req.userId);
    
    if (!canView) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this application',
      });
      return;
    }
    
    res.json({
      success: true,
      data: { application },
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update application status (Recruiter/Admin only)
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
        },
      ],
    });
    
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }
    
    // Check permissions
    const canUpdate = req.userRole === 'admin' ||
                     (req.userRole === 'recruiter' && application.job.recruiterId === req.userId);
    
    if (!canUpdate) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
      return;
    }
    
    // Update application
    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    
    await application.update(updateData);
    
    // Fetch updated application with details
    const updatedApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    
    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: { application: updatedApplication },
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete application (Student/Admin only)
export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const application = await Application.findByPk(id);
    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      });
      return;
    }
    
    // Check permissions
    const canDelete = req.userRole === 'admin' || application.studentId === req.userId;
    
    if (!canDelete) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application',
      });
      return;
    }
    
    await application.destroy();
    
    res.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get applications by job
export const getApplicationsByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Check if job exists and user has permission to view applications
    const job = await Job.findByPk(jobId);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }
    
    const canView = req.userRole === 'admin' ||
                   job.recruiterId === req.userId;
    
    if (!canView) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job',
      });
      return;
    }
    
    const { count, rows: applications } = await Application.findAndCountAll({
      where: { jobId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit,
      offset,
      order: [['appliedAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get applications by job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get application statistics
export const getApplicationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalApplications = await Application.count();
    const pendingApplications = await Application.count({ where: { status: ApplicationStatus.PENDING } });
    const reviewedApplications = await Application.count({ where: { status: ApplicationStatus.REVIEWED } });
    const shortlistedApplications = await Application.count({ where: { status: ApplicationStatus.SHORTLISTED } });
    const rejectedApplications = await Application.count({ where: { status: ApplicationStatus.REJECTED } });
    const acceptedApplications = await Application.count({ where: { status: ApplicationStatus.ACCEPTED } });
    
    res.json({
      success: true,
      data: {
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        rejectedApplications,
        acceptedApplications,
      },
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
