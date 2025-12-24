import type { ApiResponse, RefreshResponse, User, Job } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// In-memory token storage
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Custom fetch wrapper with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth header if we have a token
  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for refresh token
    });

    // If unauthorized, try to refresh the token
    if (response.status === 401 && accessToken) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request with new token
        (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
      }
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Refresh the access token
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      setAccessToken(null);
      return false;
    }

    const data = await response.json() as ApiResponse<RefreshResponse>;
    if (data.success && data.data?.accessToken) {
      setAccessToken(data.data.accessToken);
      return true;
    }

    return false;
  } catch {
    setAccessToken(null);
    return false;
  }
}

// API methods
export const api = {
  // Auth
  async login(email: string, password: string) {
    const response = await fetchWithAuth<{ accessToken: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    
    if (response.success && response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    
    return response;
  },

  async register(email: string, password: string) {
    const response = await fetchWithAuth<{ accessToken: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    
    if (response.success && response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    
    return response;
  },

  async logout() {
    const response = await fetchWithAuth<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
    setAccessToken(null);
    return response;
  },

  async refresh() {
    return refreshAccessToken();
  },

  async forgotPassword(email: string) {
    return fetchWithAuth<{ message: string; resetUrl?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string) {
    return fetchWithAuth<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  async getMe() {
    return fetchWithAuth<User>('/auth/me');
  },

  // User - matches backend GET /user/profile
  async getProfile() {
    return fetchWithAuth<User>('/user/profile');
  },

  // Jobs
  async getJobs() {
    return fetchWithAuth<Job[]>('/jobs');
  },

  async getTopJobs(limit = 5) {
    return fetchWithAuth<Job[]>(`/jobs/top?limit=${limit}`);
  },

  async getJobCount() {
    return fetchWithAuth<{ count: number }>('/jobs/count');
  },
};
