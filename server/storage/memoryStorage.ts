// In-memory storage for demo - no database required
import { Business, BusinessScore, User, UserPreferences } from "../../shared/schema.js";
import { getAllDemoBusinesses, demoUser, demoSearchHistory } from "../data/demoBusinesses.js";
import { createBusinessScore, batchScoreBusinesses } from "../services/mockAIScoring.js";

export class DemoMemoryStorage {
  private businesses: Business[] = [];
  private businessScores: Map<string, BusinessScore> = new Map();
  private users: Map<string, User> = new Map();
  private searchHistory: any[] = [];

  constructor() {
    // Initialize with demo data
    this.businesses = getAllDemoBusinesses();
    this.users.set(demoUser.id, demoUser);
    this.searchHistory = [...demoSearchHistory];
    
    // Pre-generate scores for all businesses
    this.preGenerateScores();
  }

  private preGenerateScores() {
    if (demoUser.preferences) {
      this.businesses.forEach(business => {
        const score = createBusinessScore(business, demoUser.preferences!);
        this.businessScores.set(business.id, score);
      });
    }
  }

  // Business operations
  async getAllBusinesses(): Promise<Business[]> {
    return [...this.businesses];
  }

  async getBusinessById(id: string): Promise<Business | null> {
    return this.businesses.find(b => b.id === id) || null;
  }

  async searchBusinesses(filters: any = {}): Promise<{ businesses: Business[]; totalFound: number }> {
    let filtered = [...this.businesses];

    // Apply text search query
    if (filters.query && filters.query.trim()) {
      const query = filters.query.toLowerCase().trim();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.industry.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.industry) {
      filtered = filtered.filter(b => 
        b.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(b => 
        b.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(b => b.askingPrice >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(b => b.askingPrice <= parseInt(filters.maxPrice));
    }

    if (filters.minRevenue) {
      filtered = filtered.filter(b => b.annualRevenue >= parseInt(filters.minRevenue));
    }

    if (filters.maxRevenue) {
      filtered = filtered.filter(b => b.annualRevenue <= parseInt(filters.maxRevenue));
    }

    if (filters.minEmployees) {
      filtered = filtered.filter(b => b.employees >= parseInt(filters.minEmployees));
    }

    if (filters.maxEmployees) {
      filtered = filtered.filter(b => b.employees <= parseInt(filters.maxEmployees));
    }

    if (filters.yearEstablished) {
      filtered = filtered.filter(b => b.yearEstablished >= parseInt(filters.yearEstablished));
    }

    // Add AI scores and sort by compatibility
    if (demoUser.preferences) {
      filtered = batchScoreBusinesses(filtered, demoUser.preferences);
      filtered.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
    }

    return {
      businesses: filtered,
      totalFound: filtered.length
    };
  }

  // User operations
  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.preferences = preferences;
      // Regenerate scores with new preferences
      this.businesses.forEach(business => {
        const score = createBusinessScore(business, preferences);
        this.businessScores.set(business.id, score);
      });
    }
  }

  // Business scoring
  async getBusinessScore(businessId: string): Promise<BusinessScore | null> {
    return this.businessScores.get(businessId) || null;
  }

  async rankBusiness(businessId: string): Promise<{ score: BusinessScore; business: Business } | null> {
    const business = await this.getBusinessById(businessId);
    const score = this.businessScores.get(businessId);
    
    if (business && score) {
      return { business, score };
    }
    
    return null;
  }

  async rankMultipleBusinesses(businessIds: string[]): Promise<{ business: Business; score: BusinessScore }[]> {
    const results = [];
    
    for (const id of businessIds) {
      const result = await this.rankBusiness(id);
      if (result) {
        results.push(result);
      }
    }
    
    // Sort by score descending
    results.sort((a, b) => b.score.score - a.score.score);
    
    return results;
  }

  // Search history
  async getSearchHistory(userId: string): Promise<any[]> {
    return [...this.searchHistory];
  }

  async addSearchHistory(userId: string, searchData: any): Promise<void> {
    this.searchHistory.unshift({
      id: `search-${Date.now()}`,
      ...searchData,
      createdAt: new Date()
    });
    
    // Keep only last 10 searches
    if (this.searchHistory.length > 10) {
      this.searchHistory = this.searchHistory.slice(0, 10);
    }
  }

  // Web search simulation (returns filtered demo data)
  async simulateWebSearch(query: string = '', filters: any = {}): Promise<{
    businesses: any[];
    totalFound: number;
    searchSummary: string;
  }> {
    const { businesses, totalFound } = await this.searchBusinesses(filters);
    
    // Simulate some variation in results
    const shuffled = businesses.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(15, businesses.length));
    
    const searchSummary = `Found ${totalFound} businesses matching your criteria. Showing top ${selected.length} results with AI compatibility scoring.`;
    
    return {
      businesses: selected.map(business => ({
        ...business,
        ranking: Math.floor(Math.random() * 4) + 1, // For compatibility
        compatibilityScore: business.aiScore || 75,
        rankingExplanation: this.businessScores.get(business.id)?.reasoning || 'Mock AI analysis complete.'
      })),
      totalFound,
      searchSummary
    };
  }
}

// Singleton instance
export const demoStorage = new DemoMemoryStorage();