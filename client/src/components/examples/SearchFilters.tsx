import { SearchFilters } from "../SearchFilters";
import { useState } from "react";

export default function SearchFiltersExample() {
  // TODO: remove mock functionality
  const [filters, setFilters] = useState({
    priceRange: [100000, 1000000] as [number, number],
    revenueRange: [200000, 2000000] as [number, number],
    location: "",
    industry: ["Food & Beverage", "Technology"],
    riskTolerance: "medium",
    involvement: "medium",
    employees: "6-15"
  });

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
    <div className="p-4 max-w-md">
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}