# BizSearch - AI-Powered Business Acquisition Platform

## Overview

BizSearch is a comprehensive business acquisition platform that helps entrepreneurs and investors discover, evaluate, and rank business opportunities based on personalized investment preferences. The platform combines web scraping for business listings, AI-powered ranking algorithms, and user preference matching to provide curated business recommendations.

Key features include:
- User authentication and onboarding with investment preference collection
- Business listing aggregation from multiple sources
- AI-powered compatibility scoring using OpenAI's GPT-4
- Advanced search and filtering capabilities
- Personalized business recommendations based on user criteria
- Search history and preference management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with custom design system supporting dark/light themes
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **Authentication**: Bcrypt for password hashing with session-based authentication
- **API Design**: RESTful endpoints with Zod schema validation for request/response types

### Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud hosting
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Connection Pooling**: Neon's connection pooling for efficient database connections

### AI Integration
- **AI Provider**: OpenAI GPT-4 for business compatibility scoring and ranking
- **Scoring Algorithm**: Multi-factor analysis considering price range, industry fit, risk tolerance, involvement level, location preferences, and financial health
- **Response Format**: Structured JSON responses with numerical scores and detailed reasoning

### Authentication & Authorization
- **Strategy**: Session-based authentication with secure HTTP-only cookies
- **Password Security**: Bcrypt with 12 salt rounds for secure password hashing
- **Session Storage**: PostgreSQL-backed session store for scalability
- **User Management**: Complete signup/login/logout flow with username and email uniqueness

### Business Data Management
- **Data Sources**: Web scraping from business-for-sale websites
- **Business Profiles**: Comprehensive business information including financials, location, industry, and seller details
- **Scoring System**: AI-generated compatibility scores stored with detailed reasoning and factors
- **Search & Filtering**: Multi-criteria filtering by price range, revenue, location, industry, and business characteristics

## External Dependencies

- **Database**: Neon PostgreSQL serverless database with connection pooling
- **AI Services**: OpenAI API for GPT-4 powered business ranking and compatibility analysis
- **Session Storage**: PostgreSQL-backed session management via connect-pg-simple
- **Font Services**: Google Fonts (Inter, DM Sans, Fira Code, Geist Mono) for typography
- **Development**: Replit integration for development environment and deployment
- **UI Components**: Radix UI primitives for accessible, unstyled UI components
- **Styling**: Tailwind CSS for utility-first styling approach