import { BusinessCard } from "./BusinessCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Grid, List, RefreshCw } from "lucide-react";
import { useState } from "react";
import { type Business } from "@shared/schema";

interface BusinessListProps {
  businesses: Business[];
  loading?: boolean;
  onViewDetails: (id: string) => void;
  onContact: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onRefresh?: () => void;
}

type SortOption = "askingPrice" | "annualRevenue" | "cashFlow" | "yearEstablished";
type ViewMode = "grid" | "list";

export function BusinessList({ 
  businesses, 
  loading = false, 
  onViewDetails, 
  onContact, 
  onLoadMore,
  hasMore = false,
  onRefresh 
}: BusinessListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("askingPrice");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const sortedBusinesses = [...businesses].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === "desc") {
      return bValue - aValue;
    }
    return aValue - bValue;
  });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Loading businesses...</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-card rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No businesses found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-business-count">
            {businesses.length} Businesses Found
          </h2>
          <p className="text-muted-foreground">Ranked by AI compatibility score</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              data-testid="button-refresh"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={(value: SortOption) => handleSort(value)} data-testid="select-sort">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="askingPrice">Asking Price</SelectItem>
              <SelectItem value="annualRevenue">Annual Revenue</SelectItem>
              <SelectItem value="cashFlow">Cash Flow</SelectItem>
              <SelectItem value="yearEstablished">Year Established</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            data-testid="button-sort-order"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Business Grid/List */}
      <div className={`${
        viewMode === "grid" 
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
      }`}>
        {sortedBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            {...business}
            onViewDetails={onViewDetails}
            onContact={onContact}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-6">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            data-testid="button-load-more"
          >
            Load More Businesses
          </Button>
        </div>
      )}
    </div>
  );
}