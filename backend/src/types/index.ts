import { Request } from 'express';

// ============ DATABASE MODELS ============

export interface User {
  id: number;
  email: string;
  password: string;
  reset_token_hash: string | null;
  reset_token_expiry: Date | null;
  created_at: Date;
}

export interface RefreshToken {
  id: number;
  user_id: number;
  token_hash: string;
  device_name: string | null;
  user_agent: string | null;
  ip_address: string | null;
  expires_at: Date;
  created_at: Date;
}

export interface Job {
  id: number;
  user_id: number;
  title: string;
  company: string;
  location: string | null;
  url: string | null;
  source: string | null;
  description: string | null;
  score: number | null;
  created_at: Date;
}

// ============ API RESPONSE TYPES ============

export interface JobResponse {
  id: number;
  userId: number;
  title: string;
  company: string;
  location: string | null;
  url: string | null;
  source: string | null;
  description: string | null;
  score: number | null;
  createdAt: Date;
}

// ============ AUTH TYPES ============

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface DeviceInfo {
  deviceName?: string;
  userAgent?: string;
  ipAddress?: string;
}
