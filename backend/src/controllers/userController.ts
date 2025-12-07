import { Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';
import { NotFoundError } from '../utils/errors.js';
import { sendSuccess } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

/**
 * Get the current user's profile
 */
export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, {
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}
