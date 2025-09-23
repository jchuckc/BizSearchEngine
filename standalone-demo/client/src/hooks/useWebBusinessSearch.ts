import { useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
    aiScore: number;
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
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          // Special handling for location to allow "Any Location" to be sent to server
          if (key === 'location' && (value === '' || value === 'Any Location')) {
            params.append('location', 'Any Location');
          } else if (value && value !== '' && value !== 'any' && (Array.isArray(value) ? value.length > 0 : true)) {
            // Map 'industry' to 'industries' for server compatibility
            const serverKey = key === 'industry' ? 'industries' : key;
            
            if (Array.isArray(value)) {
              // Filter out 'Any' from industry arrays
              const filteredValue = key === 'industry' ? value.filter(v => v !== 'Any') : value;
              if (filteredValue.length > 0) {
                params.append(serverKey, JSON.stringify(filteredValue));
              }
            } else if (typeof value === 'object' && key.includes('Range')) {
              params.append(serverKey, JSON.stringify(value));
            } else {
              params.append(serverKey, String(value));
            }
          }
        });
      }
      
      const url = `/api/businesses/web-search${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiRequest('GET', url);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('!!! WebSearch onSuccess CALLED - Total businesses:', data.totalFound);
      console.log('!!! Raw API Response:', JSON.stringify(data, null, 2));
      console.log('!!! First business aiScore:', data.businesses[0]?.aiScore);
      
      // Cache the results for the web search query
      queryClient.setQueryData(['businesses', 'web-search'], data);
      
      // Cache individual business details for web search results
      data.businesses.forEach(business => {
        console.log('Processing business:', business.name, 'AI Score:', business.aiScore);
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
            score: business.aiScore || business.compatibilityScore || business.ranking || 0,
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