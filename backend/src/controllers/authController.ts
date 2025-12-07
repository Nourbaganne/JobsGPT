import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { generateAccessToken, getRefreshTokenMaxAge } from '../utils/token.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import type { AuthenticatedRequest, JwtPayload, DeviceInfo } from '../types/index.js';

/**
 * Extract device info from request headers
 */
function getDeviceInfo(req: Request): DeviceInfo {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip || req.socket.remoteAddress,
    deviceName: req.headers['x-device-name'] as string | undefined,
  };
}

/**
 * Get cookie options for refresh token
 */
function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: getRefreshTokenMaxAge(),
    path: '/',
  };
}

/**
 * Register a new user
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    if (password.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters');
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const user = await authService.createUser(email, password);

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await authService.createRefreshToken(user.id, getDeviceInfo(req));

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    sendCreated(res, {
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login an existing user
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const user = await authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await authService.validatePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = await authService.createRefreshToken(user.id, getDeviceInfo(req));

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    sendSuccess(res, {
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh the access token using a valid refresh token
 */
export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    const tokenData = await authService.findRefreshToken(oldRefreshToken);
    if (!tokenData) {
      res.clearCookie('refreshToken', { path: '/' });
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Rotate refresh token
    const newRefreshToken = await authService.rotateRefreshToken(
      oldRefreshToken,
      tokenData.user_id,
      getDeviceInfo(req)
    );

    const payload: JwtPayload = { userId: tokenData.user_id, email: tokenData.user_email };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

    sendSuccess(res, { accessToken });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout the current session
 */
export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.deleteRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout from all devices
 */
export async function logoutAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    await authService.deleteAllUserRefreshTokens(req.user.userId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    sendSuccess(res, { message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
}

/**
 * Request a password reset email
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const resetToken = await authService.createResetToken(email);

    // Always return success to prevent email enumeration
    const response: { message: string; resetUrl?: string } = {
      message: 'If an account exists with this email, you will receive a password reset link.',
    };

    // Include reset URL in development for testing
    if (process.env.NODE_ENV === 'development' && resetToken) {
      response.resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    }

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
}

/**
 * Reset password using a valid reset token
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new BadRequestError('Token and password are required');
    }

    if (password.length < 8) {
      throw new BadRequestError('Password must be at least 8 characters');
    }

    const success = await authService.resetPassword(token, password);
    if (!success) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    sendSuccess(res, { message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current authenticated user info
 */
export async function me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await authService.findUserById(req.user.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    sendSuccess(res, {
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}
