import { z } from "zod";

// Simplified schema for demo - no database dependencies
export interface Business {
  id: string;
  name: string;
  description: string;
  location: string;
  industry: string;
  askingPrice: number;
  annualRevenue: number;
  cashFlow: number;
  ebitda: number;
  employees: number;
  yearEstablished: number;
  sourceUrl: string;
  sourceSite: string;
  aiScore?: number;
  createdAt: Date;
  updatedAt: Date;
  sellerInfo: null;
  businessDetails: null;
  isActive: boolean;
}

export interface BusinessScore {
  score: number;
  reasoning: string;
  factors: Record<string, any>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  preferences?: UserPreferences;
}

export interface DemoUser {
  id: string;
  username: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  budgetRange: {
    min: number;
    max: number;
  };
  preferredIndustries: string[];
  preferredLocations: string[];
  businessSize: string;
  riskTolerance: string;
  involvementLevel: string;
}

// Zod schemas for validation
export const businessInsertSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  industry: z.string().min(1),
  askingPrice: z.number().positive(),
  annualRevenue: z.number().positive(),
  cashFlow: z.number(),
  ebitda: z.number(),
  employees: z.number().positive(),
  yearEstablished: z.number().min(1900),
  sourceUrl: z.string().url(),
  sourceSite: z.string().min(1)
});

export const userPreferencesSchema = z.object({
  budgetRange: z.object({
    min: z.number().positive(),
    max: z.number().positive()
  }),
  preferredIndustries: z.array(z.string()),
  preferredLocations: z.array(z.string()),
  businessSize: z.string(),
  riskTolerance: z.string(),
  involvementLevel: z.string()
});

export type BusinessInsert = z.infer<typeof businessInsertSchema>;
export type UserPreferencesInsert = z.infer<typeof userPreferencesSchema>;