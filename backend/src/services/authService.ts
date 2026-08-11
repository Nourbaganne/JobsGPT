import bcrypt from 'bcryptjs';
import { execute, queryOne } from '../config/db.js';
import {
  hashToken,
  generateSecureToken,
  getRefreshTokenExpiry,
  getResetTokenExpiry,
} from '../utils/token.js';
import type { User, RefreshToken, DeviceInfo } from '../types/index.js';

// ============ USER OPERATIONS ============

export async function findUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE email = $1', [email]);
}

export async function findUserById(id: number): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
}

export async function createUser(email: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 12);

  // RETURNING replaces MySQL's insertId round-trip: one statement, and the row
  // comes back already committed.
  const user = await queryOne<User>(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );

  if (!user) throw new Error('Failed to create user');
  return user;
}

export async function validatePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============ REFRESH TOKEN OPERATIONS ============

export async function createRefreshToken(
  userId: number,
  deviceInfo: DeviceInfo
): Promise<string> {
  // The raw token goes to the client; only its hash is stored, so a database
  // leak does not hand out live sessions.
  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = getRefreshTokenExpiry();

  await execute(
    `INSERT INTO refresh_tokens
       (user_id, token_hash, device_name, user_agent, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      userId,
      tokenHash,
      deviceInfo.deviceName ?? null,
      deviceInfo.userAgent ?? null,
      deviceInfo.ipAddress ?? null,
      expiresAt,
    ]
  );

  return rawToken;
}

export async function findRefreshToken(
  rawToken: string
): Promise<(RefreshToken & { user_email: string }) | null> {
  const tokenHash = hashToken(rawToken);

  return queryOne<RefreshToken & { user_email: string }>(
    `SELECT rt.*, u.email AS user_email
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
      WHERE rt.token_hash = $1 AND rt.expires_at > now()`,
    [tokenHash]
  );
}

export async function deleteRefreshToken(rawToken: string): Promise<boolean> {
  const tokenHash = hashToken(rawToken);
  const affected = await execute('DELETE FROM refresh_tokens WHERE token_hash = $1', [
    tokenHash,
  ]);
  return affected > 0;
}

export async function deleteAllUserRefreshTokens(userId: number): Promise<void> {
  await execute('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
}

export async function rotateRefreshToken(
  oldRawToken: string,
  userId: number,
  deviceInfo: DeviceInfo
): Promise<string> {
  await deleteRefreshToken(oldRawToken);
  return createRefreshToken(userId, deviceInfo);
}

export async function cleanupExpiredTokens(): Promise<void> {
  await execute('DELETE FROM refresh_tokens WHERE expires_at < now()');
}

// ============ PASSWORD RESET OPERATIONS ============

export async function createResetToken(email: string): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiry = getResetTokenExpiry();

  await execute(
    'UPDATE users SET reset_token_hash = $1, reset_token_expiry = $2 WHERE id = $3',
    [tokenHash, expiry, user.id]
  );

  return rawToken;
}

export async function findUserByResetToken(rawToken: string): Promise<User | null> {
  const tokenHash = hashToken(rawToken);

  return queryOne<User>(
    `SELECT * FROM users
      WHERE reset_token_hash = $1 AND reset_token_expiry > now()`,
    [tokenHash]
  );
}

export async function resetPassword(
  rawToken: string,
  newPassword: string
): Promise<boolean> {
  const user = await findUserByResetToken(rawToken);
  if (!user) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await execute(
    `UPDATE users
        SET password = $1, reset_token_hash = NULL, reset_token_expiry = NULL
      WHERE id = $2`,
    [hashedPassword, user.id]
  );

  // Force re-login everywhere: a password reset should end existing sessions.
  await deleteAllUserRefreshTokens(user.id);

  return true;
}
