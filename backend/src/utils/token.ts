import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { JwtPayload } from '../types/index.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

/**
 * Parse a duration string (e.g., "1d", "12h", "30m") to days
 */
function parseDays(value?: string): number | undefined {
  if (!value) return undefined;

  // Check if it's already a number (days)
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }

  // Parse duration format (e.g., "7d", "12h", "30m", "45s")
  const match = /^(\d+(?:\.\d+)?)([dhms])$/i.exec(value.trim());
  if (!match) return undefined;

  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;

  const unit = match[2].toLowerCase();
  const daysPerUnit: Record<string, number> = {
    d: 1,
    h: 1 / 24,
    m: 1 / (24 * 60),
    s: 1 / (24 * 60 * 60),
  };

  return amount * daysPerUnit[unit];
}

// Parse refresh token expiry with fallback to 7 days
const REFRESH_EXPIRES_DAYS = parseDays(process.env.JWT_REFRESH_EXPIRES_IN) || 1;

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token using SHA-256 for secure storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a short-lived JWT access token
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT access token
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

/**
 * Calculate refresh token expiry date
 */
export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_EXPIRES_DAYS);
  return expiry;
}

/**
 * Calculate reset token expiry (30 minutes from now)
 */
export function getResetTokenExpiry(): Date {
  return new Date(Date.now() + 30 * 60 * 1000);
}

/**
 * Get refresh token max age in milliseconds (for cookie)
 */
export function getRefreshTokenMaxAge(): number {
  return REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
}
