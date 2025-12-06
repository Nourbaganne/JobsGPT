import { Response, NextFunction } from 'express';
import * as jobsService from '../services/jobsService.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { sendSuccess, sendNoContent } from '../utils/response.js';
import type { AuthenticatedRequest } from '../types/index.js';

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

export async function deleteJob(
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

    const deleted = await jobsService.deleteJob(jobId, userId);
    if (!deleted) {
      throw new NotFoundError('Job not found or unauthorized');
    }

    sendNoContent(res);
  } catch (error) {
    next(error);
  }
}

export async function clearAllJobs(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const deletedCount = await jobsService.clearAllJobs(userId);
    sendSuccess(res, { deletedCount });
  } catch (error) {
    next(error);
  }
}

export async function createJob(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { title, company, location, url, source, description, score } = req.body;

    if (!title || !company) {
      throw new BadRequestError('Title and company are required');
    }

    const job = await jobsService.createJob(userId, {
      title,
      company,
      location,
      url,
      source,
      description,
      score,
    });

    sendSuccess(res, job, 201);
  } catch (error) {
    next(error);
  }
}

