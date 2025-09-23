// Mock AI scoring service - no OpenAI API required
import { Business, UserPreferences, BusinessScore } from "../../shared/schema.js";

export function generateMockCompatibilityScore(
  business: Business, 
  userPreferences: UserPreferences
): { 
  compatibilityScore: number; 
  rankingExplanation: string; 
} {
  let score = 50; // Lower base score for more differentiation
  const factors: string[] = [];
  let industryMatch = false;
  
  // Industry match (major factor - up to +25 points)
  if (userPreferences.preferredIndustries.includes(business.industry)) {
    score += 25;
    industryMatch = true;
    factors.push(`Strong industry match (${business.industry})`);
  } else {
    score += 8; // Reduced bonus for non-preferred industries
    factors.push(`Industry alignment potential`);
  }
  
  // Location match (up to +15 points, reduced for non-industry matches)
  const businessState = business.location.split(', ')[1];
  const hasLocationMatch = userPreferences.preferredLocations.some(loc => 
    loc.includes(businessState) || business.location === loc
  );
  if (hasLocationMatch) {
    const locationBonus = industryMatch ? 15 : 8; // Less bonus if industry doesn't match
    score += locationBonus;
    factors.push(`Preferred location (${business.location})`);
  } else {
    const locationPenalty = industryMatch ? 3 : 1; // Minimal bonus if neither industry nor location match
    score += locationPenalty;
    factors.push(`Market expansion opportunity`);
  }
  
  // Budget alignment (up to +15 points, reduced for non-industry matches)
  const { min, max } = userPreferences.budgetRange;
  if (business.askingPrice >= min && business.askingPrice <= max) {
    const budgetBonus = industryMatch ? 15 : 8; // Reduced if industry doesn't match
    score += budgetBonus;
    factors.push(`Within your budget range ($${(min/1000).toFixed(0)}K-$${(max/1000).toFixed(0)}K)`);
  } else if (business.askingPrice < min) {
    const belowBudgetBonus = industryMatch ? 10 : 5;
    score += belowBudgetBonus;
    factors.push(`Below budget - potential value opportunity`);
  } else {
    const aboveBudgetBonus = industryMatch ? 5 : 2;
    score += aboveBudgetBonus;
    factors.push(`Above budget but strong fundamentals`);
  }
  
  // Business size assessment (up to +10 points)
  let sizeMatch = false;
  if (userPreferences.businessSize === 'small' && business.employees <= 10) {
    sizeMatch = true;
  } else if (userPreferences.businessSize === 'medium' && business.employees > 10 && business.employees <= 50) {
    sizeMatch = true;
  } else if (userPreferences.businessSize === 'large' && business.employees > 50) {
    sizeMatch = true;
  }
  
  if (sizeMatch) {
    const sizeBonus = industryMatch ? 10 : 5; // Reduced bonus for non-preferred industries
    score += sizeBonus;
    factors.push(`${userPreferences.businessSize} business size preference match`);
  } else {
    const sizePenalty = industryMatch ? 4 : 2;
    score += sizePenalty;
    factors.push(`Business size offers learning opportunities`);
  }
  
  // Financial health indicators (up to +10 points)
  const revenueMultiple = business.askingPrice / business.annualRevenue;
  const cashFlowMargin = business.cashFlow / business.annualRevenue;
  
  if (revenueMultiple < 1.5 && cashFlowMargin > 0.2) {
    const financialBonus = industryMatch ? 10 : 5;
    score += financialBonus;
    factors.push(`Strong financial metrics and valuation`);
  } else if (revenueMultiple < 2.0 && cashFlowMargin > 0.15) {
    const financialBonus = industryMatch ? 7 : 4;
    score += financialBonus;
    factors.push(`Good financial health indicators`);
  } else {
    const financialBonus = industryMatch ? 4 : 2;
    score += financialBonus;
    factors.push(`Adequate financial foundation`);
  }
  
  // Risk tolerance alignment (up to +5 points)
  const businessAge = new Date().getFullYear() - business.yearEstablished;
  if (userPreferences.riskTolerance === 'conservative' && businessAge >= 5) {
    score += 4;
    factors.push(`Established business aligns with conservative risk preference`);
  } else if (userPreferences.riskTolerance === 'moderate' && businessAge >= 3) {
    score += 4;
    factors.push(`Business maturity suits moderate risk tolerance`);
  } else if (userPreferences.riskTolerance === 'aggressive') {
    score += 4;
    factors.push(`Growth potential matches aggressive investment approach`);
  } else {
    score += 2;
    factors.push(`Business profile suitable for portfolio diversification`);
  }
  
  // Involvement level considerations (up to +5 points)
  if (userPreferences.involvementLevel === 'hands-off' && business.employees >= 10) {
    score += 4;
    factors.push(`Established team supports hands-off management approach`);
  } else if (userPreferences.involvementLevel === 'hands-on' && business.employees <= 20) {
    score += 4;
    factors.push(`Business size suitable for hands-on involvement`);
  } else {
    score += 2;
    factors.push(`Management structure adaptable to your involvement preference`);
  }
  
  // Add some deterministic variance based on business name for realism
  const nameHash = business.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variance = (nameHash % 6) - 3; // -3 to +3 points
  score += variance;
  
  // Ensure score stays within realistic bounds
  score = Math.max(68, Math.min(98, score));
  
  const explanation = `This business scores ${score}/100 for compatibility with your investment criteria. Key factors: ${factors.slice(0, 4).join(', ')}. ${
    score >= 85 ? 'Excellent match with strong alignment across multiple criteria.' :
    score >= 75 ? 'Good compatibility with your investment preferences.' :
    'Moderate fit that could offer portfolio diversification benefits.'
  }`;
  
  return {
    compatibilityScore: score,
    rankingExplanation: explanation
  };
}

export function batchScoreBusinesses(
  businesses: Business[], 
  userPreferences: UserPreferences
): Business[] {
  return businesses.map(business => {
    const { compatibilityScore } = generateMockCompatibilityScore(business, userPreferences);
    return {
      ...business,
      aiScore: compatibilityScore
    };
  });
}

export function createBusinessScore(
  business: Business,
  userPreferences: UserPreferences
): BusinessScore {
  const { compatibilityScore, rankingExplanation } = generateMockCompatibilityScore(business, userPreferences);
  
  // Calculate individual factor scores (0-100) to match UI expectations
  const industryMatch = userPreferences.preferredIndustries.includes(business.industry);
  const locationMatch = userPreferences.preferredLocations.some(loc => business.location.includes(loc));
  const budgetInRange = business.askingPrice >= userPreferences.budgetRange.min && 
                        business.askingPrice <= userPreferences.budgetRange.max;
  const financialHealthRatio = business.cashFlow / business.annualRevenue;
  const businessAge = new Date().getFullYear() - business.yearEstablished;
  
  return {
    score: compatibilityScore,
    reasoning: rankingExplanation,
    factors: {
      // Map to UI expected properties with 0-100 scores
      industryFit: industryMatch ? 95 : 65,
      priceMatch: budgetInRange ? 90 : (business.askingPrice < userPreferences.budgetRange.min ? 75 : 55),
      locationScore: locationMatch ? 88 : 60,
      riskAlignment: businessAge >= 5 ? 85 : (businessAge >= 3 ? 75 : 65),
      involvementFit: userPreferences.involvementLevel === 'hands-off' && business.employees >= 10 ? 90 : 
                      userPreferences.involvementLevel === 'hands-on' && business.employees <= 20 ? 85 : 70
    }
  };
}