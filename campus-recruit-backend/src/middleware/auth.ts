import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';

// Extend Request interface to include authenticated user info
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: number;
      userRole?: UserRole;
    }
  }
}

/**
 * Authenticate the user using JWT
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ success: false, message: 'No authorization header provided' });
      return;
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const payload: JWTPayload = verifyToken(token);
    const user = await User.findByPk(payload.userId);

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'User account is deactivated' });
      return;
    }

    // Attach user info to request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Authentication failed' 
    });
  }
};

/**
 * Authorization middleware factory
 * @param roles Allowed roles for the route
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

/** Predefined role-based middlewares */
export const adminOnly = authorize(UserRole.ADMIN);
export const recruiterOrAdmin = authorize(UserRole.RECRUITER, UserRole.ADMIN);
export const studentOrAdmin = authorize(UserRole.STUDENT, UserRole.ADMIN);

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
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
  } catch {
    // Continue without authentication
    next();
  }
};
