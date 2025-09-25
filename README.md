BizSearch - AI-Powered Business Acquisition Platform
A comprehensive business acquisition platform that helps entrepreneurs and investors discover, evaluate, and rank business opportunities using AI-powered compatibility scoring.

🚀 Features
Core Functionality
AI-Powered Business Ranking - Advanced compatibility scoring using OpenAI GPT-4
Comprehensive Business Listings - 50+ demo businesses with detailed financial information
Smart Search & Filtering - Multi-criteria filtering by price, revenue, location, and industry
Compatibility Analysis - 5-factor scoring system for personalized recommendations
Interactive Business Details - Modal views with complete business profiles
AI Compatibility Scoring
Price Match - Alignment with your budget preferences
Industry Fit - Match with your industry interests
Risk Alignment - Compatibility with your risk tolerance
Involvement Fit - Time commitment preference matching
Location Score - Geographic preference alignment
Business Intelligence
Financial Analysis - Asking price, revenue, cash flow, and EBITDA data
Market Insights - Average multiples, median prices, and market trends
Business Profiles - Complete company information including employees, establishment year, and descriptions
🛠 Technology Stack
Frontend
React 18 with TypeScript for type-safe development
Vite for fast development and optimized builds
Tailwind CSS with custom design system
Shadcn/ui components built on Radix UI primitives
TanStack Query for efficient server state management
Wouter for lightweight client-side routing
Backend
Node.js with Express.js server framework
TypeScript with ES modules
PostgreSQL with Drizzle ORM for type-safe database operations
Session-based authentication with bcrypt password hashing
OpenAI GPT-4 integration for AI-powered business analysis
Development & Deployment
Replit development environment and hosting
Neon serverless PostgreSQL database
Hot module replacement for rapid development
Automated testing with Playwright for end-to-end testing
🚦 Getting Started
Prerequisites
Node.js (included in Replit environment)
PostgreSQL database (automatically configured)
OpenAI API access (for AI scoring features)
Installation
Clone and Setup

# Dependencies are automatically installed in Replit
# Manual installation (if needed):
npm install
Database Setup

# Push database schema
npm run db:push
Environment Configuration

Database connection is automatically configured
OpenAI integration is pre-configured for demo mode
Start Development Server

npm run dev
The application will be available at http://localhost:5000 (or your Replit URL).

📖 Usage Guide
Demo Mode
The application runs in demo mode with:

Auto-login - No registration required
Mock AI scoring - Deterministic scoring system (68-98 range)
50+ static business listings - Pre-loaded demo data
Simulated search functionality - Instant results without external APIs
Searching for Businesses
Live Search - Click "Live Search" to load business listings
Filter Options - Use the sidebar filters to narrow results:
Price range
Industry type
Location preferences
Revenue criteria
Sort Results - Sort by asking price, revenue, cash flow, or establishment year
Viewing Business Details
Business Cards - Browse AI-ranked business listings
View Details - Click to open detailed business modal with:
AI compatibility score and reasoning
5-factor compatibility breakdown
Complete financial information
Business overview and contact options
Contact Sellers - Simulated contact functionality in demo mode
AI Compatibility Features
Personalized Scoring - Each business gets a compatibility score (0-100)
Factor Analysis - Detailed breakdown of why a business matches your criteria
Smart Ranking - Businesses automatically sorted by compatibility
Color-coded Scores - Visual indicators for high, medium, and low compatibility
🏗 Architecture Overview
Project Structure
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
├── demo-client/           # Demo-specific components
├── server/                # Express.js backend
│   ├── routes.ts         # API routes
│   ├── storage/          # Data storage layer
│   └── services/         # Business logic services
├── shared/               # Shared types and schemas
└── dist/                # Built application files
Data Flow
Frontend requests business data via REST API
Backend serves static demo data with mock AI scores
AI Scoring generates compatibility scores using deterministic algorithm
Database stores user sessions and preferences (demo mode)
UI Updates reflect real-time search and filtering results
🔧 Development
Available Scripts
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Update database schema
npm run db:studio    # Open database management UI
Key Components
BusinessCard - Individual business listing display
BusinessList - Grid of business cards with sorting/filtering
BusinessDetailsModal - Detailed business information popup
SearchFilters - Sidebar filtering controls
AI Scoring System - Compatibility calculation engine
Adding New Features
Database Changes - Update schema in shared/schema.ts
API Routes - Add endpoints in server/routes.ts
Frontend Components - Create in client/src/components/
Testing - Use Playwright for end-to-end testing
🎯 Demo vs Production
Demo Mode Features
✅ No external API dependencies
✅ Static business data (50+ listings)
✅ Mock AI scoring algorithm
✅ Simulated user authentication
✅ Zero-cost operation for portfolio showcasing
Production Ready Features
🔄 Real web scraping integration
🔄 Live OpenAI API connectivity
🔄 User registration and authentication
🔄 Dynamic business data updates
🔄 Payment processing integration
📊 Performance
Fast Load Times - Optimized Vite build with code splitting
Responsive Design - Mobile-first approach with Tailwind CSS
Efficient Caching - TanStack Query for optimal data fetching
SEO Optimized - Proper meta tags and semantic HTML structure
🤝 Contributing
This is a portfolio project demonstrating modern full-stack development practices. Key areas for enhancement:

Enhanced AI Features - More sophisticated scoring algorithms
Advanced Filtering - Additional search criteria and smart filters
Data Visualization - Charts and graphs for market analysis
Mobile Experience - Native mobile app development
Integration Expansion - Additional business listing sources
📝 License
This project is for portfolio demonstration purposes. All business data is simulated for demo purposes.

🔗 Links
Live Demo: [https://biz-search-engine-jnwachukwu.replit.app/]
Development Environment: Replit
Database: Neon PostgreSQL
AI Provider: OpenAI GPT-4
