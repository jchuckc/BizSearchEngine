import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, json, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication and profile data
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User investment preferences from onboarding
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  capitalRange: json("capital_range").$type<[number, number]>().notNull(),
  targetIncome: text("target_income").notNull(),
  riskTolerance: text("risk_tolerance").notNull(),
  involvement: text("involvement").notNull(),
  location: text("location").notNull(),
  industries: json("industries").$type<string[]>().notNull().default(sql`'[]'::json`),
  businessSize: text("business_size").notNull(),
  paybackPeriod: text("payback_period").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Business listings from scraped data
export const businesses = pgTable("businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  industry: text("industry").notNull(),
  askingPrice: integer("asking_price").notNull(),
  annualRevenue: integer("annual_revenue").notNull(),
  cashFlow: integer("cash_flow").notNull(),
  ebitda: integer("ebitda").notNull(),
  employees: integer("employees").notNull(),
  yearEstablished: integer("year_established").notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceSite: text("source_site").notNull(),
  sellerInfo: json("seller_info").$type<{
    contactEmail?: string;
    contactPhone?: string;
    brokerInfo?: string;
  }>(),
  businessDetails: json("business_details").$type<{
    ownerRole?: string;
    reasonForSelling?: string;
    trainingProvided?: string;
    realEstateIncluded?: boolean;
    assets?: string[];
  }>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI-generated scores for businesses based on user preferences
export const businessScores = pgTable("business_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  businessId: varchar("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  score: integer("score").notNull(), // 0-100 AI compatibility score
  reasoning: text("reasoning"), // AI explanation for the score
  factors: json("factors").$type<{
    priceMatch: number;
    industryFit: number;
    riskAlignment: number;
    involvementFit: number;
    locationScore: number;
    financialHealth: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userBusinessUnique: unique("user_business_unique").on(table.userId, table.businessId),
}));

// User search history and saved searches
export const searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  filters: json("filters").$type<{
    priceRange?: [number, number];
    revenueRange?: [number, number];
    location?: string;
    industry?: string[];
    riskTolerance?: string;
    involvement?: string;
    employees?: string;
  }>(),
  resultsCount: integer("results_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessScoreSchema = createInsertSchema(businessScores).omit({
  id: true,
  createdAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export type BusinessScore = typeof businessScores.$inferSelect;
export type InsertBusinessScore = z.infer<typeof insertBusinessScoreSchema>;

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
