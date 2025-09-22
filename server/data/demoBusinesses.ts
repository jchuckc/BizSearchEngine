// Static demo business data - no web scraping required
export const demoBusinessListings = [
  {
    name: "TechCorp Solutions",
    description: "Established software development company specializing in enterprise applications with recurring revenue streams.",
    location: "New York, NY",
    industry: "Technology",
    askingPrice: 850000,
    annualRevenue: 1200000,
    cashFlow: 320000,
    ebitda: 280000,
    employees: 12,
    yearEstablished: 2018,
    sourceUrl: "https://demo.example.com/techcorp",
    sourceSite: "Demo Business Portal"
  },
  {
    name: "Metro Cafe Chain",
    description: "Profitable 3-location coffee shop chain with loyal customer base and growth potential.",
    location: "San Francisco, CA", 
    industry: "Food & Beverage",
    askingPrice: 650000,
    annualRevenue: 890000,
    cashFlow: 180000,
    ebitda: 165000,
    employees: 24,
    yearEstablished: 2016,
    sourceUrl: "https://demo.example.com/metro-cafe",
    sourceSite: "Demo Business Portal"
  },
  {
    name: "Digital Marketing Agency",
    description: "Full-service marketing agency with 20+ clients and proven track record of growth.",
    location: "Austin, TX",
    industry: "Marketing",
    askingPrice: 420000,
    annualRevenue: 680000,
    cashFlow: 145000,
    ebitda: 125000,
    employees: 8,
    yearEstablished: 2019,
    sourceUrl: "https://demo.example.com/digital-marketing",
    sourceSite: "Demo Business Portal"
  },
  {
    name: "Fitness Studio Network",
    description: "Two boutique fitness studios with membership model and personal training services.",
    location: "Los Angeles, CA",
    industry: "Health & Fitness", 
    askingPrice: 320000,
    annualRevenue: 450000,
    cashFlow: 95000,
    ebitda: 85000,
    employees: 6,
    yearEstablished: 2020,
    sourceUrl: "https://demo.example.com/fitness-studio",
    sourceSite: "Demo Business Portal"
  },
  {
    name: "Manufacturing Solutions Inc",
    description: "B2B manufacturing company with established contracts and steady growth trajectory.",
    location: "Chicago, IL",
    industry: "Manufacturing",
    askingPrice: 1200000,
    annualRevenue: 1800000,
    cashFlow: 440000,
    ebitda: 390000,
    employees: 18,
    yearEstablished: 2015,
    sourceUrl: "https://demo.example.com/manufacturing",
    sourceSite: "Demo Business Portal"
  },
  {
    name: "E-commerce Beauty Brand",
    description: "Direct-to-consumer beauty products with strong online presence and subscription model.",
    location: "Miami, FL",
    industry: "E-commerce",
    askingPrice: 780000,
    annualRevenue: 950000,
    cashFlow: 235000,
    ebitda: 210000,
    employees: 9,
    yearEstablished: 2017,
    sourceUrl: "https://demo.example.com/beauty-brand",
    sourceSite: "Demo Business Portal"
  }
];

export function generateMoreDemoBusinesses(count: number = 50) {
  const industries = ["Technology", "Food & Beverage", "Retail", "Healthcare", "Manufacturing", "E-commerce", "Consulting", "Real Estate"];
  const cities = ["New York, NY", "San Francisco, CA", "Los Angeles, CA", "Chicago, IL", "Austin, TX", "Seattle, WA", "Boston, MA", "Miami, FL"];
  const businessTypes = ["Solutions", "Services", "Corp", "Group", "Company", "Enterprises", "Studio", "Agency", "Partners"];
  
  const generatedBusinesses = [];
  
  for (let i = 0; i < count; i++) {
    const industry = industries[i % industries.length];
    const city = cities[i % cities.length];
    const type = businessTypes[i % businessTypes.length];
    const namePrefix = `${industry.split(' ')[0]} ${type}`;
    
    // Generate realistic but varied financial data
    const revenue = 300000 + (i * 15000) + Math.floor(Math.random() * 200000);
    const askingPrice = Math.floor(revenue * (0.6 + Math.random() * 0.4));
    const cashFlow = Math.floor(revenue * (0.15 + Math.random() * 0.1));
    const ebitda = Math.floor(cashFlow * 0.85);
    const employees = 3 + Math.floor(i / 8) + Math.floor(Math.random() * 5);
    const yearEst = 2015 + (i % 8);
    
    generatedBusinesses.push({
      name: `${namePrefix} ${String.fromCharCode(65 + (i % 26))}`,
      description: `Established ${industry.toLowerCase()} business with strong fundamentals and growth potential. Proven track record in the ${city.split(',')[0]} market.`,
      location: city,
      industry,
      askingPrice,
      annualRevenue: revenue,
      cashFlow,
      ebitda,
      employees,
      yearEstablished: yearEst,
      sourceUrl: `https://demo.example.com/business-${i + 1}`,
      sourceSite: "Demo Business Portal"
    });
  }
  
  return [...demoBusinessListings, ...generatedBusinesses];
}