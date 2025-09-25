import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { type Business, type BusinessScore } from '@shared/schema';

// Types for API responses
interface BusinessWithScore extends Business {
  score?: BusinessScore;
}

interface RankedBusiness extends BusinessScore {
  business: Business;
}

interface BusinessListResponse {
  businesses: Business[];
  count: number;
}

interface RankedBusinessResponse {
  businesses: RankedBusiness[];
  count: number;
}

interface SearchResponse {
  businesses: Business[];
  query: string;
  count: number;
}

interface BusinessFilters {
  priceRange?: [number, number];
  revenueRange?: [number, number];
  location?: string;
  industries?: string[];
  employees?: string;
  limit?: number;
  offset?: number;
}

// Hook for fetching businesses with filters
export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery({
    queryKey: ['businesses', filters],
    queryFn: async (): Promise<BusinessListResponse> => {
      const params = new URLSearchParams();
      
      if (filters.priceRange) {
        params.append('priceRange', JSON.stringify(filters.priceRange));
      }
      if (filters.revenueRange) {
        params.append('revenueRange', JSON.stringify(filters.revenueRange));
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.industries && filters.industries.length > 0) {
        params.append('industries', JSON.stringify(filters.industries));
      }
      if (filters.employees) {
        params.append('employees', filters.employees);
      }
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters.offset) {
        params.append('offset', filters.offset.toString());
      }

      const response = await fetch(`/api/businesses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for searching businesses
export function useBusinessSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['businesses', 'search', query],
    queryFn: async (): Promise<SearchResponse> => {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`/api/businesses/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search businesses');
      }
      return response.json();
    },
    enabled: enabled && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for fetching a single business
export function useBusiness(id: string) {
  return useQuery({
    queryKey: ['businesses', id],
    queryFn: async (): Promise<{ business: Business; score?: BusinessScore }> => {
      console.log('🔍 useBusiness: fetching business', id);
      
      // Check if this business is already cached from web search results
      const cachedData = queryClient.getQueryData(['businesses', id]);
      if (cachedData) {
        console.log('🔍 useBusiness: Found cached data for business', id);
        return cachedData as { business: Business; score?: BusinessScore };
      }
      
      const response = await fetch(`/api/businesses/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch business');
      }
      const data = await response.json();
      console.log('useBusiness: received data', { businessId: data.business?.id, hasScore: !!data.score, score: data.score });
      return data;
    },
    enabled: !!id, // Allow queries for all business IDs
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Hook for fetching ranked businesses for the authenticated user
export function useRankedBusinesses(limit: number = 20, enabled: boolean = true) {
  return useQuery({
    queryKey: ['businesses', 'ranked', limit],
    queryFn: async (): Promise<RankedBusinessResponse> => {
      const response = await fetch(`/api/businesses/ranked?limit=${limit}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch ranked businesses');
      }
      return response.json();
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error.message === 'Authentication required') return false;
      return failureCount < 3;
    },
  });
}

// Mutation for ranking a single business
export function useRankBusiness() {
  return useMutation({
    mutationFn: async (businessId: string): Promise<{ score: BusinessScore; ranking: any }> => {
      const response = await fetch(`/api/businesses/${businessId}/rank`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to rank business');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['businesses', 'ranked'] });
    },
  });
}

// Mutation for batch ranking businesses
export function useRankMultipleBusinesses() {
  return useMutation({
    mutationFn: async (businessIds: string[]): Promise<{ rankings: RankedBusiness[]; count: number }> => {
      const response = await fetch('/api/businesses/rank-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessIds }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to rank businesses');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['businesses', 'ranked'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}