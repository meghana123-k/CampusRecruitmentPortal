import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
  validateUserData,
  validateUserId,
} from '../controllers/userController';
import { authenticate, adminOnly } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', adminOnly, getAllUsers);
router.get('/stats', adminOnly, getUserStats);
router.post('/', adminOnly, validate(validateUserData), createUser);
router.put('/:id', adminOnly, validate([...validateUserId, ...validateUserData]), updateUser);
router.delete('/:id', adminOnly, validate(validateUserId), deleteUser);
router.patch('/:id/toggle-status', adminOnly, validate(validateUserId), toggleUserStatus);

// Get user by ID (accessible by admin or the user themselves)
router.get('/:id', validate(validateUserId), getUserById);

export default router;
