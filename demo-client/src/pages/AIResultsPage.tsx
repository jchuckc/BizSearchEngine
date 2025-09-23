import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Star, Building2 } from "lucide-react";
import { useAIRankedBusinesses } from "@/hooks/useAIRankedBusinesses";
import { BusinessList } from "@/components/BusinessList";

export default function AIResultsPage() {
  const [searchQuery, setSearchQuery] = useState("technology");
  const [inputValue, setInputValue] = useState("technology");
  
  const { data: queryData, isLoading, error, refetch } = useAIRankedBusinesses(searchQuery);

  const handleSearch = () => {
    setSearchQuery(inputValue);
    refetch();
  };

  // Transform API response data to match BusinessList expectations
  const businesses = (queryData as any)?.businesses?.map((wb: any) => ({
    id: `web-${wb.sourceSite}-${wb.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}`,
    name: wb.name,
    description: wb.description,
    location: wb.location,
    industry: wb.industry,
    askingPrice: wb.askingPrice,
    annualRevenue: wb.annualRevenue,
    cashFlow: wb.cashFlow,
    ebitda: wb.ebitda,
    employees: wb.employees,
    yearEstablished: wb.yearEstablished,
    aiScore: wb.aiScore || wb.compatibilityScore || wb.ranking || 0,
    sourceUrl: wb.sourceUrl || '',
    sourceSite: wb.sourceSite || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  })) || [];

  const highScoreMatches = businesses.filter((b: any) => b.aiScore >= 80).length;

  if (error) {
    return (
      <div className="container mx-auto p-6" data-testid="page-ai-rankings">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Error Loading AI Rankings</h1>
          <p className="text-muted-foreground mt-2">Failed to fetch business data</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6" data-testid="page-ai-rankings">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Business Rankings</h1>
        </div>
        <p className="text-muted-foreground">
          Discover businesses ranked by AI compatibility score based on your preferences
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Search AI-Ranked Businesses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              data-testid="input-ai-search"
              placeholder="Search for businesses (e.g., technology, restaurant, retail)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              data-testid="button-ai-search"
              onClick={handleSearch} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold" data-testid="text-ai-total-businesses">
                  {businesses.length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High-Score Matches</p>
                <p className="text-2xl font-bold" data-testid="text-ai-high-score-matches">
                  {highScoreMatches}
                </p>
              </div>
              <Star className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Search Query</p>
                <p className="text-lg font-medium" data-testid="text-ai-search-query">
                  {searchQuery}
                </p>
              </div>
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing businesses with AI...</p>
        </div>
      )}

      {/* Results */}
      {!isLoading && businesses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {businesses.length} Businesses Found
            </h2>
            <Badge variant="secondary">
              Ranked by AI compatibility score
            </Badge>
          </div>
          
          <BusinessList 
            businesses={businesses}
            onViewDetails={(businessId: string) => console.log('View details:', businessId)}
            onContact={(businessId: string) => console.log('Contact:', businessId)}
          />
        </div>
      )}

      {/* No Results */}
      {!isLoading && businesses.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
}