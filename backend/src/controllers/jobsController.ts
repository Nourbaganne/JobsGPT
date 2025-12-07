import { Response, NextFunction } from 'express';
import * as jobsService from '../services/jobsService.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { sendSuccess, sendNoContent } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

/**
 * Get all jobs for the authenticated user
 */
export async function getAllJobs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const jobs = await jobsService.getAllJobs(userId);
    sendSuccess(res, jobs);
  } catch (error) {
    next(error);
  }
}

/**
 * Get top N jobs for the authenticated user
 */
export async function getTopJobs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 5;
    const jobs = await jobsService.getTopJobs(userId, limit);
    sendSuccess(res, jobs);
  } catch (error) {
    next(error);
  }
}

/**
 * Get total job count for the authenticated user
 */
export async function getJobCount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const count = await jobsService.getJobCount(userId);
    sendSuccess(res, { count });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single job by ID
 */
export async function getJobById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      throw new BadRequestError('Invalid job ID');
    }

    const job = await jobsService.getJobById(jobId, userId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    sendSuccess(res, job);
  } catch (error) {
    next(error);
  }
}
