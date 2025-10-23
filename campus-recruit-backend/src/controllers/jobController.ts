import { Request, Response } from 'express';
import { body, ValidationChain, param } from 'express-validator';
import { Job, JobStatus, JobType } from '../models/Job';
import { Application } from '../models/Application';
import { Op } from 'sequelize';

// Validation rules for job creation/update
export const validateJobData: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('requirements')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Requirements must be between 10 and 2000 characters'),
  body('location')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Location is required and must be less than 255 characters'),
  body('salaryMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  body('salaryMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  body('jobType')
    .isIn(Object.values(JobType))
    .withMessage('Invalid job type'),
  body('status')
    .optional()
    .isIn(Object.values(JobStatus))
    .withMessage('Invalid job status'),
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Application deadline must be a valid date'),
];

// Validation rules for job ID parameter
export const validateJobId: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Job ID must be a positive integer'),
];

// Get all jobs
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as JobStatus;
    const jobType = req.query.jobType as JobType;
    const location = req.query.location as string;
    const search = req.query.search as string;
    const recruiterId = req.query.recruiterId as string;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (jobType) {
      whereClause.jobType = jobType;
    }
    
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }
    
    if (recruiterId) {
      whereClause.recruiterId = recruiterId;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { requirements: { [Op.like]: `%${search}%` } },
      ];
    }
    
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: require('../models/User').User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [
        {
          model: require('../models/User').User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: require('../models/User').User,
              as: 'student',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
      ],
    });
    
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: { job },
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create new job (Recruiter/Admin only)
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salaryMin,
      salaryMax,
      jobType,
      applicationDeadline,
    } = req.body;
    
    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      salaryMin,
      salaryMax,
      jobType,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      recruiterId: req.userId!,
      status: JobStatus.ACTIVE,
    });
    
    // Fetch job with recruiter info
    const jobWithRecruiter = await Job.findByPk(job.id, {
      include: [
        {
          model: require('../models/User').User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job: jobWithRecruiter },
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update job (Recruiter/Admin only)
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const job = await Job.findByPk(id);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }
    
    // Check if user owns the job or is admin
    if (job.recruiterId !== req.userId && req.userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
      return;
    }
    
    // Convert applicationDeadline to Date if provided
    if (updateData.applicationDeadline) {
      updateData.applicationDeadline = new Date(updateData.applicationDeadline);
    }
    
    await job.update(updateData);
    
    // Fetch updated job with recruiter info
    const updatedJob = await Job.findByPk(job.id, {
      include: [
        {
          model: require('../models/User').User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
    
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob },
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete job (Recruiter/Admin only)
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id);
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }
    
    // Check if user owns the job or is admin
    if (job.recruiterId !== req.userId && req.userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
      return;
    }
    
    await job.destroy();
    
    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get jobs by recruiter
export const getJobsByRecruiter = async (req: Request, res: Response): Promise<void> => {
  try {
    const recruiterId = req.params.recruiterId || req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: { recruiterId },
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status', 'appliedAt'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get jobs by recruiter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recruiter jobs',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get job statistics
export const getJobStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: JobStatus.ACTIVE } });
    const inactiveJobs = await Job.count({ where: { status: JobStatus.INACTIVE } });
    const closedJobs = await Job.count({ where: { status: JobStatus.CLOSED } });
    
    const jobTypeStats = await Job.findAll({
      attributes: [
        'jobType',
        [require('sequelize').fn('COUNT', '*'), 'count'],
      ],
      group: ['jobType'],
    });
    
    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        inactiveJobs,
        closedJobs,
        jobTypeStats,
      },
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
