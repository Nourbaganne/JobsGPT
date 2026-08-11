import { queryOne } from '../config/db.js';
import type { User } from '../types/index.js';

/**
 * Get a user by their ID.
 *
 * Deliberately does not `SELECT *`: this feeds the profile endpoint, and the
 * row carries the password hash and live reset token.
 */
export async function getUserById(userId: number): Promise<User | null> {
  return queryOne<User>(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [userId]
  );
}
