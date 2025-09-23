// Simplified routes for standalone demo application
import { type Express, type Request, type Response } from 'express';
import { demoStorage } from './storage/memoryStorage.js';
import { userPreferencesSchema } from '../shared/schema.js';

export function setupRoutes(app: Express): void {
  
  // Auto-login middleware - simplified demo authentication
  app.use((req: any, res, next) => {
    // Demo mode: auto-authenticate as demo user
    req.user = {
      id: 'demo-user-1',
      username: 'demo_investor',
      email: 'demo@example.com'
    };
    next();
  });

  // User routes
  app.get('/api/auth/me', (req: any, res: Response) => {
    res.json(req.user);
  });

  app.get('/api/user/preferences', async (req: any, res: Response) => {
    try {
      const user = await demoStorage.getUserById(req.user.id);
      res.json({ preferences: user?.preferences || null });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
  });

  // POST endpoint for creating user preferences
  app.post('/api/user/preferences', async (req: any, res: Response) => {
    try {
      const validatedPreferences = userPreferencesSchema.parse(req.body);
      await demoStorage.updateUserPreferences(req.user.id, validatedPreferences);
      // Return the saved preferences from storage
      const user = await demoStorage.getUserById(req.user.id);
      res.json({ preferences: user?.preferences || validatedPreferences });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Invalid preferences data' });
    }
  });

  app.put('/api/user/preferences', async (req: any, res: Response) => {
    try {
      const validatedPreferences = userPreferencesSchema.parse(req.body);
      await demoStorage.updateUserPreferences(req.user.id, validatedPreferences);
      // Return the saved preferences from storage
      const user = await demoStorage.getUserById(req.user.id);
      res.json({ preferences: user?.preferences || validatedPreferences });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Invalid preferences data' });
    }
  });

  // Business routes
  app.get('/api/businesses', async (req: Request, res: Response) => {
    try {
      const { businesses, totalFound } = await demoStorage.searchBusinesses(req.query);
      res.json({ businesses, total: totalFound });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  });

  app.get('/api/businesses/search', async (req: Request, res: Response) => {
    try {
      const { businesses, totalFound } = await demoStorage.searchBusinesses(req.query);
      res.json({ businesses, total: totalFound });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search businesses' });
    }
  });

  // Add the web-search endpoint that the frontend expects
  app.get('/api/businesses/web-search', async (req: Request, res: Response) => {
    try {
      const { businesses, totalFound } = await demoStorage.searchBusinesses(req.query);
      res.json({ 
        businesses, 
        totalFound, 
        searchSummary: `Found ${totalFound} businesses matching your criteria`,
        source: 'demo'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search businesses' });
    }
  });

  app.get('/api/businesses/:id', async (req: Request, res: Response) => {
    try {
      let businessId = req.params.id;
      
      // Handle web search business IDs by extracting original ID
      if (businessId.startsWith('web-')) {
        // Extract original business ID from web search format
        // web-https---demo-example-com-business-37 -> business-37 -> demo-gen-31
        const parts = businessId.split('-');
        if (parts.length >= 2) {
          const lastPart = parts[parts.length - 1];
          if (!isNaN(Number(lastPart))) {
            // Try to find business by index (business-37 means index 37 in generated businesses)
            const allBusinesses = await demoStorage.getAllBusinesses();
            const businessIndex = parseInt(lastPart) - 7; // Adjust for demo business numbering
            if (businessIndex >= 0 && businessIndex < allBusinesses.length) {
              businessId = allBusinesses[businessIndex].id;
            }
          }
        }
      }
      
      const business = await demoStorage.getBusinessById(businessId);
      const score = await demoStorage.getBusinessScore(businessId);
      
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      
      res.json({ business, score });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch business details' });
    }
  });

  // Business ranking routes
  app.post('/api/businesses/:id/rank', async (req: Request, res: Response) => {
    try {
      const result = await demoStorage.rankBusiness(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Business not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to rank business' });
    }
  });

  // Search history routes
  app.get('/api/search-history', async (req: any, res: Response) => {
    try {
      const history = await demoStorage.getSearchHistory(req.user.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch search history' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      mode: 'demo',
      version: '1.0.0-demo'
    });
  });

  // Demo info endpoint
  app.get('/api/demo/info', (req, res) => {
    res.json({
      message: 'BizSearch Simplified Demo',
      features: [
        'Auto-login as demo user',
        '50+ realistic business listings',
        'Mock AI compatibility scoring',
        'No external API dependencies',
        'Zero cost operation'
      ],
      user: 'demo_investor',
      businessCount: 50,
      aiScoring: 'Mock algorithm (deterministic)',
      dataSource: 'Static demo data'
    });
  });
}