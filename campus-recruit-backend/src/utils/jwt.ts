import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

// JWT payload interface
export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// JWT token response interface
export interface TokenResponse {
  token: string;
  expiresIn: string;
}

// Generate JWT token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenResponse => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  const token = jwt.sign(payload, secret, { expiresIn });
  
  return {
    token,
    expiresIn,
  };
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string => {
  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid authorization header format');
  }
  
  return parts[1];
};

// Generate refresh token (optional - for future implementation)
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production';
  const expiresIn = '7d'; // Refresh tokens last longer
  
  return jwt.sign(payload, secret, { expiresIn });
};

// Verify refresh token (optional - for future implementation)
export const verifyRefreshToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production';
  
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
