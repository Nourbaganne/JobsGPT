import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { generateTokenPair, verifyRefreshToken, generateAccessToken, parseExpiresIn } from '../utils/token.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { env } from '../config/env.js';
import type { AuthenticatedRequest, JwtPayload } from '../types/index.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters');
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const user = await authService.createUser(email, password);

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const { accessToken, refreshToken } = generateTokenPair(payload);

    // Store refresh token in database
    await authService.updateRefreshToken(user.id, refreshToken);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
      path: '/',
    });

    sendCreated(res, {
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

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
    const { accessToken, refreshToken } = generateTokenPair(payload);

    // Store refresh token in database
    await authService.updateRefreshToken(user.id, refreshToken);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
      path: '/',
    });

    sendSuccess(res, {
      accessToken,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    // Verify the refresh token
    let decoded: JwtPayload;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if refresh token exists in database
    const user = await authService.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedError('Refresh token not found');
    }

    // Generate new access token
    const payload: JwtPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);

    sendSuccess(res, { accessToken });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // Find user and clear refresh token
      const user = await authService.findUserByRefreshToken(refreshToken);
      if (user) {
        await authService.updateRefreshToken(user.id, null);
      }
    }

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const resetToken = await authService.generateResetToken(email);

    // Always return success to prevent email enumeration
    const response: { message: string; resetUrl?: string } = {
      message: 'If an account exists with this email, you will receive a password reset link.',
    };

    // In development, include the reset URL for testing
    if (env.NODE_ENV === 'development' && resetToken) {
      response.resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
      console.log('[PASSWORD_RESET] Reset URL:', response.resetUrl);
    }

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new BadRequestError('Token and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters');
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

