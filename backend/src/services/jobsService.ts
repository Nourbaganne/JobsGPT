import { pool } from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { Job, JobResponse } from '../types/index.js';

/**
 * Transform database row to API response format
 */
function transformJob(job: Job): JobResponse {
  return {
    id: job.id,
    userId: job.user_id,
    title: job.title,
    company: job.company,
    location: job.location,
    url: job.url,
    source: job.source,
    description: job.description,
    score: job.score,
    createdAt: job.created_at,
  };
}

/**
 * Get all jobs for a user, ordered by score descending
 */
export async function getAllJobs(userId: number): Promise<JobResponse[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM jobs WHERE user_id = ? ORDER BY score DESC',
    [userId]
  );
  return (rows as Job[]).map(transformJob);
}

/**
 * Get top N jobs for a user by score
 */
export async function getTopJobs(userId: number, limit: number = 5): Promise<JobResponse[]> {
  const safeLimit = Math.max(1, Math.floor(limit));
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM jobs WHERE user_id = ? ORDER BY score DESC LIMIT ${safeLimit}`,
    [userId]
  );
  return (rows as Job[]).map(transformJob);
}

/**
 * Get total job count for a user
 */
export async function getJobCount(userId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM jobs WHERE user_id = ?',
    [userId]
  );
  return rows[0]?.count || 0;
}

/**
 * Get a single job by ID (only if owned by user)
 */
export async function getJobById(jobId: number, userId: number): Promise<JobResponse | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM jobs WHERE id = ? AND user_id = ?',
    [jobId, userId]
  );
  const job = rows[0] as Job | undefined;
  return job ? transformJob(job) : null;
}