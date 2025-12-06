import { Request } from 'express';

// Database Models
export interface User {
  id: number;
  email: string;
  password: string;
  resume_text: string | null;
  keywords: string | null;
  refresh_hours: number;
  next_run: Date | null;
  reset_token: string | null;
  reset_token_expiry: Date | null;
  refresh_token: string | null;
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

// API Response Types
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

export interface UserPreferences {
  resumeText: string | null;
  keywords: string | null;
  refreshHours: number;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  email: string;
}

// Extended Request with user
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Auth Types
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
  };
}

