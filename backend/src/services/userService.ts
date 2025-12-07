import { pool } from '../config/db.js';
import { RowDataPacket } from 'mysql2';
import type { User } from '../types/index.js';

/**
 * Get a user by their ID
 */
export async function getUserById(userId: number): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, email, created_at FROM users WHERE id = ?',
    [userId]
  );
  return (rows[0] as User) || null;
}
