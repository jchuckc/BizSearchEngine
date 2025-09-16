import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilters } from "@/components/SearchFilters";
import { BusinessList } from "@/components/BusinessList";
import { StatsOverview } from "@/components/StatsOverview";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, DollarSign, Star, ArrowRight } from "lucide-react";

// TODO: remove mock functionality
const mockStats = [
  {
    title: "Total Businesses",
    value: "2,847",
    change: "+12% from last month",
    trend: "up" as const,
    icon: Building2
  },
  {
    title: "Avg. Asking Price", 
    value: "$485K",
    change: "+5% from last month",
    trend: "up" as const,
    icon: DollarSign
  },
  {
    title: "High-Score Matches",
    value: "184", 
    change: "+23% from last month",
    trend: "up" as const,
    icon: Star
  },
  {
    title: "Market Growth",
    value: "8.2%",
    change: "+2.1% from last month", 
    trend: "up" as const,
    icon: TrendingUp
  }
];

const mockBusinesses = [
  {
    id: "1",
    name: "Downtown Coffee Roastery", 
    description: "Established specialty coffee shop with loyal customer base and premium roasting equipment.",
    location: "Portland, OR",
    industry: "Food & Beverage",
    askingPrice: 450000,
    annualRevenue: 650000,
    cashFlow: 180000,
    ebitda: 165000,
    employees: 8,
    yearEstablished: 2018,
    aiScore: 87
  },
  {
    id: "2",
    name: "Tech Solutions Inc",
    description: "B2B software consulting firm specializing in small business automation and digital transformation.",
    location: "Austin, TX", 
    industry: "Technology",
    askingPrice: 850000,
    annualRevenue: 1200000,
    cashFlow: 320000,
    ebitda: 290000,
    employees: 15,
    yearEstablished: 2016,
    aiScore: 92
  },
  {
    id: "3", 
    name: "Green Valley Landscaping",
    description: "Full-service commercial and residential landscaping company with established client base.",
    location: "Denver, CO",
    industry: "Professional Services", 
    askingPrice: 320000,
    annualRevenue: 480000,
    cashFlow: 145000,
    ebitda: 132000,
    employees: 12,
    yearEstablished: 2015,
    aiScore: 78
  }
];

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBusinesses, setShowBusinesses] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [50000, 5000000] as [number, number],
    revenueRange: [100000, 10000000] as [number, number],
    location: "",
    industry: [] as string[],
    riskTolerance: "",
    involvement: "",
    employees: ""
  });

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    setShowBusinesses(true);
  };

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (data: any) => {
    console.log("Onboarding completed:", data);
    setShowOnboarding(false);
    setShowBusinesses(true);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [50000, 5000000],
      revenueRange: [100000, 10000000],
      location: "",
      industry: [],
      riskTolerance: "",
      involvement: "",
      employees: ""
    });
  };

  return (
    <div className="min-h-screen">
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

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
              <StatsOverview stats={mockStats} />
            </div>

            {/* Featured Businesses */}
            <div className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
                  <p className="text-muted-foreground">
                    Hand-picked businesses with high investment potential
                  </p>
                </div>
                <Button
                  onClick={() => setShowBusinesses(true)}
                  data-testid="button-view-all-businesses"
                >
                  View All Businesses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockBusinesses.map((business) => (
                  <Card key={business.id} className="hover-elevate" data-testid={`card-featured-${business.id}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{business.name}</span>
                        <span className="text-primary font-bold">{business.aiScore}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{business.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-semibold">
                            ${business.askingPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Revenue:</span>
                          <span>${business.annualRevenue.toLocaleString()}</span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-4"
                          onClick={() => console.log(`View ${business.id}`)}
                          data-testid={`button-view-featured-${business.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            <div className="flex-1">
              <BusinessList
                businesses={mockBusinesses}
                onViewDetails={(id) => console.log(`View details: ${id}`)}
                onContact={(id) => console.log(`Contact seller: ${id}`)}
                hasMore={true}
                onLoadMore={() => console.log("Load more")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}