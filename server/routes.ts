import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { businessRankingService } from "./services/businessRanking";
import { webBusinessScraperService } from "./services/webBusinessScraper";
import { AuthUtils } from "./auth";
import { 
  insertUserPreferencesSchema, 
  insertBusinessSchema, 
  insertSearchHistorySchema,
  insertUserSchema,
  type Business
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      const user = await storage.createUser(validatedData);
      
      // Store user ID in session
      (req as any).session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      
      // Demo mode: accept any credentials and auto-create user if needed
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Auto-create user for demo purposes
        const demoUsername = email.split('@')[0] || 'demouser';
        const hashedPassword = await AuthUtils.hashPassword(password);
        
        user = await storage.createUser({
          username: demoUsername,
          email: email,
          password: hashedPassword
        });
      }
      
      // Store user ID in session
      (req as any).session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.post("/api/auth/logout", async (req, res) => {
    try {
      (req as any).session.destroy();
      res.json({ success: true });
    } catch (error) {
      console.error("Error logging out user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // User preferences endpoints
  app.get("/api/user/preferences", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const preferences = await storage.getUserPreferences(userId);
      res.json({ preferences });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/user/preferences", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.createUserPreferences({ 
        ...validatedData, 
        userId 
      });
      
      // Refresh rankings when preferences change
      businessRankingService.refreshUserRankings(userId).catch(console.error);
      
      res.json({ preferences });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/user/preferences", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const validatedData = insertUserPreferencesSchema.partial().parse(req.body);
      const preferences = await storage.updateUserPreferences(userId, validatedData);
      
      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      // Refresh rankings when preferences change
      businessRankingService.refreshUserRankings(userId).catch(console.error);
      
      res.json({ preferences });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Business search and listing endpoints
  app.get("/api/businesses", async (req, res) => {
    try {
      const filters = {
        priceRange: req.query.priceRange ? JSON.parse(req.query.priceRange as string) : undefined,
        revenueRange: req.query.revenueRange ? JSON.parse(req.query.revenueRange as string) : undefined,
        location: req.query.location as string,
        industries: req.query.industries ? JSON.parse(req.query.industries as string) : undefined,
        employees: req.query.employees as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const businesses = await storage.getBusinesses(filters);
      res.json({ businesses, count: businesses.length });
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/businesses/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ error: "Search query must be at least 2 characters" });
      }

      const businesses = await storage.searchBusinesses(query.trim());
      
      // Log search history if user is authenticated
      const userId = (req as any).session?.userId;
      if (userId) {
        storage.createSearchHistory({
          userId,
          query: query.trim(),
          resultsCount: businesses.length,
          filters: {
            // Include any filters from query params
            priceRange: req.query.priceRange ? JSON.parse(req.query.priceRange as string) : undefined,
            revenueRange: req.query.revenueRange ? JSON.parse(req.query.revenueRange as string) : undefined,
            location: req.query.location as string,
            industry: req.query.industries ? JSON.parse(req.query.industries as string) : undefined,
          }
        }).catch(console.error);
      }

      res.json({ businesses, query, count: businesses.length });
    } catch (error) {
      console.error("Error searching businesses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI-powered ranking endpoints (must come before parameterized routes)
  app.get("/api/businesses/ranked", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const rankedBusinesses = await businessRankingService.getTopRankedBusinesses(userId, limit);
      
      res.json({ 
        businesses: rankedBusinesses,
        count: rankedBusinesses.length 
      });
    } catch (error) {
      console.error("Error fetching ranked businesses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Web scraping endpoint for live business listings
  app.get("/api/businesses/web-search", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required for web search" });
      }
      
      // Get user preferences for authenticated user
      const userPrefs = await storage.getUserPreferences(userId);
      const preferences = userPrefs || undefined;

      // Extract filter parameters from query
      const filterParams = {
        priceRange: req.query.priceRange ? JSON.parse(req.query.priceRange as string) : undefined,
        revenueRange: req.query.revenueRange ? JSON.parse(req.query.revenueRange as string) : undefined,
        location: req.query.location as string || undefined,
        industries: req.query.industries ? JSON.parse(req.query.industries as string) : undefined,
        riskTolerance: req.query.riskTolerance as string || undefined,
        involvement: req.query.involvement as string || undefined,
        employees: req.query.employees as string || undefined
      };

      // Merge user preferences with filter overrides
      // Handle empty string location as explicit "no location filter" 
      const validFilterParams = Object.fromEntries(
        Object.entries(filterParams).filter(([key, value]) => {
          // For location, empty string means "Any Location" - this should override user preference
          if (key === 'location') {
            return value !== undefined; // Include empty string for location
          }
          // For other fields, filter out undefined, 'any', and empty arrays
          return value !== undefined && value !== 'any' && (Array.isArray(value) ? value.length > 0 : true);
        })
      );

      const searchPreferences = preferences ? {
        ...preferences,
        ...validFilterParams
      } : validFilterParams;

      console.log("Starting web search for business listings with filters...", searchPreferences);
      const searchResult = await webBusinessScraperService.searchBusinessListings(searchPreferences);
      
      // Debug: Log the cities returned by the search
      if (searchResult.businesses && searchResult.businesses.length > 0) {
        const cityCounts = searchResult.businesses.slice(0, 15).reduce((acc: Record<string, number>, business) => {
          const city = business.location.split(',')[0];
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {});
        console.log("API Response - First 15 business cities:", cityCounts);
      }
      
      res.json({
        businesses: searchResult.businesses,
        totalFound: searchResult.totalFound,
        searchSummary: searchResult.searchSummary,
        source: "web-scraping"
      });
    } catch (error) {
      console.error("Error in web business search:", error);
      res.status(500).json({ error: "Failed to search web sources for businesses" });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const businessId = req.params.id;
      const business = await storage.getBusiness(businessId);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      // Include score if user is authenticated
      let score = null;
      const userId = (req as any).session?.userId;
      if (userId) {
        score = await storage.getBusinessScore(userId, businessId);
      }

      res.json({ business, score });
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/businesses/:id/rank", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const businessId = req.params.id;
      const business = await storage.getBusiness(businessId);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      const preferences = await storage.getUserPreferences(userId);
      if (!preferences) {
        return res.status(400).json({ error: "User preferences required for ranking" });
      }

      const ranking = await businessRankingService.rankBusiness(business, preferences);
      
      const score = await storage.createBusinessScore({
        userId,
        businessId,
        score: ranking.score,
        reasoning: ranking.reasoning,
        factors: ranking.factors
      });

      res.json({ score, ranking });
    } catch (error) {
      console.error("Error ranking business:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/businesses/rank-batch", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { businessIds } = req.body;
      if (!Array.isArray(businessIds) || businessIds.length === 0) {
        return res.status(400).json({ error: "Business IDs array required" });
      }

      const businesses: Business[] = [];
      for (const id of businessIds) {
        const business = await storage.getBusiness(id);
        if (business) businesses.push(business);
      }

      const rankings = await businessRankingService.rankMultipleBusinesses(businesses, userId);
      
      res.json({ 
        rankings,
        count: rankings.length 
      });
    } catch (error) {
      console.error("Error batch ranking businesses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search history endpoints
  app.get("/api/user/search-history", async (req, res) => {
    try {
      const userId = (req as any).session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const history = await storage.getUserSearchHistory(userId, limit);
      
      res.json({ history, count: history.length });
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin endpoints for adding sample data (development only)
  if (process.env.NODE_ENV === "development") {
    app.post("/api/admin/businesses", async (req, res) => {
      try {
        const validatedData = insertBusinessSchema.parse(req.body);
        const business = await storage.createBusiness(validatedData);
        res.json({ business });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: "Invalid data", details: error.errors });
        }
        console.error("Error creating business:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/api/admin/businesses/seed", async (req, res) => {
      try {
        const sampleBusinesses = [
          {
            name: "Mountain View Coffee Roasters",
            description: "Established specialty coffee roastery with loyal customer base and multiple revenue streams including wholesale, retail, and online sales.",
            location: "Denver, Colorado",
            industry: "Food & Beverage",
            askingPrice: 450000,
            annualRevenue: 380000,
            cashFlow: 95000,
            ebitda: 110000,
            employees: 8,
            yearEstablished: 2018,
            sourceUrl: "https://example.com/listing1",
            sourceSite: "BizBuySell",
            sellerInfo: {
              contactEmail: "seller@example.com",
              brokerInfo: "Mountain Business Brokers"
            },
            businessDetails: {
              ownerRole: "Owner/Operator",
              reasonForSelling: "Retirement",
              trainingProvided: "4 weeks included",
              realEstateIncluded: false,
              assets: ["Equipment", "Inventory", "Customer Lists"]
            }
          },
          {
            name: "TechFix IT Services",
            description: "Growing IT support and managed services company serving small to medium businesses in the metropolitan area.",
            location: "Austin, Texas",
            industry: "Technology",
            askingPrice: 680000,
            annualRevenue: 520000,
            cashFlow: 145000,
            ebitda: 160000,
            employees: 12,
            yearEstablished: 2019,
            sourceUrl: "https://example.com/listing2",
            sourceSite: "BizQuest",
            sellerInfo: {
              contactEmail: "owner@techfix.com",
              contactPhone: "(555) 123-4567"
            },
            businessDetails: {
              ownerRole: "CEO",
              reasonForSelling: "New Venture",
              trainingProvided: "6 weeks included",
              realEstateIncluded: false,
              assets: ["Equipment", "Client Contracts", "Software Licenses"]
            }
          },
          {
            name: "Sunshine Cleaning Solutions",
            description: "Well-established commercial cleaning company with recurring contracts and strong reputation in healthcare and office sectors.",
            location: "Phoenix, Arizona",
            industry: "Services",
            askingPrice: 295000,
            annualRevenue: 280000,
            cashFlow: 78000,
            ebitda: 85000,
            employees: 15,
            yearEstablished: 2016,
            sourceUrl: "https://example.com/listing3",
            sourceSite: "BusinessesForSale",
            sellerInfo: {
              contactEmail: "info@sunshinecleaning.com",
              brokerInfo: "Southwest Business Advisors"
            },
            businessDetails: {
              ownerRole: "Owner/Manager",
              reasonForSelling: "Health Issues",
              trainingProvided: "3 weeks included",
              realEstateIncluded: false,
              assets: ["Equipment", "Vehicles", "Client Contracts"]
            }
          }
        ];

        const createdBusinesses = [];
        for (const businessData of sampleBusinesses) {
          const business = await storage.createBusiness(businessData);
          createdBusinesses.push(business);
        }

        res.json({ 
          message: "Sample businesses created successfully",
          businesses: createdBusinesses,
          count: createdBusinesses.length
        });
      } catch (error) {
        console.error("Error seeding businesses:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
