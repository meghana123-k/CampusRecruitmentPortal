import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: number;
      userRole?: UserRole;
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    // Verify token
    const payload: JWTPayload = verifyToken(token);
    
    // Find user in database
    const user = await User.findByPk(payload.userId);
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
      return;
    }
    
    // Add user info to request object
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
};

// Authorization middleware factory
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }
    
    if (!roles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }
    
    next();
  };
};

// Admin only middleware
export const adminOnly = authorize(UserRole.ADMIN);

// Recruiter or Admin middleware
export const recruiterOrAdmin = authorize(UserRole.RECRUITER, UserRole.ADMIN);

// Student or Admin middleware
export const studentOrAdmin = authorize(UserRole.STUDENT, UserRole.ADMIN);

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      const payload: JWTPayload = verifyToken(token);
      
      const user = await User.findByPk(payload.userId);
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user.id;
        req.userRole = user.role;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
