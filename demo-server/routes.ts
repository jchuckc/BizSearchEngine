// Simplified routes for demo application - no external dependencies
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { createDemoAuthMiddleware, requireAuth, handleLogin, handleSignup, handleLogout, type DemoRequest } from './middleware/demoAuth.js';
import { demoStorage } from './storage/memoryStorage.js';
import { userPreferencesSchema } from '../demo-shared/schema.js';

export async function registerDemoRoutes(app: Express): Promise<Express> {
  // Apply demo auth middleware globally
  app.use(createDemoAuthMiddleware());

  // Authentication routes (simplified for demo)
  app.post('/api/auth/login', handleLogin);
  app.post('/api/auth/signup', handleSignup);
  app.post('/api/auth/logout', handleLogout);
  
  // User routes
  app.get('/api/user/me', requireAuth, async (req: Request, res: Response) => {
    const demoReq = req as DemoRequest;
    res.json(demoReq.user);
  });

  app.get('/api/user/preferences', requireAuth, async (req: Request, res: Response) => {
    try {
      const demoReq = req as DemoRequest;
      const user = await demoStorage.getUserById(demoReq.user?.id || 'demo-user-1');
      res.json(user?.preferences || null);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
  });

  app.put('/api/user/preferences', requireAuth, async (req: Request, res: Response) => {
    try {
      const demoReq = req as DemoRequest;
      const validatedPreferences = userPreferencesSchema.parse(req.body);
      await demoStorage.updateUserPreferences(demoReq.user?.id || 'demo-user-1', validatedPreferences);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Invalid preferences data' });
    }
  });

  // Business routes
  app.get('/api/businesses', requireAuth, async (req: Request, res: Response) => {
    try {
      const { businesses, totalFound } = await demoStorage.searchBusinesses(req.query);
      res.json({ businesses, total: totalFound });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  });

  app.get('/api/businesses/search', requireAuth, async (req: Request, res: Response) => {
    try {
      const { businesses, totalFound } = await demoStorage.searchBusinesses(req.query);
      res.json({ businesses, total: totalFound });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search businesses' });
    }
  });

  app.get('/api/businesses/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const business = await demoStorage.getBusinessById(req.params.id);
      const score = await demoStorage.getBusinessScore(req.params.id);
      
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      
      res.json({ business, score });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch business details' });
    }
  });

  // Business ranking routes
  app.post('/api/businesses/:id/rank', requireAuth, async (req: Request, res: Response) => {
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

  app.post('/api/businesses/rank-batch', requireAuth, async (req: Request, res: Response) => {
    try {
      const { businessIds } = req.body;
      if (!Array.isArray(businessIds)) {
        return res.status(400).json({ error: 'businessIds must be an array' });
      }
      
      const rankings = await demoStorage.rankMultipleBusinesses(businessIds);
      res.json({ rankings, count: rankings.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to rank businesses' });
    }
  });

  // Web search simulation (replaces real web scraping)
  app.post('/api/web-search', requireAuth, async (req: Request, res: Response) => {
    try {
      const { query = '', filters = {} } = req.body;
      
      // Add search to history
      const demoReq = req as DemoRequest;
      await demoStorage.addSearchHistory(demoReq.user?.id || 'demo-user-1', {
        query,
        filters,
        resultsCount: 0 // Will be updated below
      });
      
      const result = await demoStorage.simulateWebSearch(query, filters);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to perform web search' });
    }
  });

  // Search history routes
  app.get('/api/search-history', requireAuth, async (req: Request, res: Response) => {
    try {
      const demoReq = req as DemoRequest;
      const history = await demoStorage.getSearchHistory(demoReq.user?.id || 'demo-user-1');
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

  // Demo-specific endpoints
  app.get('/api/demo/info', (req, res) => {
    res.json({
      message: 'BizSearch Demo Mode',
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

  return app;
}