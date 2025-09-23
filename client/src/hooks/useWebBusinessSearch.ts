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
    ranking: number;
    rankingExplanation: string;
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
      const params = new URLSearchParams();
      console.log('WebSearch filters:', filters);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          console.log(`Processing filter: ${key} = ${value}`);
          // Special handling for query parameter to always include it
          if (key === 'query' && value && value.trim()) {
            params.append('query', String(value).trim());
            console.log('Added query parameter:', value);
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
      console.log('Final API URL:', url);
      console.log('URLParams object:', Object.fromEntries(params));
      const response = await apiRequest('GET', url);
      const result = await response.json();
      console.log('API Response:', result);
      return result;
    },
    onSuccess: (data) => {
      // Cache the results for the web search query
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
            sourceSite: business.sourceSite
          },
          score: {
            score: business.ranking || 0,
            reasoning: business.rankingExplanation || '',
            factors: {}
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