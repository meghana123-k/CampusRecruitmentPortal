import { Request, Response } from 'express';
import { body, ValidationChain, param } from 'express-validator';
import { User, UserRole } from '../models/User';
import { Op } from 'sequelize';

// Validation rules for user creation/update
export const validateUserData: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('role')
    .isIn(Object.values(UserRole))
    .withMessage('Invalid role specified'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

// Validation rules for user ID parameter
export const validateUserId: ValidationChain[] = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
];

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as UserRole;
    const search = req.query.search as string;
    
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause: any = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create new user (Admin only)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, isActive = true } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }
    
    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      isActive,
    });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update user (Admin only)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, role, isActive } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'Email already exists',
        });
        return;
      }
    }
    
    // Update user
    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    await user.update(updateData);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Prevent admin from deleting themselves
    if (req.userId && req.userId === user.id) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
      return;
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Toggle user active status (Admin only)
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    // Prevent admin from deactivating themselves
    if (req.userId && req.userId === user.id) {
      res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
      return;
    }
    
    await user.update({ isActive: !user.isActive });
    
    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: user.getPublicProfile() },
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user statistics (Admin only)
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const students = await User.count({ where: { role: UserRole.STUDENT } });
    const recruiters = await User.count({ where: { role: UserRole.RECRUITER } });
    const admins = await User.count({ where: { role: UserRole.ADMIN } });
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        students,
        recruiters,
        admins,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
