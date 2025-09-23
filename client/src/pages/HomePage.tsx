import { useState, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { SearchFilters } from "../components/SearchFilters";
import { BusinessList } from "../components/BusinessList";
import { StatsOverview } from "../components/StatsOverview";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp, Building2, DollarSign, Star, ArrowRight, Globe } from "lucide-react";
// Removed unused imports as we now only use web search results
import { useUserPreferences, useCreateUserPreferences } from "../hooks/useUserPreferences";
import { useWebBusinessSearch } from "../hooks/useWebBusinessSearch";
import { useAuth } from "../contexts/AuthContext";
import { type UserPreferencesInsert } from "@shared/schema";



interface HomePageProps {
  globalSearchQuery?: string;
}

export default function HomePage({ globalSearchQuery }: HomePageProps) {
  const { isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBusinesses, setShowBusinesses] = useState(false);
  // Initialize filters from user preferences or use defaults
  const [filters, setFilters] = useState({
    priceRange: [50000, 5000000] as [number, number],
    revenueRange: [100000, 10000000] as [number, number],
    location: "",
    industry: [] as string[],
    riskTolerance: "any",
    involvement: "any",
    employees: "any",
    paybackPeriod: "any",
    query: ""
  });

  // API hooks - all must be called unconditionally at the top level
  const { data: userPreferencesData } = useUserPreferences();
  const createPreferencesMutation = useCreateUserPreferences();
  const webSearchMutation = useWebBusinessSearch();

  // Initialize filters with user preferences when available
  useEffect(() => {
    if (userPreferencesData?.preferences && isAuthenticated) {
      const prefs = userPreferencesData.preferences;
      setFilters({
        priceRange: [prefs.budgetRange?.min || 50000, prefs.budgetRange?.max || 5000000],
        revenueRange: [100000, 10000000],
        location: "",
        industry: prefs.preferredIndustries || [],
        riskTolerance: prefs.riskTolerance || "any",
        involvement: prefs.involvementLevel || "any",
        employees: prefs.businessSize || "any",
        paybackPeriod: "any",
        query: ""
      });
    }
  }, [userPreferencesData, isAuthenticated]);

  // Handle global search query from header
  useEffect(() => {
    console.log('Global search effect triggered. Query:', globalSearchQuery, 'isAuthenticated:', isAuthenticated);
    if (globalSearchQuery && globalSearchQuery.trim()) {
      console.log('Global search conditions met, updating filters and triggering search');
      setFilters(prev => ({
        ...prev,
        query: globalSearchQuery.trim()
      }));
      // Auto-trigger search when global query is received
      setShowBusinesses(true);
      console.log('Triggering web search for global query:', globalSearchQuery.trim());
      webSearchMutation.mutate({
        ...filters,
        query: globalSearchQuery.trim()
      });
    }
  }, [globalSearchQuery, isAuthenticated]);

  // Auto-trigger search when showBusinesses becomes true
  useEffect(() => {
    if (showBusinesses && !webSearchMutation.data && !webSearchMutation.isPending && isAuthenticated) {
      console.log('Auto-triggering search because showBusinesses is true and no data exists');
      handleWebSearch();
    }
  }, [showBusinesses, isAuthenticated]);

  // Only show web search results
  const hasWebSearchResults = webSearchMutation.data?.businesses && webSearchMutation.data.businesses.length > 0;
  
  console.log('📊 DEBUG: hasWebSearchResults:', hasWebSearchResults);
  console.log('📊 DEBUG: webSearchMutation.data:', webSearchMutation.data);
  if (webSearchMutation.data?.businesses?.length > 0) {
    console.log('📊 DEBUG: First business in webSearchMutation.data:', webSearchMutation.data.businesses[0]);
    console.log('📊 DEBUG: First business aiScore in webSearchMutation.data:', webSearchMutation.data.businesses[0].aiScore);
    console.log('📊 DEBUG: First business type check:', typeof webSearchMutation.data.businesses[0].aiScore);
  }
  console.log('📊 DEBUG: webSearchMutation.isPending:', webSearchMutation.isPending);
  console.log('📊 DEBUG: webSearchMutation.isSuccess:', webSearchMutation.isSuccess);
  console.log('📊 DEBUG: webSearchMutation.error:', webSearchMutation.error);
  

  const displayBusinesses = hasWebSearchResults
    ? webSearchMutation.data!.businesses.map((wb, index) => {
        console.log(`🏢 DEBUG: Processing business ${index}: ${wb.name}`);
        console.log(`🏢 DEBUG: Business ${index} raw wb.aiScore:`, wb.aiScore);
        console.log(`🏢 DEBUG: Business ${index} raw wb.ranking:`, wb.ranking);
        console.log(`🏢 DEBUG: Business ${index} raw wb.industry:`, wb.industry);
        console.log(`🏢 DEBUG: Business ${index} wb object:`, wb);
        
        // FIXED: Preserve aiScore from API response (backend returns 98 for technology businesses)
        const finalAiScore = wb.aiScore; // Direct assignment, API confirmed working
        
        const mappedBusiness = {
          id: wb.id, // Use original business ID instead of creating web-prefixed one
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
          aiScore: finalAiScore, // Use the preserved aiScore value
          sourceUrl: wb.sourceUrl || '',
          sourceSite: wb.sourceSite || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          sellerInfo: null,
          businessDetails: null,
          isActive: true
        };
        
        console.log(`🏢 DEBUG: Business ${index} mapped aiScore:`, mappedBusiness.aiScore);
        console.log(`🏢 DEBUG: Business ${index} mapped object:`, mappedBusiness);
        return mappedBusiness;
      })
    : [];
    
  console.log('🏢 DEBUG: Final displayBusinesses array:');
  console.log('🏢 DEBUG: displayBusinesses length:', displayBusinesses.length);
  displayBusinesses.forEach((business, index) => {
    console.log(`🏢 DEBUG: Final business ${index}: ${business.name} - aiScore: ${business.aiScore}`);
  });
  
  const isLoading = webSearchMutation.isPending;

  // Refresh handler - triggers a new web search
  const handleRefresh = () => {
    if (hasWebSearchResults) {
      handleWebSearch();
    }
  };

  // Calculate stats from web search data
  const realStats = [
    {
      title: "Live Listings Found",
      value: displayBusinesses.length.toString(),
      change: "From web search",
      trend: "up" as const,
      icon: Building2
    },
    {
      title: "Avg. Asking Price", 
      value: displayBusinesses.length > 0 
        ? `$${Math.round(displayBusinesses.reduce((sum, b) => sum + b.askingPrice, 0) / displayBusinesses.length / 1000)}K`
        : "$0",
      change: "Current listings",
      trend: "up" as const,
      icon: DollarSign
    },
    {
      title: "AI-Ranked Matches",
      value: (() => {
        const highScoreBusinesses = displayBusinesses.filter(b => b.aiScore >= 80);
        console.log('📈 DEBUG: Calculating AI-Ranked Matches');
        console.log('📈 DEBUG: Total displayBusinesses:', displayBusinesses.length);
        console.log('📈 DEBUG: All aiScores:', displayBusinesses.map(b => `${b.name}: ${b.aiScore}`));
        console.log('📈 DEBUG: Businesses with aiScore >= 80:', highScoreBusinesses.length);
        console.log('📈 DEBUG: High score businesses:', highScoreBusinesses.map(b => `${b.name}: ${b.aiScore}`));
        return highScoreBusinesses.length.toString();
      })(),
      change: "High compatibility",
      trend: "up" as const,
      icon: Star
    },
    {
      title: "Live Search Active",
      value: hasWebSearchResults ? "Yes" : "No",
      change: "Real-time data", 
      trend: "up" as const,
      icon: TrendingUp
    }
  ];

  const handleSearch = async (query: string) => {
    console.log(`Searching for: ${query}`);
    setShowBusinesses(true);
    // Update filters with the search query
    setFilters(prev => ({
      ...prev,
      query: query
    }));
    // Trigger the actual web search with updated filters
    try {
      console.log('Triggering web search for manual query:', query);
      await webSearchMutation.mutateAsync({
        ...filters,
        query: query
      });
    } catch (error) {
      console.error("Web search failed:", error);
    }
  };

  const handleGetStarted = () => {
    // Always show onboarding for non-authenticated users or users without preferences
    if (!isAuthenticated || !userPreferencesData?.preferences) {
      setShowOnboarding(true);
    } else {
      setShowBusinesses(true);
    }
  };

  const handleOnboardingComplete = async (data: UserPreferencesInsert) => {
    try {
      await createPreferencesMutation.mutateAsync(data);
      setShowOnboarding(false);
      setShowBusinesses(true);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      // Still proceed to business view for now
      setShowOnboarding(false);
      setShowBusinesses(true);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [50000, 5000000],
      revenueRange: [100000, 10000000],
      location: "",
      industry: [],
      riskTolerance: "any",
      involvement: "any",
      employees: "any",
      paybackPeriod: "any",
      query: ""
    });
  };

  const handleWebSearch = async () => {
    try {
      console.log('Triggering Live Search with filters:', filters);
      await webSearchMutation.mutateAsync(filters);
    } catch (error) {
      console.error("Web search failed:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          setShowBusinesses(true);
        }}
      />

      {!showBusinesses ? (
        // Landing Page
        <div className="space-y-16">
          <HeroSection onSearch={handleSearch} onGetStarted={handleGetStarted} />
          
          <div className="px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Market Overview</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Real-time insights from thousands of business listings across major platforms
                </p>
              </div>
              <StatsOverview stats={realStats} />
            </div>

            {/* Live Search Prompt */}
            <div className="mb-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Discover Live Business Opportunities</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Search for the latest business listings from major platforms with AI-powered ranking based on your preferences
                </p>
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  data-testid="button-start-search"
                >
                  Start Live Search
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* How It Works */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-8">How BizSearch Works</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Set Your Preferences</h3>
                  <p className="text-muted-foreground">
                    Tell us about your investment capacity, risk tolerance, and involvement level
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-Powered Ranking</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes thousands of businesses and ranks them based on your unique criteria
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Connect & Acquire</h3>
                  <p className="text-muted-foreground">
                    Contact sellers directly and move forward with your perfect business match
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  data-testid="button-cta-get-started"
                >
                  Start Finding Businesses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Business Search Results
        <div className="px-6 lg:px-8 max-w-7xl mx-auto py-8 space-y-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
              />
              

              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span>Avg. Multiple:</span>
                      <span className="font-semibold">3.2x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Median Price:</span>
                      <span className="font-semibold">$485K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time on Market:</span>
                      <span className="font-semibold">127 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <StatsOverview stats={realStats} />
              
              {/* Live Search Button - Top Center */}
              <div className="flex justify-center">
                <Button
                  onClick={handleWebSearch}
                  disabled={webSearchMutation.isPending}
                  size="lg"
                  data-testid="button-web-search-main"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {webSearchMutation.isPending ? "Searching..." : "Live Search"}
                </Button>
              </div>
              
              {webSearchMutation.data && (
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Found {webSearchMutation.data.totalFound} new businesses from web sources!
                    </p>
                  </div>
                </div>
              )}
              
              {webSearchMutation.error && (
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {webSearchMutation.error.message}
                    </p>
                  </div>
                </div>
              )}
              
              <BusinessList
                businesses={displayBusinesses}
                loading={isLoading}
                onViewDetails={(id) => console.log(`View details: ${id}`)}
                onContact={(id) => console.log(`Contact seller: ${id}`)}
                hasMore={displayBusinesses.length >= 20}
                onLoadMore={() => console.log("Load more")}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}