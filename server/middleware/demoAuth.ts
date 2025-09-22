// Simple demo authentication - no passwords or complex sessions
export const demoUser = {
  id: 'demo-user-1',
  username: 'demo_investor',
  email: 'demo@example.com',
  preferences: {
    budgetRange: { min: 500000, max: 1500000 },
    preferredIndustries: ['Technology', 'E-commerce', 'Healthcare'],
    preferredLocations: ['New York, NY', 'San Francisco, CA'],
    businessSize: 'medium',
    riskTolerance: 'moderate',
    involvementLevel: 'hands-off'
  }
};

export function createDemoAuthMiddleware() {
  return (req: any, res: any, next: any) => {
    // Auto-login for demo - always authenticated as demo user
    req.user = demoUser;
    req.session = { userId: demoUser.id };
    next();
  };
}