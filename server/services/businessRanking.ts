import { OpenAI } from "openai";
import { type Business, type UserPreferences, type BusinessScore, type InsertBusinessScore } from "@shared/schema";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RankingFactors {
  priceMatch: number;
  industryFit: number;
  riskAlignment: number;
  involvementFit: number;
  locationScore: number;
  financialHealth: number;
}

interface RankingResult {
  score: number;
  reasoning: string;
  factors: RankingFactors;
}

export class BusinessRankingService {
  /**
   * Calculate AI-powered compatibility score for a business based on user preferences
   */
  async rankBusiness(business: Business, preferences: UserPreferences): Promise<RankingResult> {
    try {
      const prompt = this.buildRankingPrompt(business, preferences);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert business acquisition advisor. Analyze business opportunities and provide compatibility scores based on investor preferences. Return ONLY a valid JSON response with the exact structure requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No response from OpenAI");
      }

      // Parse the JSON response
      const ranking: RankingResult = JSON.parse(result);
      
      // Validate score is within bounds
      ranking.score = Math.max(0, Math.min(100, ranking.score));
      
      return ranking;
    } catch (error) {
      console.error("Error ranking business:", error);
      // Fallback scoring
      return this.calculateFallbackScore(business, preferences);
    }
  }

  /**
   * Rank multiple businesses for a user
   */
  async rankMultipleBusinesses(
    businesses: Business[], 
    userId: string
  ): Promise<Array<BusinessScore & { business: Business }>> {
    const preferences = await storage.getUserPreferences(userId);
    if (!preferences) {
      throw new Error("User preferences not found");
    }

    const rankings: Array<BusinessScore & { business: Business }> = [];

    // Process businesses in batches to avoid API rate limits
    for (const business of businesses) {
      try {
        // Check if we already have a score for this business
        const existingScore = await storage.getBusinessScore(userId, business.id);
        
        if (existingScore) {
          rankings.push({
            ...existingScore,
            business
          });
          continue;
        }

        // Generate new score
        const ranking = await this.rankBusiness(business, preferences);
        
        const scoreData: InsertBusinessScore = {
          userId,
          businessId: business.id,
          score: ranking.score,
          reasoning: ranking.reasoning,
          factors: ranking.factors
        };

        const savedScore = await storage.createBusinessScore(scoreData);
        rankings.push({
          ...savedScore,
          business
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error ranking business ${business.id}:`, error);
        // Continue with other businesses
      }
    }

    // Sort by score descending
    return rankings.sort((a, b) => b.score - a.score);
  }

  /**
   * Smart location matching that handles state abbreviations
   */
  private matchesLocation(businessLocation: string, preferredLocation: string): boolean {
    const business = businessLocation.toLowerCase();
    const preferred = preferredLocation.toLowerCase();
    
    // Direct match or substring match
    if (business.includes(preferred) || preferred.includes(business)) {
      return true;
    }
    
    // Handle state abbreviations
    const stateAbbreviations: Record<string, string> = {
      'tx': 'texas',
      'ca': 'california', 
      'ny': 'new york',
      'fl': 'florida',
      'il': 'illinois',
      'pa': 'pennsylvania',
      'oh': 'ohio',
      'ga': 'georgia',
      'nc': 'north carolina',
      'mi': 'michigan',
      'nj': 'new jersey',
      'va': 'virginia',
      'wa': 'washington',
      'az': 'arizona',
      'ma': 'massachusetts',
      'tn': 'tennessee',
      'in': 'indiana',
      'mo': 'missouri',
      'md': 'maryland',
      'wi': 'wisconsin',
      'co': 'colorado',
      'mn': 'minnesota',
      'sc': 'south carolina',
      'al': 'alabama',
      'la': 'louisiana',
      'ky': 'kentucky',
      'or': 'oregon',
      'ok': 'oklahoma',
      'ct': 'connecticut',
      'ut': 'utah',
      'ia': 'iowa',
      'nv': 'nevada',
      'ar': 'arkansas',
      'ms': 'mississippi',
      'ks': 'kansas',
      'nm': 'new mexico',
      'ne': 'nebraska',
      'id': 'idaho',
      'wv': 'west virginia',
      'hi': 'hawaii',
      'nh': 'new hampshire',
      'me': 'maine',
      'mt': 'montana',
      'ri': 'rhode island',
      'de': 'delaware',
      'sd': 'south dakota',
      'nd': 'north dakota',
      'ak': 'alaska',
      'vt': 'vermont',
      'wy': 'wyoming'
    };
    
    // Extract city from both locations
    const businessParts = business.split(',').map(p => p.trim());
    const preferredParts = preferred.split(',').map(p => p.trim());
    
    if (businessParts.length >= 2 && preferredParts.length >= 2) {
      const businessCity = businessParts[0];
      const businessState = businessParts[1];
      const preferredCity = preferredParts[0];
      const preferredState = preferredParts[1];
      
      // Check if cities match
      if (businessCity === preferredCity) {
        // Check if states match (handle abbreviations)
        if (businessState === preferredState) {
          return true;
        }
        
        // Check state abbreviation mappings
        const businessStateFull = stateAbbreviations[businessState] || businessState;
        const preferredStateFull = stateAbbreviations[preferredState] || preferredState;
        
        return businessStateFull === preferredStateFull || 
               businessState === preferredStateFull || 
               businessStateFull === preferredState;
      }
    }
    
    return false;
  }

  /**
   * Get top ranked businesses for a user with caching
   */
  async getTopRankedBusinesses(
    userId: string, 
    limit: number = 20
  ): Promise<Array<BusinessScore & { business: Business }>> {
    // Get user preferences to apply location filtering
    const preferences = await storage.getUserPreferences(userId);
    const locationFilter = preferences?.location;

    // First, get cached scores and filter by location if preference exists
    const cachedScores = await storage.getBusinessScores(userId, limit * 2); // Get more to account for filtering
    const filteredCachedScores = locationFilter 
      ? cachedScores.filter(score => this.matchesLocation(score.business.location, locationFilter))
      : cachedScores;
    
    if (filteredCachedScores.length >= limit) {
      return filteredCachedScores.slice(0, limit);
    }

    // If we need more scores, get unscored businesses with location filter
    const businessFilters: any = { limit: 100 };
    if (locationFilter) {
      businessFilters.location = locationFilter;
    }
    
    const allBusinesses = await storage.getBusinesses(businessFilters);
    const scoredBusinessIds = new Set(filteredCachedScores.map(s => s.businessId));
    const unscored = allBusinesses.filter(b => !scoredBusinessIds.has(b.id));

    if (unscored.length > 0) {
      // Rank new businesses
      const newRankings = await this.rankMultipleBusinesses(unscored.slice(0, 20), userId);
      
      // Combine and sort
      const allRankings = [...filteredCachedScores, ...newRankings];
      return allRankings
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    }

    return filteredCachedScores.slice(0, limit);
  }

  /**
   * Re-rank businesses when user preferences change
   */
  async refreshUserRankings(userId: string): Promise<void> {
    const preferences = await storage.getUserPreferences(userId);
    if (!preferences) return;

    // Get all businesses this user has scored
    const existingScores = await storage.getBusinessScores(userId, 500);
    
    for (const scoreWithBusiness of existingScores) {
      try {
        const newRanking = await this.rankBusiness(scoreWithBusiness.business, preferences);
        
        await storage.updateBusinessScore(
          userId,
          scoreWithBusiness.businessId,
          newRanking.score,
          newRanking.reasoning,
          newRanking.factors
        );

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error re-ranking business ${scoreWithBusiness.businessId}:`, error);
      }
    }
  }

  private buildRankingPrompt(business: Business, preferences: UserPreferences): string {
    return `
Analyze this business opportunity against the investor's preferences and provide a compatibility score.

BUSINESS:
Name: ${business.name}
Industry: ${business.industry}
Location: ${business.location}
Description: ${business.description}
Asking Price: $${business.askingPrice.toLocaleString()}
Annual Revenue: $${business.annualRevenue.toLocaleString()}
Cash Flow: $${business.cashFlow.toLocaleString()}
EBITDA: $${business.ebitda.toLocaleString()}
Employees: ${business.employees}
Year Established: ${business.yearEstablished}

INVESTOR PREFERENCES:
Capital Range: $${preferences.capitalRange[0].toLocaleString()} - $${preferences.capitalRange[1].toLocaleString()}
Target Income: ${preferences.targetIncome}
Risk Tolerance: ${preferences.riskTolerance}
Involvement Level: ${preferences.involvement}
Preferred Location: ${preferences.location}
Preferred Industries: ${preferences.industries.join(", ")}
Business Size: ${preferences.businessSize}
Payback Period: ${preferences.paybackPeriod}

Provide a JSON response with this exact structure:
{
  "score": <integer 0-100>,
  "reasoning": "<2-3 sentence explanation of the score>",
  "factors": {
    "priceMatch": <integer 0-100>,
    "industryFit": <integer 0-100>,
    "riskAlignment": <integer 0-100>,
    "involvementFit": <integer 0-100>,
    "locationScore": <integer 0-100>,
    "financialHealth": <integer 0-100>
  }
}

Consider:
- Price match: How well does the asking price fit the investor's capital range?
- Industry fit: Does the business industry match preferences?
- Risk alignment: Does the business risk profile match tolerance?
- Involvement fit: Does required involvement match investor preferences?
- Location: Geographic compatibility
- Financial health: Revenue, cash flow, EBITDA strength and sustainability

Overall score should reflect investment attractiveness based on ALL factors combined.
`;
  }

  private calculateFallbackScore(business: Business, preferences: UserPreferences): RankingResult {
    // Simple algorithmic fallback if AI fails
    let score = 50; // baseline
    
    // Price match (30% weight)
    const priceMatch = business.askingPrice >= preferences.capitalRange[0] && 
                      business.askingPrice <= preferences.capitalRange[1] ? 90 : 20;
    
    // Industry fit (25% weight)
    const industryFit = preferences.industries.includes(business.industry) ? 85 : 30;
    
    // Basic financial health (20% weight)
    const revenueMultiple = business.askingPrice / Math.max(business.annualRevenue, 1);
    const financialHealth = revenueMultiple < 3 ? 80 : revenueMultiple < 5 ? 60 : 30;
    
    // Location proximity (15% weight) - basic string match
    const locationScore = business.location.toLowerCase().includes(preferences.location.toLowerCase()) ? 80 : 40;
    
    // Risk/involvement (10% weight) - neutral scoring
    const riskAlignment = 60;
    const involvementFit = 60;
    
    const factors: RankingFactors = {
      priceMatch,
      industryFit,
      riskAlignment,
      involvementFit,
      locationScore,
      financialHealth
    };
    
    // Weighted average
    score = Math.round(
      (priceMatch * 0.3) +
      (industryFit * 0.25) + 
      (financialHealth * 0.2) +
      (locationScore * 0.15) +
      (riskAlignment * 0.05) +
      (involvementFit * 0.05)
    );
    
    return {
      score: Math.max(0, Math.min(100, score)),
      reasoning: "Fallback scoring based on price fit, industry match, and basic financial metrics.",
      factors
    };
  }
}

export const businessRankingService = new BusinessRankingService();