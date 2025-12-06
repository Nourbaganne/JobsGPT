import { pool } from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { Job, JobResponse } from '../types/index.js';

// Transform database row to API response format
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

export async function getAllJobs(userId: number): Promise<JobResponse[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM jobs WHERE user_id = ? ORDER BY score DESC',
    [userId]
  );
  return (rows as Job[]).map(transformJob);
}

export async function getTopJobs(userId: number, limit: number = 5): Promise<JobResponse[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM jobs WHERE user_id = ? ORDER BY score DESC LIMIT ?',
    [userId, limit]
  );
  return (rows as Job[]).map(transformJob);
}

export async function getJobCount(userId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM jobs WHERE user_id = ?',
    [userId]
  );
  return rows[0]?.count || 0;
}

export async function getJobById(jobId: number, userId: number): Promise<JobResponse | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM jobs WHERE id = ? AND user_id = ?',
    [jobId, userId]
  );
  const job = rows[0] as Job | undefined;
  return job ? transformJob(job) : null;
}

export async function deleteJob(jobId: number, userId: number): Promise<boolean> {
  // Verify ownership first
  const job = await getJobById(jobId, userId);
  if (!job) return false;

  await pool.execute(
    'DELETE FROM jobs WHERE id = ?',
    [jobId]
  );
  return true;
}

export async function clearAllJobs(userId: number): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM jobs WHERE user_id = ?',
    [userId]
  );
  return result.affectedRows;
}

export async function createJob(
  userId: number,
  data: {
    title: string;
    company: string;
    location?: string;
    url?: string;
    source?: string;
    description?: string;
    score?: number;
  }
): Promise<JobResponse> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO jobs (user_id, title, company, location, url, source, description, score) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.title,
      data.company,
      data.location || null,
      data.url || null,
      data.source || null,
      data.description || null,
      data.score || null,
    ]
  );

  const job = await getJobById(result.insertId, userId);
  if (!job) throw new Error('Failed to create job');
  
  return job;
}

