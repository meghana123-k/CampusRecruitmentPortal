import jwt, { SignOptions, Secret } from 'jsonwebtoken';
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

// Secrets and expirations
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as unknown as string; // cast for TypeScript
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'super-refresh-key';
const JWT_REFRESH_EXPIRES_IN = '7d' as unknown as string; // cast

// Generate JWT token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenResponse => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as unknown as any };
  const token = jwt.sign(payload, JWT_SECRET, options);

  return { token, expiresIn: JWT_EXPIRES_IN };
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }
};
export const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader) throw new Error('Authorization header is missing');

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Invalid authorization header format');
  }

  return parts[1];
};
// Generate refresh token
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as unknown as any };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
};
