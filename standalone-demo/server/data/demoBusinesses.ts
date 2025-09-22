// Comprehensive demo business data - no external dependencies required
import { Business } from "../../shared/schema.js";

// Core demo business listings with realistic data
export const coreDemoBusinesses = [
  {
    id: "demo-tech-1",
    name: "CloudSync Solutions",
    description: "Established SaaS company providing cloud synchronization services to 500+ enterprise clients with 95% customer retention rate.",
    location: "New York, NY",
    industry: "Technology",
    askingPrice: 1200000,
    annualRevenue: 1800000,
    cashFlow: 450000,
    ebitda: 420000,
    employees: 18,
    yearEstablished: 2019,
    sourceUrl: "https://demo.example.com/cloudsync-solutions",
    sourceSite: "Demo Business Portal",
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  },
  {
    id: "demo-food-1",
    name: "Brooklyn Artisan Coffee",
    description: "Profitable 4-location specialty coffee chain with established brand recognition and loyal customer base in Brooklyn area.",
    location: "New York, NY",
    industry: "Food & Beverage",
    askingPrice: 850000,
    annualRevenue: 1250000,
    cashFlow: 285000,
    ebitda: 260000,
    employees: 32,
    yearEstablished: 2017,
    sourceUrl: "https://demo.example.com/brooklyn-artisan-coffee",
    sourceSite: "Demo Business Portal",
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  },
  {
    id: "demo-health-1",
    name: "SF Wellness Centers",
    description: "Chain of 3 premium wellness centers offering yoga, massage therapy, and holistic health services with membership model.",
    location: "San Francisco, CA",
    industry: "Health & Fitness",
    askingPrice: 680000,
    annualRevenue: 920000,
    cashFlow: 195000,
    ebitda: 175000,
    employees: 24,
    yearEstablished: 2018,
    sourceUrl: "https://demo.example.com/sf-wellness-centers",
    sourceSite: "Demo Business Portal",
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  },
  {
    id: "demo-retail-1",
    name: "Modern Home Furnishings",
    description: "Upscale furniture retail store with online presence and interior design services. Strong brand recognition in LA market.",
    location: "Los Angeles, CA",
    industry: "Retail",
    askingPrice: 720000,
    annualRevenue: 1100000,
    cashFlow: 220000,
    ebitda: 195000,
    employees: 14,
    yearEstablished: 2016,
    sourceUrl: "https://demo.example.com/modern-home-furnishings",
    sourceSite: "Demo Business Portal",
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  },
  {
    id: "demo-manufacturing-1",
    name: "Precision Parts Manufacturing",
    description: "B2B manufacturing company specializing in precision metal components for aerospace and automotive industries.",
    location: "Chicago, IL",
    industry: "Manufacturing",
    askingPrice: 1800000,
    annualRevenue: 2400000,
    cashFlow: 580000,
    ebitda: 520000,
    employees: 45,
    yearEstablished: 2014,
    sourceUrl: "https://demo.example.com/precision-parts-manufacturing",
    sourceSite: "Demo Business Portal",
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  },
  {
    id: "demo-ecommerce-1",
    name: "EcoHome Products",
    description: "Direct-to-consumer e-commerce brand selling sustainable home products with strong social media presence and subscription model.",
    location: "Austin, TX",
    industry: "E-commerce",
    askingPrice: 950000,
    annualRevenue: 1350000,
    cashFlow: 315000,
    ebitda: 285000,
    employees: 16,
    yearEstablished: 2019,
    sourceUrl: "https://demo.example.com/ecohome-products",
    sourceSite: "Demo Business Portal",
    createdAt: new Date(),
    updatedAt: new Date(),
    sellerInfo: null,
    businessDetails: null,
    isActive: true
  }
];

// Generate additional realistic businesses across multiple industries and locations
export function generateAdditionalBusinesses(): Business[] {
  const industries = [
    "Technology", "Food & Beverage", "Health & Fitness", "Retail", "Manufacturing", 
    "E-commerce", "Consulting", "Real Estate", "Education", "Transportation",
    "Healthcare", "Professional Services", "Entertainment", "Agriculture", "Construction"
  ];
  
  const cities = [
    "New York, NY", "San Francisco, CA", "Los Angeles, CA", "Chicago, IL", 
    "Austin, TX", "Seattle, WA", "Boston, MA", "Miami, FL", "Denver, CO",
    "Atlanta, GA", "Portland, OR", "Houston, TX", "Philadelphia, PA", "Phoenix, AZ"
  ];
  
  const businessNamePrefixes = [
    "Metro", "Elite", "Prime", "Summit", "Apex", "Innovative", "Strategic", "Dynamic",
    "Premier", "Advanced", "Global", "Digital", "Smart", "Progressive", "Integrated"
  ];
  
  const businessNameSuffixes = [
    "Solutions", "Services", "Group", "Corp", "Enterprises", "Systems", "Partners",
    "Consulting", "Technologies", "Ventures", "Industries", "Company", "Associates"
  ];
  
  const generatedBusinesses: Business[] = [];
  
  for (let i = 0; i < 44; i++) { // Generate 44 more for total of 50
    const industry = industries[i % industries.length];
    const city = cities[i % cities.length];
    const prefix = businessNamePrefixes[i % businessNamePrefixes.length];
    const suffix = businessNameSuffixes[i % businessNameSuffixes.length];
    
    // Generate realistic but varied financial data
    const revenue = 400000 + (i * 25000) + Math.floor(Math.random() * 300000);
    const askingPrice = Math.floor(revenue * (0.5 + Math.random() * 0.8));
    const cashFlow = Math.floor(revenue * (0.12 + Math.random() * 0.15));
    const ebitda = Math.floor(cashFlow * (0.8 + Math.random() * 0.15));
    const employees = Math.max(3, Math.floor(revenue / 65000) + Math.floor(Math.random() * 8));
    const yearEst = 2014 + (i % 9);
    
    // Create realistic business descriptions
    const descriptions = {
      "Technology": "Software development and IT consulting company with established client base and recurring revenue streams.",
      "Food & Beverage": "Established restaurant/food service business with strong local reputation and growth potential.",
      "Health & Fitness": "Fitness and wellness center with loyal membership base and diverse service offerings.",
      "Retail": "Retail business with strong brand recognition and both physical and online presence.",
      "Manufacturing": "Manufacturing company with established supply chains and long-term contracts.",
      "E-commerce": "Online retail business with strong digital marketing presence and customer acquisition systems.",
      "Consulting": "Professional consulting firm with established client relationships and proven methodologies.",
      "Real Estate": "Real estate services company with local market expertise and established agent network.",
      "Education": "Educational services provider with proven curriculum and strong student outcomes.",
      "Transportation": "Transportation and logistics company with established routes and fleet management.",
      "Healthcare": "Healthcare services provider with certified staff and established patient base.",
      "Professional Services": "Professional services firm offering specialized expertise to business clients.",
      "Entertainment": "Entertainment and event services company with established vendor relationships.",
      "Agriculture": "Agricultural business with sustainable farming practices and distribution networks.",
      "Construction": "Construction company with experienced crew and established contractor relationships."
    };
    
    generatedBusinesses.push({
      id: `demo-gen-${i + 1}`,
      name: `${prefix} ${suffix}`,
      description: descriptions[industry as keyof typeof descriptions] || "Established business with strong fundamentals and growth potential.",
      location: city,
      industry,
      askingPrice,
      annualRevenue: revenue,
      cashFlow,
      ebitda,
      employees,
      yearEstablished: yearEst,
      sourceUrl: `https://demo.example.com/business-${i + 7}`,
      sourceSite: "Demo Business Portal",
      createdAt: new Date(),
      updatedAt: new Date(),
      sellerInfo: null,
      businessDetails: null,
      isActive: true
    });
  }
  
  return generatedBusinesses;
}

// Combine all demo businesses
export function getAllDemoBusinesses(): Business[] {
  return [...coreDemoBusinesses, ...generateAdditionalBusinesses()];
}

// Demo user data for simplified authentication
export const demoUser = {
  id: 'demo-user-1',
  username: 'demo_investor',
  email: 'demo@bizsearch.com',
  preferences: {
    budgetRange: { min: 500000, max: 1500000 },
    preferredIndustries: ['Technology', 'E-commerce', 'Health & Fitness'],
    preferredLocations: ['New York, NY', 'San Francisco, CA', 'Austin, TX'],
    businessSize: 'medium',
    riskTolerance: 'moderate',
    involvementLevel: 'hands-off'
  }
};

// Search history for demo
export const demoSearchHistory = [
  {
    id: 'search-1',
    query: 'Technology businesses in New York',
    filters: { industry: 'Technology', location: 'New York, NY' },
    resultsCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
  },
  {
    id: 'search-2', 
    query: 'E-commerce businesses under $1M',
    filters: { industry: 'E-commerce', maxPrice: 1000000 },
    resultsCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
  },
  {
    id: 'search-3',
    query: 'Health & Fitness businesses in California', 
    filters: { industry: 'Health & Fitness', location: 'California' },
    resultsCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 7) // 1 week ago
  }
];