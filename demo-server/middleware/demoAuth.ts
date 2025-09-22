// Simplified demo authentication - no passwords or complex sessions required
import { Request, Response, NextFunction } from 'express';
import { demoUser } from '../data/demoBusinesses.js';

// Extended request interface for demo user
export interface DemoRequest extends Request {
  user?: typeof demoUser;
  session?: { userId: string };
}

// Simple demo authentication middleware
export function createDemoAuthMiddleware() {
  return (req: DemoRequest, res: Response, next: NextFunction) => {
    // Auto-login for demo - always authenticated as demo user
    req.user = demoUser;
    req.session = { userId: demoUser.id };
    next();
  };
}

// Mock session check - always returns authenticated state
export function requireAuth(req: DemoRequest, res: Response, next: NextFunction) {
  // In demo mode, user is always authenticated
  if (!req.user) {
    req.user = demoUser;
    req.session = { userId: demoUser.id };
  }
  next();
}

// Demo logout handler (just returns success)
export function handleLogout(req: DemoRequest, res: Response) {
  // In demo mode, just return success
  res.json({ success: true, message: 'Demo logout successful' });
}

// Demo login handler (auto-authenticates)
export function handleLogin(req: DemoRequest, res: Response) {
  // Auto-authenticate in demo mode
  req.user = demoUser;
  res.json({ 
    success: true, 
    user: demoUser,
    message: 'Demo login successful' 
  });
}

// Demo signup handler (auto-authenticates as demo user)
export function handleSignup(req: DemoRequest, res: Response) {
  // Auto-authenticate in demo mode
  req.user = demoUser;
  res.json({ 
    success: true, 
    user: demoUser,
    message: 'Demo account created successfully' 
  });
}