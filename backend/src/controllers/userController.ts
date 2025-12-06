import { Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { sendSuccess } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

// Using dynamic import for pdf-parse to handle CommonJS module
async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default;
  const data = await pdfParse(buffer);
  return data.text;
}

export async function getPreferences(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const preferences = await userService.getUserPreferences(userId);

    if (!preferences) {
      throw new NotFoundError('User not found');
    }

    sendSuccess(res, preferences);
  } catch (error) {
    next(error);
  }
}

export async function updatePreferences(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { keywords, refreshHours } = req.body;

    if (keywords === undefined || refreshHours === undefined) {
      throw new BadRequestError('Keywords and refreshHours are required');
    }

    const parsedRefreshHours = parseInt(refreshHours);
    if (isNaN(parsedRefreshHours) || parsedRefreshHours < 1) {
      throw new BadRequestError('refreshHours must be a positive number');
    }

    await userService.updateUserPreferences(userId, keywords, parsedRefreshHours);

    sendSuccess(res, { message: 'Preferences updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function uploadResume(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const file = req.file;

    if (!file) {
      throw new BadRequestError('No file uploaded');
    }

    // Parse PDF and extract text
    const resumeText = await parsePdf(file.buffer);

    await userService.updateResumeText(userId, resumeText);

    sendSuccess(res, { 
      message: 'Resume uploaded successfully',
      textLength: resumeText.length 
    });
  } catch (error) {
    next(error);
  }
}

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
      hasResume: !!user.resume_text,
      keywords: user.keywords,
      refreshHours: user.refresh_hours,
    });
  } catch (error) {
    next(error);
  }
}

