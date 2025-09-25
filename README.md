# BizSearch - AI-Powered Business Acquisition Platform

A comprehensive business acquisition platform that helps entrepreneurs and investors discover, evaluate, and rank business opportunities using AI-powered compatibility scoring.

## 🚀 Features

### Core Functionality
- **AI-Powered Business Ranking** - Advanced compatibility scoring using OpenAI GPT-4
- **Comprehensive Business Listings** - 50+ demo businesses with detailed financial information
- **Smart Search & Filtering** - Multi-criteria filtering by price, revenue, location, and industry
- **Compatibility Analysis** - 5-factor scoring system for personalized recommendations
- **Interactive Business Details** - Modal views with complete business profiles

### AI Compatibility Scoring
System Prompt

Persona: You are a very knowledgeable financial and investment professional with decades of experience in acquiring small and medium businesses. You make your analysis step by step and consider multiple different expert approaches before settling on a course of action.
Instruction:
You are to generate a ranked shortlist of 10 businesses for sale based on the user criteria when compared to the business attributes. Also, generate short explanations regarding how the rankings were arrived at. And add the source of the listing to the results. If the user does not enter any of the input criteria, remind the user that this information would help arrive at more accurate results, but do not require that the information be entered.

- **Price Match** - Alignment with your budget preferences
- **Industry Fit** - Match with your industry interests
- **Risk Alignment** - Compatibility with your risk tolerance
- **Involvement Fit** - Time commitment preference matching
- **Location Score** - Geographic preference alignment

### Business Intelligence
- **Financial Analysis** - Asking price, revenue, cash flow, and EBITDA data
- **Market Insights** - Average multiples, median prices, and market trends
- **Business Profiles** - Complete company information including employees, establishment year, and descriptions

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **Shadcn/ui** components built on Radix UI primitives
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Node.js** with Express.js server framework
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **Session-based authentication** with bcrypt password hashing
- **OpenAI GPT-4** integration for AI-powered business analysis

### Development & Deployment
- **Replit** development environment and hosting
- **Neon** serverless PostgreSQL database
- **Hot module replacement** for rapid development
- **Automated testing** with Playwright for end-to-end testing

## 🚦 Getting Started

### Prerequisites
- Node.js (included in Replit environment)
- PostgreSQL database (automatically configured)
- OpenAI API access (for AI scoring features)

### Installation

1. **Clone and Setup**
   ```bash
   # Dependencies are automatically installed in Replit
   # Manual installation (if needed):
   npm install
   ```

2. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

3. **Environment Configuration**
   - Database connection is automatically configured
   - OpenAI integration is pre-configured for demo mode

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000` (or your Replit URL).

## 📖 Usage Guide

### Demo Mode
The application runs in demo mode with:
- **Auto-login** - No registration required
- **Mock AI scoring** - Deterministic scoring system (68-98 range)
- **50+ static business listings** - Pre-loaded demo data
- **Simulated search functionality** - Instant results without external APIs

### Searching for Businesses
1. **Live Search** - Click "Live Search" to load business listings
2. **Filter Options** - Use the sidebar filters to narrow results:
   - Price range
   - Industry type
   - Location preferences
   - Revenue criteria
3. **Sort Results** - Sort by asking price, revenue, cash flow, or establishment year

### Viewing Business Details
1. **Business Cards** - Browse AI-ranked business listings
2. **View Details** - Click to open detailed business modal with:
   - AI compatibility score and reasoning
   - 5-factor compatibility breakdown
   - Complete financial information
   - Business overview and contact options
3. **Contact Sellers** - Simulated contact functionality in demo mode

### AI Compatibility Features
- **Personalized Scoring** - Each business gets a compatibility score (0-100)
- **Factor Analysis** - Detailed breakdown of why a business matches your criteria
- **Smart Ranking** - Businesses automatically sorted by compatibility
- **Color-coded Scores** - Visual indicators for high, medium, and low compatibility

## 🏗 Architecture Overview

### Project Structure
```
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
```

### Data Flow
1. **Frontend** requests business data via REST API
2. **Backend** serves static demo data with mock AI scores
3. **AI Scoring** generates compatibility scores using deterministic algorithm
4. **Database** stores user sessions and preferences (demo mode)
5. **UI Updates** reflect real-time search and filtering results

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Update database schema
npm run db:studio    # Open database management UI
```

### Key Components
- **BusinessCard** - Individual business listing display
- **BusinessList** - Grid of business cards with sorting/filtering
- **BusinessDetailsModal** - Detailed business information popup
- **SearchFilters** - Sidebar filtering controls
- **AI Scoring System** - Compatibility calculation engine

### Adding New Features
1. **Database Changes** - Update schema in `shared/schema.ts`
2. **API Routes** - Add endpoints in `server/routes.ts`
3. **Frontend Components** - Create in `client/src/components/`
4. **Testing** - Use Playwright for end-to-end testing

## 🎯 Demo vs Production

### Demo Mode Features
- ✅ No external API dependencies
- ✅ Static business data (50+ listings)
- ✅ Mock AI scoring algorithm
- ✅ Simulated user authentication
- ✅ Zero-cost operation for portfolio showcasing

### Production Ready Features
- 🔄 Real web scraping integration
- 🔄 Live OpenAI API connectivity
- 🔄 User registration and authentication
- 🔄 Dynamic business data updates
- 🔄 Payment processing integration

## 📊 Performance

- **Fast Load Times** - Optimized Vite build with code splitting
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Efficient Caching** - TanStack Query for optimal data fetching
- **SEO Optimized** - Proper meta tags and semantic HTML structure

## 🤝 Contributing

This is a portfolio project demonstrating modern full-stack development practices. Key areas for enhancement:

1. **Enhanced AI Features** - More sophisticated scoring algorithms
2. **Advanced Filtering** - Additional search criteria and smart filters
3. **Data Visualization** - Charts and graphs for market analysis
4. **Mobile Experience** - Native mobile app development
5. **Integration Expansion** - Additional business listing sources

## 📝 License

This project is for portfolio demonstration purposes. All business data is simulated for demo purposes.

## 🔗 Links

- **Live Demo**: [https://biz-search-engine-jnwachukwu.replit.app/]
- **Development Environment**: Replit
- **Database**: Neon PostgreSQL
- **AI Provider**: OpenAI GPT-4

---

Built with ❤️ using modern web technologies for efficient business acquisition discovery.
