import { BusinessCard } from "../BusinessCard";

export default function BusinessCardExample() {
  // TODO: remove mock functionality
  const mockBusiness = {
    id: "1",
    name: "Downtown Coffee Roastery",
    description: "Established specialty coffee shop with loyal customer base and premium roasting equipment. Located in high-traffic downtown area.",
    location: "Portland, OR",
    industry: "Food & Beverage",
    askingPrice: 450000,
    annualRevenue: 650000,
    cashFlow: 180000,
    ebitda: 165000,
    employees: 8,
    yearEstablished: 2018,
    aiScore: 87
  };

  return (
    <div className="p-4 max-w-md">
      <BusinessCard
        {...mockBusiness}
        onViewDetails={(id) => console.log(`View details for business ${id}`)}
        onContact={(id) => console.log(`Contact seller for business ${id}`)}
      />
    </div>
  );
}