// Mock AI scoring for demo purposes - no OpenAI API required
export function generateMockCompatibilityScore(business: any, userPreferences: any): {
  compatibilityScore: number;
  rankingExplanation: string;
} {
  // Generate deterministic but realistic scores based on business data
  const hash = business.name.length + business.industry.length + (business.askingPrice || 0);
  const baseScore = 65 + ((hash % 30) + 5); // Scores between 70-99
  
  const factors = [];
  
  // Industry match simulation
  if (userPreferences?.preferredIndustries?.includes(business.industry)) {
    factors.push(`Strong industry match (${business.industry})`);
  }
  
  // Location match simulation  
  if (userPreferences?.preferredLocations?.includes(business.location)) {
    factors.push(`Preferred location (${business.location})`);
  }
  
  // Price range simulation
  if (business.askingPrice && userPreferences?.budgetRange) {
    factors.push('Within your budget range');
  }
  
  // Size match simulation
  if (business.employees && userPreferences?.businessSize) {
    factors.push(`${userPreferences.businessSize} business size match`);
  }
  
  const explanation = factors.length > 0 
    ? `This business scores ${baseScore}/100 based on: ${factors.join(', ')}. Demo AI analysis shows good alignment with your investment criteria.`
    : `This business scores ${baseScore}/100. Demo AI analysis indicates moderate compatibility with your preferences.`;
  
  return {
    compatibilityScore: baseScore,
    rankingExplanation: explanation
  };
}