import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { type UserPreferences, type InsertUserPreferences } from '@shared/schema';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreferencesResponse {
  preferences: UserPreferences | null;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  filters: any;
  resultsCount: number;
  createdAt: string;
}

interface SearchHistoryResponse {
  history: SearchHistoryItem[];
  count: number;
}

// Hook for fetching user preferences
export function useUserPreferences() {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['user', 'preferences', user?.id],
    queryFn: async (): Promise<UserPreferencesResponse> => {
      const response = await fetch('/api/user/preferences');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch user preferences');
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error.message === 'Authentication required') return false;
      return failureCount < 3;
    },
  });
}

// Mutation for creating user preferences
export function useCreateUserPreferences() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: InsertUserPreferences): Promise<UserPreferences> => {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save preferences');
      }
      const result = await response.json();
      return result.preferences;
    },
    onSuccess: (data) => {
      // Update the cache with new preferences using correct key
      if (user?.id) {
        queryClient.setQueryData(['user', 'preferences', user.id], { preferences: data });
      }
      // Also invalidate all preference queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['user', 'preferences'] });
      // Invalidate ranked businesses since preferences changed
      queryClient.invalidateQueries({ queryKey: ['businesses', 'ranked'] });
    },
  });
}

// Mutation for updating user preferences
export function useUpdateUserPreferences() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Partial<InsertUserPreferences>): Promise<UserPreferences> => {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update preferences');
      }
      const result = await response.json();
      return result.preferences;
    },
    onSuccess: (data) => {
      // Update the cache with new preferences using correct key
      if (user?.id) {
        queryClient.setQueryData(['user', 'preferences', user.id], { preferences: data });
      }
      // Also invalidate all preference queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['user', 'preferences'] });
      // Invalidate ranked businesses since preferences changed
      queryClient.invalidateQueries({ queryKey: ['businesses', 'ranked'] });
    },
  });
}

// Hook for fetching user search history
export function useSearchHistory(limit: number = 20) {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['user', 'searchHistory', user?.id, limit],
    queryFn: async (): Promise<SearchHistoryResponse> => {
      const response = await fetch(`/api/user/search-history?limit=${limit}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch search history');
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error.message === 'Authentication required') return false;
      return failureCount < 3;
    },
  });
}