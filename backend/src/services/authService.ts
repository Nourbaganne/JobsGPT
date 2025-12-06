import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { User } from '../types/index.js';

export async function findUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return (rows[0] as User) || null;
}

export async function findUserById(id: number): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return (rows[0] as User) || null;
}

export async function findUserByResetToken(token: string): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
    [token]
  );
  return (rows[0] as User) || null;
}

export async function findUserByRefreshToken(token: string): Promise<User | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE refresh_token = ?',
    [token]
  );
  return (rows[0] as User) || null;
}

export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  );

  const user = await findUserById(result.insertId);
  if (!user) throw new Error('Failed to create user');
  
  return user;
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
  await pool.execute(
    'UPDATE users SET refresh_token = ? WHERE id = ?',
    [refreshToken, userId]
  );
}

export async function generateResetToken(email: string): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await pool.execute(
    'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
    [resetToken, resetTokenExpiry, user.id]
  );

  return resetToken;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const user = await findUserByResetToken(token);
  if (!user) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.execute(
    'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
    [hashedPassword, user.id]
  );

  return true;
}

