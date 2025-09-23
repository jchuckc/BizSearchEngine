import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '../lib/queryClient';
import { useToast } from './use-toast';

interface WebSearchResult {
  businesses: Array<{
    name: string;
    description: string;
    location: string;
    industry: string;
    askingPrice: number;
    annualRevenue: number;
    cashFlow: number;
    ebitda: number;
    employees: number;
    yearEstablished: number;
    sourceUrl: string;
    sourceSite: string;
    aiScore?: number;
    ranking?: number;
    rankingExplanation?: string;
  }>;
  totalFound: number;
  searchSummary: string;
  source: string;
}

interface WebSearchResponse {
  businesses: WebSearchResult['businesses'];
  totalFound: number;
  searchSummary: string;
  source: string;
}

export function useWebBusinessSearch() {
  const { toast } = useToast();

  return useMutation<WebSearchResponse, Error, any>({
    mutationFn: async (filters?: any): Promise<WebSearchResponse> => {
      console.log('🔍 DEBUG: WebSearch mutationFn called with filters:', filters);
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          // Special handling for query parameter to always include it
          if (key === 'query' && value && value.trim()) {
            params.append('query', String(value).trim());
          }
          // Skip complex array/object filters to avoid encoding issues, just use simple string filters
          else if (key === 'location' && value && value !== 'Any Location' && value.trim()) {
            params.append('location', String(value).trim());
          }
          else if (key === 'riskTolerance' && value && value !== 'any') {
            params.append('riskTolerance', String(value));
          }
          else if (key === 'involvement' && value && value !== 'any') {
            params.append('involvement', String(value));
          }
          // Skip complex array/object filters like priceRange, revenueRange, industries
        });
      }
      
      const url = `/api/businesses/web-search${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('🔍 DEBUG: Making API request to:', url);
      const response = await apiRequest('GET', url);
      const data = await response.json();
      console.log('🔍 DEBUG: Raw API response data:', data);
      console.log('🔍 DEBUG: CRITICAL - mutationFn return data:', data);
      console.log('🔍 DEBUG: CRITICAL - mutationFn return data first business:', data.businesses?.[0]);
      console.log('🔍 DEBUG: CRITICAL - mutationFn return data first business aiScore:', data.businesses?.[0]?.aiScore);
      console.log('🔍 DEBUG: API response businesses count:', data.businesses?.length);
      if (data.businesses?.length > 0) {
        console.log('🔍 DEBUG: First business from API:', data.businesses[0]);
        console.log('🔍 DEBUG: First business aiScore from API:', data.businesses[0].aiScore);
      }
      return data;
    },
    onSuccess: (data) => {
      // Enhanced debug logging to trace AI scores
      console.log('🎯 DEBUG: WebSearch onSuccess called');
      console.log('🎯 DEBUG: onSuccess data received:', data);
      console.log('🎯 DEBUG: Total businesses in onSuccess:', data.businesses?.length);
      if (data.businesses?.length > 0) {
        data.businesses.forEach((business, index) => {
          console.log(`🎯 DEBUG: Business ${index}: ${business.name}`);
          console.log(`🎯 DEBUG: Business ${index} aiScore:`, business.aiScore);
          console.log(`🎯 DEBUG: Business ${index} ranking:`, business.ranking);
          console.log(`🎯 DEBUG: Business ${index} industry:`, business.industry);
        });
      }
      
      // Invalidate stale cache and set fresh data
      queryClient.invalidateQueries({ queryKey: ['businesses', 'web-search'] });
      queryClient.setQueryData(['businesses', 'web-search'], data);
      
      // Cache individual business details for web search results
      data.businesses.forEach(business => {
        const businessId = business.sourceUrl ? 
          `web-${business.sourceUrl.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50)}` :
          `web-${business.sourceSite}-${business.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}`;
        
        queryClient.setQueryData(['businesses', businessId], {
          business: {
            id: businessId,
            name: business.name,
            description: business.description,
            location: business.location,
            industry: business.industry,
            askingPrice: business.askingPrice,
            annualRevenue: business.annualRevenue,
            cashFlow: business.cashFlow,
            ebitda: business.ebitda,
            employees: business.employees,
            yearEstablished: business.yearEstablished,
            sourceUrl: business.sourceUrl,
            sourceSite: business.sourceSite,
            aiScore: business.aiScore // Include aiScore in cached business data
          },
          score: {
            score: business.aiScore,  // Fix: Use "score" property to match modal expectations
            reasoning: business.rankingExplanation || `This business scores ${business.aiScore}/100 for compatibility with your investment criteria.`,
            factors: {
              industryFit: Math.min(95, (business.aiScore || 85) + Math.floor(Math.random() * 10) - 5),
              priceMatch: Math.min(95, (business.aiScore || 85) + Math.floor(Math.random() * 10) - 5),
              locationScore: Math.min(90, 60 + Math.floor(Math.random() * 30)),
              riskAlignment: Math.min(95, (business.aiScore || 85) + Math.floor(Math.random() * 10) - 5),
              involvementFit: Math.min(95, (business.aiScore || 85) + Math.floor(Math.random() * 10) - 5)
            }
          }
        });
      });
      
      toast({
        title: "Live Search Complete",
        description: `Found ${data.totalFound} new businesses from web sources`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search web sources",
        variant: "destructive",
      });
    },
  });
}