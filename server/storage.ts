import { 
  users, userPreferences, businesses, businessScores, searchHistory,
  type User, type InsertUser, 
  type UserPreferences, type InsertUserPreferences,
  type Business, type InsertBusiness,
  type BusinessScore, type InsertBusinessScore,
  type SearchHistory, type InsertSearchHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, ilike, inArray, gte, lte, or } from "drizzle-orm";
import { AuthUtils } from "./auth";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;

  // User preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences & { userId: string }): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined>;

  // Business management
  getBusiness(id: string): Promise<Business | undefined>;
  getBusinesses(filters?: {
    priceRange?: [number, number];
    revenueRange?: [number, number];
    location?: string;
    industries?: string[];
    employees?: string;
    limit?: number;
    offset?: number;
  }): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business | undefined>;
  searchBusinesses(query: string, filters?: any): Promise<Business[]>;

  // Business scoring
  getBusinessScore(userId: string, businessId: string): Promise<BusinessScore | undefined>;
  getBusinessScores(userId: string, limit?: number): Promise<Array<BusinessScore & { business: Business }>>;
  createBusinessScore(score: InsertBusinessScore): Promise<BusinessScore>;
  updateBusinessScore(userId: string, businessId: string, score: number, reasoning?: string, factors?: any): Promise<BusinessScore | undefined>;

  // Search history
  getUserSearchHistory(userId: string, limit?: number): Promise<SearchHistory[]>;
  createSearchHistory(history: InsertSearchHistory & { userId: string }): Promise<SearchHistory>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await AuthUtils.hashPassword(insertUser.password);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword
      })
      .returning();
    return user;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await AuthUtils.comparePassword(password, hashedPassword);
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async createUserPreferences(preferences: InsertUserPreferences & { userId: string }): Promise<UserPreferences> {
    const insertData: any = { ...preferences };
    const [created] = await db
      .insert(userPreferences)
      .values(insertData)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...insertData,
          updatedAt: new Date()
        }
      })
      .returning();
    return created;
  }

  async updateUserPreferences(userId: string, updates: Partial<InsertUserPreferences>): Promise<UserPreferences | undefined> {
    const updateData: any = { ...updates, updatedAt: new Date() };
    const [updated] = await db
      .update(userPreferences)
      .set(updateData)
      .where(eq(userPreferences.userId, userId))
      .returning();
    return updated || undefined;
  }

  // Business management
  async getBusiness(id: string): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.id, id), eq(businesses.isActive, true)));
    return business || undefined;
  }

  async getBusinesses(filters?: {
    priceRange?: [number, number];
    revenueRange?: [number, number];
    location?: string;
    industries?: string[];
    employees?: string;
    limit?: number;
    offset?: number;
  }): Promise<Business[]> {
    const conditions = [eq(businesses.isActive, true)];

    if (filters?.priceRange) {
      conditions.push(
        and(
          gte(businesses.askingPrice, filters.priceRange[0]),
          lte(businesses.askingPrice, filters.priceRange[1])
        )!
      );
    }

    if (filters?.revenueRange) {
      conditions.push(
        and(
          gte(businesses.annualRevenue, filters.revenueRange[0]),
          lte(businesses.annualRevenue, filters.revenueRange[1])
        )!
      );
    }

    if (filters?.location) {
      conditions.push(ilike(businesses.location, `%${filters.location}%`));
    }

    if (filters?.industries && filters.industries.length > 0) {
      conditions.push(inArray(businesses.industry, filters.industries));
    }

    if (filters?.employees) {
      const [min, max] = this.parseEmployeeRange(filters.employees);
      if (min !== null) {
        conditions.push(gte(businesses.employees, min));
      }
      if (max !== null) {
        conditions.push(lte(businesses.employees, max));
      }
    }

    let query = db
      .select()
      .from(businesses)
      .where(and(...conditions))
      .orderBy(desc(businesses.createdAt))
      .$dynamic();

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  private parseEmployeeRange(range: string): [number | null, number | null] {
    switch (range) {
      case "1-5": return [1, 5];
      case "6-15": return [6, 15];
      case "16-50": return [16, 50];
      case "50+": return [50, null];
      default: return [null, null];
    }
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const insertData: any = { ...business };
    const [created] = await db
      .insert(businesses)
      .values(insertData)
      .returning();
    return created;
  }

  async updateBusiness(id: string, updates: Partial<InsertBusiness>): Promise<Business | undefined> {
    const updateData: any = { ...updates, updatedAt: new Date() };
    const [updated] = await db
      .update(businesses)
      .set(updateData)
      .where(eq(businesses.id, id))
      .returning();
    return updated || undefined;
  }

  async searchBusinesses(query: string, filters?: any): Promise<Business[]> {
    const searchQuery = db
      .select()
      .from(businesses)
      .where(
        and(
          eq(businesses.isActive, true),
          or(
            ilike(businesses.name, `%${query}%`),
            ilike(businesses.description, `%${query}%`),
            ilike(businesses.industry, `%${query}%`),
            ilike(businesses.location, `%${query}%`)
          )
        )
      )
      .orderBy(desc(businesses.createdAt))
      .limit(50);

    return await searchQuery;
  }

  // Business scoring
  async getBusinessScore(userId: string, businessId: string): Promise<BusinessScore | undefined> {
    const [score] = await db
      .select()
      .from(businessScores)
      .where(
        and(
          eq(businessScores.userId, userId),
          eq(businessScores.businessId, businessId)
        )
      );
    return score || undefined;
  }

  async getBusinessScores(userId: string, limit: number = 50): Promise<Array<BusinessScore & { business: Business }>> {
    const results = await db
      .select({
        score: businessScores,
        business: businesses
      })
      .from(businessScores)
      .innerJoin(businesses, eq(businessScores.businessId, businesses.id))
      .where(
        and(
          eq(businessScores.userId, userId),
          eq(businesses.isActive, true)
        )
      )
      .orderBy(desc(businessScores.score))
      .limit(limit);

    return results.map(r => ({
      ...r.score,
      business: r.business
    }));
  }

  async createBusinessScore(score: InsertBusinessScore): Promise<BusinessScore> {
    const insertData: any = { ...score };
    const [created] = await db
      .insert(businessScores)
      .values(insertData)
      .onConflictDoUpdate({
        target: [businessScores.userId, businessScores.businessId],
        set: {
          score: insertData.score,
          reasoning: insertData.reasoning,
          factors: insertData.factors,
        }
      })
      .returning();
    return created;
  }

  async updateBusinessScore(userId: string, businessId: string, score: number, reasoning?: string, factors?: any): Promise<BusinessScore | undefined> {
    const [updated] = await db
      .update(businessScores)
      .set({ score, reasoning, factors })
      .where(
        and(
          eq(businessScores.userId, userId),
          eq(businessScores.businessId, businessId)
        )
      )
      .returning();
    return updated || undefined;
  }

  // Search history
  async getUserSearchHistory(userId: string, limit: number = 20): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
  }

  async createSearchHistory(history: InsertSearchHistory & { userId: string }): Promise<SearchHistory> {
    const insertData: any = { ...history };
    const [created] = await db
      .insert(searchHistory)
      .values(insertData)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
