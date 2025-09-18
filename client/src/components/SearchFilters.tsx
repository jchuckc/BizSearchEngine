import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter, RotateCcw, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface FilterState {
  priceRange: [number, number];
  revenueRange: [number, number];
  location: string;
  industry: string[];
  riskTolerance: string;
  involvement: string;
  employees: string;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const industries = [
  "Any",
  "Technology",
  "Healthcare", 
  "Finance",
  "Manufacturing",
  "Retail",
  "Food & Beverage",
  "Services",
  "Real Estate",
  "Education",
  "Transportation"
];

const riskLevels = [
  { value: "any", label: "Any Risk Level" },
  { value: "low", label: "Low Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "high", label: "High Risk" }
];

const involvementLevels = [
  { value: "any", label: "Any Involvement Level" },
  { value: "low", label: "Low Touch (Semi-Absentee)" },
  { value: "medium", label: "Medium Touch (Managerial)" },
  { value: "high", label: "High Touch (Owner-Operator)" }
];

const employeeSizes = [
  { value: "any", label: "Any Size" },
  { value: "small", label: "Small - Under 10 employees" },
  { value: "medium", label: "Medium - 10-50 employees" },
  { value: "large", label: "Large - 50+ employees" }
];

const majorUSCities = [
  "Any Location",
  "Albuquerque, NM",
  "Arlington, TX",
  "Atlanta, GA",
  "Austin, TX",
  "Baltimore, MD",
  "Boston, MA",
  "Charlotte, NC",
  "Chicago, IL",
  "Colorado Springs, CO",
  "Columbus, OH",
  "Dallas, TX",
  "Denver, CO",
  "Detroit, MI",
  "El Paso, TX",
  "Fort Worth, TX",
  "Fresno, CA",
  "Houston, TX",
  "Indianapolis, IN",
  "Jacksonville, FL",
  "Kansas City, MO",
  "Las Vegas, NV",
  "Long Beach, CA",
  "Los Angeles, CA",
  "Louisville, KY",
  "Memphis, TN",
  "Mesa, AZ",
  "Miami, FL",
  "Milwaukee, WI",
  "Minneapolis, MN",
  "Nashville, TN",
  "New Orleans, LA",
  "New York, NY",
  "Oakland, CA",
  "Oklahoma City, OK",
  "Omaha, NE",
  "Philadelphia, PA",
  "Phoenix, AZ",
  "Portland, OR",
  "Raleigh, NC",
  "Sacramento, CA",
  "San Antonio, TX",
  "San Diego, CA",
  "San Francisco, CA",
  "San Jose, CA",
  "Seattle, WA",
  "Tampa, FL",
  "Tucson, AZ",
  "Tulsa, OK",
  "Virginia Beach, VA",
  "Washington, DC"
];

export function SearchFilters({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleRevenueRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, revenueRange: [value[0], value[1]] });
  };

  const handleLocationChange = (value: string) => {
    const newLocation = value === "Any Location" ? "" : value;
    onFiltersChange({ ...filters, location: newLocation });
    setLocationOpen(false);
    setLocationSearch("");
  };

  const filteredCities = useMemo(() => {
    if (!locationSearch) return majorUSCities;
    return majorUSCities.filter(city => 
      city.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [locationSearch]);

  const handleIndustryToggle = (industry: string) => {
    // Handle "Any" industry selection by clearing all industries
    if (industry === "Any") {
      onFiltersChange({ ...filters, industry: [] });
      return;
    }
    
    const newIndustries = filters.industry.includes(industry)
      ? filters.industry.filter(i => i !== industry)
      : [...filters.industry, industry];
    onFiltersChange({ ...filters, industry: newIndustries });
  };

  const removeIndustry = (industry: string) => {
    const newIndustries = filters.industry.filter(i => i !== industry);
    onFiltersChange({ ...filters, industry: newIndustries });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-filters"
            >
              {isExpanded ? "Hide" : "Show"} Filters
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              data-testid="button-clear-filters"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationOpen}
                  className="w-full justify-between"
                  data-testid="button-location-select"
                >
                  {filters.location || "Any Location"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search cities..."
                    value={locationSearch}
                    onValueChange={setLocationSearch}
                    data-testid="input-location-search"
                  />
                  <CommandList>
                    <CommandEmpty>No cities found.</CommandEmpty>
                    <CommandGroup>
                      {filteredCities.map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={handleLocationChange}
                          data-testid={`option-location-${city.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                        >
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={5000000}
              min={Math.min(filters.priceRange[0], 50000)}
              step={25000}
              className="w-full"
              data-testid="slider-price-range"
            />
          </div>

          {/* Revenue Range */}
          <div className="space-y-3">
            <Label>Annual Revenue: {formatCurrency(filters.revenueRange[0])} - {formatCurrency(filters.revenueRange[1])}</Label>
            <Slider
              value={filters.revenueRange}
              onValueChange={handleRevenueRangeChange}
              max={10000000}
              min={Math.min(filters.revenueRange[0], 100000)}
              step={50000}
              className="w-full"
              data-testid="slider-revenue-range"
            />
          </div>

          {/* Industries */}
          <div className="space-y-3">
            <Label>Industries</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.industry.map((industry) => (
                <Badge key={industry} variant="default" className="gap-1" data-testid={`badge-industry-${industry.replace(/\s+/g, '-').toLowerCase()}`}>
                  {industry}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeIndustry(industry)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleIndustryToggle} data-testid="select-industry">
              <SelectTrigger>
                <SelectValue placeholder="Add industry..." />
              </SelectTrigger>
              <SelectContent>
                {industries
                  .filter(industry => !filters.industry.includes(industry))
                  .map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-2">
            <Label>Risk Tolerance</Label>
            <Select
              value={filters.riskTolerance}
              onValueChange={(value) => onFiltersChange({ ...filters, riskTolerance: value })}
              data-testid="select-risk-tolerance"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level..." />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Involvement Level */}
          <div className="space-y-2">
            <Label>Desired Involvement</Label>
            <Select
              value={filters.involvement}
              onValueChange={(value) => onFiltersChange({ ...filters, involvement: value })}
              data-testid="select-involvement"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select involvement level..." />
              </SelectTrigger>
              <SelectContent>
                {involvementLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Count */}
          <div className="space-y-2">
            <Label>Business Size (Employees)</Label>
            <Select
              value={filters.employees}
              onValueChange={(value) => onFiltersChange({ ...filters, employees: value })}
              data-testid="select-employees"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business size..." />
              </SelectTrigger>
              <SelectContent>
                {employeeSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
}