import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessList } from "@/components/BusinessList";
import { SearchFilters } from "@/components/SearchFilters";
import { Building2, TrendingUp, DollarSign, Users, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/demoQueryClient";
import { useUserPreferences } from "../hooks/useDemoAuth";
import { useToast } from "@/hooks/use-toast";

export default function DemoHomePage() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { data: userPreferencesData } = useUserPreferences();
  const { toast } = useToast();

  // Web search mutation for demo
  const webSearchMutation = useMutation({
    mutationFn: async (filters = {}) => {
      const response = await apiRequest('POST', '/api/web-search', { 
        query: 'demo business search',
        filters 
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Demo Search Complete",
        description: `Found ${data.totalFound} businesses using mock data`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search businesses",
        variant: "destructive",
      });
    },
  });

  // Auto-trigger search when component loads
  useEffect(() => {
    if (!isSearchActive && userPreferencesData) {
      handleWebSearch();
      setIsSearchActive(true);
    }
  }, [userPreferencesData]);

  const handleWebSearch = () => {
    webSearchMutation.mutate({});
  };

  // Create stable IDs for demo businesses
  const createStableWebId = (business: any): string => {
    if (business.sourceUrl) {
      return `demo-${business.sourceUrl.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 50)}`;
    }
    return `demo-${business.sourceSite}-${business.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}`;
  };

  const displayBusinesses = webSearchMutation.data?.businesses?.map((wb: any) => ({
    id: createStableWebId(wb),
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
    aiScore: wb.compatibilityScore || wb.ranking || 0,
    sourceUrl: wb.sourceUrl || '',
    sourceSite: wb.sourceSite || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  })) || [];

  const isLoading = webSearchMutation.isPending;

  // Calculate demo stats
  const demoStats = [
    {
      title: "Demo Businesses",
      value: displayBusinesses.length.toString(),
      change: "Static demo data",
      trend: "up" as const,
      icon: Building2
    },
    {
      title: "Avg. Asking Price",
      value: displayBusinesses.length > 0 
        ? `$${Math.round(displayBusinesses.reduce((sum, b) => sum + b.askingPrice, 0) / displayBusinesses.length / 1000)}K`
        : "$0",
      change: "Demo calculation",
      trend: "up" as const,
      icon: DollarSign
    },
    {
      title: "AI-Ranked Matches",
      value: displayBusinesses.filter(b => b.aiScore > 75).length.toString(),
      change: "Mock AI scoring",
      trend: "up" as const,
      icon: TrendingUp
    },
    {
      title: "Total Employees",
      value: displayBusinesses.length > 0
        ? displayBusinesses.reduce((sum, b) => sum + b.employees, 0).toString()
        : "0",
      change: "Across all businesses",
      trend: "up" as const,
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Info Banner */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-primary">
            <Info className="h-4 w-4" />
            <span>
              <strong>Demo Mode:</strong> This is a simplified version with static data, 
              mock AI scoring, and no external API dependencies.
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            BizSearch <Badge variant="secondary">Demo</Badge>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our AI-powered business discovery platform with 50+ realistic demo listings 
            and intelligent compatibility scoring.
          </p>
        </div>

        {/* Demo Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {demoStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Filters */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Demo Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchFilters 
                  onFiltersChange={(filters) => {
                    webSearchMutation.mutate(filters);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Business List */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Demo Business Listings
              </h2>
              <Button 
                onClick={handleWebSearch}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Loading..." : "Refresh Demo Data"}
              </Button>
            </div>

            <BusinessList
              businesses={displayBusinesses}
              isLoading={isLoading}
              onViewDetails={(id) => {
                console.log('Demo: View details for', id);
              }}
              onContact={(id) => {
                toast({
                  title: "Demo Contact",
                  description: "In demo mode, contact functionality is simulated.",
                });
              }}
              onRefresh={handleWebSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}