// Simplified demo authentication hooks
import { useQuery } from '@tanstack/react-query';

// Demo user is always authenticated
export function useUser() {
  return useQuery({
    queryKey: ['/api/user/me'],
    staleTime: Infinity, // Demo user never changes
  });
}

// Demo auth check - always returns true
export function useAuth() {
  const { data: user, isLoading } = useUser();
  
  return {
    user,
    isLoading,
    isAuthenticated: !isLoading && !!user, // Always true in demo mode
    login: () => Promise.resolve(), // No-op in demo
    logout: () => Promise.resolve(), // No-op in demo
    signup: () => Promise.resolve(), // No-op in demo
  };
}

// Demo user preferences
export function useUserPreferences() {
  return useQuery({
    queryKey: ['/api/user/preferences'],
    staleTime: 60000, // 1 minute
  });
}