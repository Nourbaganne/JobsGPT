import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { hashToken, generateSecureToken, getRefreshTokenExpiry, getResetTokenExpiry } from '../utils/token.js';
import type { User, RefreshToken, DeviceInfo } from '../types/index.js';

// ============ USER OPERATIONS ============

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

export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 12);
  
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

// ============ REFRESH TOKEN OPERATIONS ============

export async function createRefreshToken(
  userId: number, 
  deviceInfo: DeviceInfo
): Promise<string> {
  // Generate raw token (this will be sent to client)
  const rawToken = generateSecureToken();
  
  // Hash the token before storing
  const tokenHash = hashToken(rawToken);
  const expiresAt = getRefreshTokenExpiry();

  await pool.execute(
    `INSERT INTO refresh_tokens (user_id, token_hash, device_name, user_agent, ip_address, expires_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, tokenHash, deviceInfo.deviceName || null, deviceInfo.userAgent || null, deviceInfo.ipAddress || null, expiresAt]
  );

  return rawToken;
}

export async function findRefreshToken(rawToken: string): Promise<(RefreshToken & { user_email: string }) | null> {
  const tokenHash = hashToken(rawToken);
  
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT rt.*, u.email as user_email 
     FROM refresh_tokens rt 
     JOIN users u ON rt.user_id = u.id 
     WHERE rt.token_hash = ? AND rt.expires_at > NOW()`,
    [tokenHash]
  );
  
  return (rows[0] as (RefreshToken & { user_email: string })) || null;
}

export async function deleteRefreshToken(rawToken: string): Promise<boolean> {
  const tokenHash = hashToken(rawToken);
  
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM refresh_tokens WHERE token_hash = ?',
    [tokenHash]
  );
  
  return result.affectedRows > 0;
}

export async function deleteAllUserRefreshTokens(userId: number): Promise<void> {
  await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
}

export async function rotateRefreshToken(
  oldRawToken: string, 
  userId: number, 
  deviceInfo: DeviceInfo
): Promise<string> {
  // Delete old token
  await deleteRefreshToken(oldRawToken);
  
  // Create new token
  return createRefreshToken(userId, deviceInfo);
}

export async function cleanupExpiredTokens(): Promise<void> {
  await pool.execute('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
}

// ============ PASSWORD RESET OPERATIONS ============

export async function createResetToken(email: string): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  // Generate raw token
  const rawToken = generateSecureToken();
  
  // Hash before storing
  const tokenHash = hashToken(rawToken);
  const expiry = getResetTokenExpiry();

  await pool.execute(
    'UPDATE users SET reset_token_hash = ?, reset_token_expiry = ? WHERE id = ?',
    [tokenHash, expiry, user.id]
  );

  return rawToken;
}

export async function findUserByResetToken(rawToken: string): Promise<User | null> {
  const tokenHash = hashToken(rawToken);
  
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM users WHERE reset_token_hash = ? AND reset_token_expiry > NOW()',
    [tokenHash]
  );
  
  return (rows[0] as User) || null;
}

export async function resetPassword(rawToken: string, newPassword: string): Promise<boolean> {
  const user = await findUserByResetToken(rawToken);
  if (!user) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await pool.execute(
    'UPDATE users SET password = ?, reset_token_hash = NULL, reset_token_expiry = NULL WHERE id = ?',
    [hashedPassword, user.id]
  );

  // Invalidate all refresh tokens (force re-login on all devices)
  await deleteAllUserRefreshTokens(user.id);

  return true;
}
