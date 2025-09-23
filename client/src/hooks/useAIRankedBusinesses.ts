import { useQuery } from "@tanstack/react-query";

export function useAIRankedBusinesses(query?: string) {
  return useQuery({
    queryKey: ['/api/businesses/web-search', query || 'technology'],
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}