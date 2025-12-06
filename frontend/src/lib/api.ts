import type { ApiResponse, RefreshResponse } from '@/types';

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
    const response = await fetchWithAuth<{ accessToken: string; user: { id: number; email: string } }>(
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
    const response = await fetchWithAuth<{ accessToken: string; user: { id: number; email: string } }>(
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
    return fetchWithAuth<{ id: number; email: string }>('/auth/me');
  },

  // User
  async getPreferences() {
    return fetchWithAuth<{ resumeText: string | null; keywords: string | null; refreshHours: number }>(
      '/user/preferences'
    );
  },

  async updatePreferences(keywords: string, refreshHours: number) {
    return fetchWithAuth<{ message: string }>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify({ keywords, refreshHours }),
    });
  },

  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);

    const url = `${API_BASE_URL}/user/resume`;
    const headers: HeadersInit = {};
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      return await response.json() as ApiResponse<{ message: string; textLength: number }>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  async getProfile() {
    return fetchWithAuth<{
      id: number;
      email: string;
      hasResume: boolean;
      keywords: string | null;
      refreshHours: number;
    }>('/user/profile');
  },

  // Jobs
  async getJobs() {
    return fetchWithAuth<Array<{
      id: number;
      userId: number;
      title: string;
      company: string;
      location: string | null;
      url: string | null;
      source: string | null;
      description: string | null;
      score: number | null;
      createdAt: string;
    }>>('/jobs');
  },

  async getTopJobs(limit = 5) {
    return fetchWithAuth<Array<{
      id: number;
      userId: number;
      title: string;
      company: string;
      location: string | null;
      url: string | null;
      source: string | null;
      description: string | null;
      score: number | null;
      createdAt: string;
    }>>(`/jobs/top?limit=${limit}`);
  },

  async getJobCount() {
    return fetchWithAuth<{ count: number }>('/jobs/count');
  },

  async deleteJob(id: number) {
    return fetchWithAuth<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  async clearAllJobs() {
    return fetchWithAuth<{ deletedCount: number }>('/jobs', {
      method: 'DELETE',
    });
  },
};

