'use client';

import { create } from 'zustand';
import { api, setAccessToken, getAccessToken } from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    const response = await api.login(email, password);
    
    if (response.success && response.data) {
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    }
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: response.error || 'Login failed',
    });
    return false;
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    const response = await api.register(email, password);
    
    if (response.success && response.data) {
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    }
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: response.error || 'Registration failed',
    });
    return false;
  },

  logout: async () => {
    set({ isLoading: true });
    
    await api.logout();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    
    // Try to refresh the token first
    const refreshed = await api.refresh();
    
    if (refreshed) {
      // Get user info
      const response = await api.getMe();
      
      if (response.success && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    }
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Hook to initialize auth state
export function useAuthInit() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const isLoading = useAuth((state) => state.isLoading);
  
  return { checkAuth, isLoading };
}

