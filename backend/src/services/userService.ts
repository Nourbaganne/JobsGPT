import { pool } from '../config/db.js';
import { RowDataPacket } from 'mysql2';
import type { User, UserPreferences } from '../types/index.js';

export async function getUserPreferences(userId: number): Promise<UserPreferences | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT resume_text AS resumeText, keywords, refresh_hours AS refreshHours FROM users WHERE id = ?',
    [userId]
  );
  return (rows[0] as UserPreferences) || null;
}

export async function updateUserPreferences(
  userId: number, 
  keywords: string, 
  refreshHours: number
): Promise<void> {
  await pool.execute(
    'UPDATE users SET keywords = ?, refresh_hours = ? WHERE id = ?',
    [keywords, refreshHours, userId]
  );
}

export async function updateResumeText(userId: number, resumeText: string): Promise<void> {
  await pool.execute(
    'UPDATE users SET resume_text = ? WHERE id = ?',
    [resumeText, userId]
  );
}

export async function getUserById(userId: number): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  return (rows[0] as User) || null;
}

