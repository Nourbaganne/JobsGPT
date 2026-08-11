import { execute, query, queryOne } from '../config/db.js';
import type { Job, JobResponse } from '../types/index.js';

/** Transform a database row into the API response shape. */
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
 * `NULLS LAST` is load-bearing, not decoration. MySQL sorts NULLs last under
 * DESC; Postgres sorts them FIRST. Without it, every unscored job would jump
 * to the top of the dashboard and push the real matches off the page.
 */
const ORDER_BY_SCORE = 'ORDER BY score DESC NULLS LAST, created_at DESC';

/** All jobs for a user, best match first. */
export async function getAllJobs(userId: number): Promise<JobResponse[]> {
  const rows = await query<Job>(
    `SELECT * FROM jobs WHERE user_id = $1 ${ORDER_BY_SCORE}`,
    [userId]
  );
  return rows.map(transformJob);
}

/** Top N jobs for a user by score. */
export async function getTopJobs(
  userId: number,
  limit: number = 5
): Promise<JobResponse[]> {
  // Clamped and parameterised. The MySQL version interpolated the limit
  // straight into the SQL string; pg takes it as a bind parameter instead.
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit) || 5));

  const rows = await query<Job>(
    `SELECT * FROM jobs WHERE user_id = $1 ${ORDER_BY_SCORE} LIMIT $2`,
    [userId, safeLimit]
  );
  return rows.map(transformJob);
}

/** Total job count for a user. */
export async function getJobCount(userId: number): Promise<number> {
  // COUNT() is bigint, and node-postgres returns bigint as a string so large
  // values survive the trip. Returning it raw would give the client "12"
  // instead of 12.
  const row = await queryOne<{ count: string }>(
    'SELECT COUNT(*) AS count FROM jobs WHERE user_id = $1',
    [userId]
  );
  return row ? Number.parseInt(row.count, 10) : 0;
}

/** A single job, only if the user owns it. */
export async function getJobById(
  jobId: number,
  userId: number
): Promise<JobResponse | null> {
  const job = await queryOne<Job>(
    'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
    [jobId, userId]
  );
  return job ? transformJob(job) : null;
}

/**
 * Delete a job the user owns. Returns false when the row does not exist OR
 * belongs to someone else — the two are deliberately indistinguishable to the
 * caller, so this endpoint cannot be used to probe which job ids exist.
 */
export async function deleteJob(jobId: number, userId: number): Promise<boolean> {
  const affected = await execute('DELETE FROM jobs WHERE id = $1 AND user_id = $2', [
    jobId,
    userId,
  ]);
  return affected > 0;
}
