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
  "Food & Beverage",
  "Retail",
  "Technology",
  "Healthcare",
  "Manufacturing",
  "Professional Services",
  "Real Estate",
  "Transportation",
  "Education",
  "Entertainment"
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
  { value: "1-5", label: "1-5 employees" },
  { value: "6-15", label: "6-15 employees" },
  { value: "16-50", label: "16-50 employees" },
  { value: "50+", label: "50+ employees" }
];

const majorUSCities = [
  "Any Location",
  "New York, NY",
  "Los Angeles, CA", 
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Mesa, AZ",
  "Sacramento, CA",
  "Atlanta, GA",
  "Kansas City, MO",
  "Colorado Springs, CO",
  "Miami, FL",
  "Raleigh, NC",
  "Omaha, NE",
  "Long Beach, CA",
  "Virginia Beach, VA",
  "Oakland, CA",
  "Minneapolis, MN",
  "Tulsa, OK",
  "Tampa, FL",
  "Arlington, TX",
  "New Orleans, LA"
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
    onFiltersChange({ ...filters, location: value === "Any Location" ? "" : value });
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
              min={50000}
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
              min={100000}
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