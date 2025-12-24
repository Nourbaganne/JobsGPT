'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Job } from '@/types';

interface UserState {
  jobs: Job[];
  topJobs: Job[];
  jobCount: number;
  isLoading: boolean;
  error: string | null;

  fetchJobs: () => Promise<void>;
  fetchTopJobs: (limit?: number) => Promise<void>;
  fetchJobCount: () => Promise<void>;
}

export const useUser = create<UserState>((set) => ({
  jobs: [],
  topJobs: [],
  jobCount: 0,
  isLoading: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    
    const response = await api.getJobs();
    
    if (response.success && response.data) {
      set({
        jobs: response.data,
        isLoading: false,
      });
    } else {
      set({
        isLoading: false,
        error: response.error || 'Failed to fetch jobs',
      });
    }
  },

  fetchTopJobs: async (limit = 5) => {
    set({ isLoading: true, error: null });
    
    const response = await api.getTopJobs(limit);
    
    if (response.success && response.data) {
      set({
        topJobs: response.data,
        isLoading: false,
      });
    } else {
      set({
        isLoading: false,
        error: response.error || 'Failed to fetch top jobs',
      });
    }
  },

  fetchJobCount: async () => {
    const response = await api.getJobCount();
    
    if (response.success && response.data) {
      set({ jobCount: response.data.count });
    }
  },
}));
