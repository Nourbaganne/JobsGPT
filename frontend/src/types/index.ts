// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User types
export interface User {
  id: number;
  email: string;
}

export interface UserPreferences {
  resumeText: string | null;
  keywords: string | null;
  refreshHours: number;
}

export interface UserProfile {
  id: number;
  email: string;
  hasResume: boolean;
  keywords: string | null;
  refreshHours: number;
}

// Job types
export interface Job {
  id: number;
  userId: number;
  title: string;
  company: string;
  location: string | null;
  url: string | null;
  source: string | null;
  description: string | null;
  score: number | null;
  createdAt: Date | string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

