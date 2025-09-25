import { BusinessList } from "../BusinessList";

export default function BusinessListExample() {
  // TODO: remove mock functionality
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
    },
    {
      id: "4",
      name: "Metro Fitness Center",
      description: "Well-equipped gym with 500+ members, group classes, and personal training services.",
      location: "Miami, FL",
      industry: "Healthcare",
      askingPrice: 675000,
      annualRevenue: 890000,
      cashFlow: 225000,
      ebitda: 198000,
      employees: 18,
      yearEstablished: 2017,
      aiScore: 84
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BusinessList
        businesses={mockBusinesses}
        onContact={(id) => console.log(`Contact seller for business ${id}`)}
        onLoadMore={() => console.log("Load more businesses")}
        hasMore={true}
      />
    </div>
  );
}