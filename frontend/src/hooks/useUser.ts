'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { UserPreferences, Job } from '@/types';

interface UserState {
  preferences: UserPreferences | null;
  jobs: Job[];
  topJobs: Job[];
  jobCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPreferences: () => Promise<void>;
  updatePreferences: (keywords: string, refreshHours: number) => Promise<boolean>;
  uploadResume: (file: File) => Promise<boolean>;
  fetchJobs: () => Promise<void>;
  fetchTopJobs: (limit?: number) => Promise<void>;
  fetchJobCount: () => Promise<void>;
  deleteJob: (id: number) => Promise<boolean>;
  clearAllJobs: () => Promise<boolean>;
  clearError: () => void;
}

export const useUser = create<UserState>((set, get) => ({
  preferences: null,
  jobs: [],
  topJobs: [],
  jobCount: 0,
  isLoading: false,
  error: null,

  fetchPreferences: async () => {
    set({ isLoading: true, error: null });
    
    const response = await api.getPreferences();
    
    if (response.success && response.data) {
      set({
        preferences: response.data,
        isLoading: false,
      });
    } else {
      set({
        isLoading: false,
        error: response.error || 'Failed to fetch preferences',
      });
    }
  },

  updatePreferences: async (keywords: string, refreshHours: number) => {
    set({ isLoading: true, error: null });
    
    const response = await api.updatePreferences(keywords, refreshHours);
    
    if (response.success) {
      // Refresh preferences
      await get().fetchPreferences();
      return true;
    }
    
    set({
      isLoading: false,
      error: response.error || 'Failed to update preferences',
    });
    return false;
  },

  uploadResume: async (file: File) => {
    set({ isLoading: true, error: null });
    
    const response = await api.uploadResume(file);
    
    if (response.success) {
      // Refresh preferences to get new resume status
      await get().fetchPreferences();
      set({ isLoading: false });
      return true;
    }
    
    set({
      isLoading: false,
      error: response.error || 'Failed to upload resume',
    });
    return false;
  },

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

  deleteJob: async (id: number) => {
    const response = await api.deleteJob(id);
    
    if (response.success) {
      // Remove from local state
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
        topJobs: state.topJobs.filter((job) => job.id !== id),
        jobCount: state.jobCount - 1,
      }));
      return true;
    }
    
    set({ error: response.error || 'Failed to delete job' });
    return false;
  },

  clearAllJobs: async () => {
    set({ isLoading: true, error: null });
    
    const response = await api.clearAllJobs();
    
    if (response.success) {
      set({
        jobs: [],
        topJobs: [],
        jobCount: 0,
        isLoading: false,
      });
      return true;
    }
    
    set({
      isLoading: false,
      error: response.error || 'Failed to clear jobs',
    });
    return false;
  },

  clearError: () => {
    set({ error: null });
  },
}));

