# BizSearch - Simplified Demo

A complete, zero-dependency demo version of the BizSearch business acquisition platform. Perfect for portfolio showcases, GitHub hosting, and demonstrations without any external API costs.

## 🚀 Quick Start

1. **Create a new Replit project** or local development environment
2. **Copy all files** from this `standalone-demo` folder to your new project
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the application**:
   ```bash
   npm run dev
   ```

That's it! The demo will be running on port 5000 with auto-login enabled.

## ✨ Demo Features

- ✅ **Auto-login** as "demo_investor" user (no signup/login required)
- ✅ **50+ realistic business listings** across multiple industries
- ✅ **Mock AI compatibility scoring** (70-100 scores with explanations)
- ✅ **Full search and filtering** functionality
- ✅ **Zero external dependencies** - completely self-contained
- ✅ **Zero operational costs** - no database, no API keys, no services
- ✅ **Perfect for portfolios** and GitHub hosting

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js with in-memory data storage
- **Authentication**: Simplified auto-login for demo purposes
- **Business Data**: 50+ static demo businesses with realistic financial data
- **AI Scoring**: Deterministic mock algorithm (no OpenAI API required)
- **State Management**: TanStack Query for consistent data fetching patterns

## 🎯 Demo User Profile

The demo automatically logs you in as:
- **Username**: demo_investor
- **Investment Budget**: $500K - $1.5M
- **Industries**: Technology, E-commerce, Food & Beverage
- **Risk Tolerance**: Medium
- **Involvement Level**: Hands-on
- **Location Preference**: United States

## 📊 Sample Business Data

The demo includes realistic businesses such as:
- **CloudSync Solutions** - SaaS ($1.2M asking price)
- **Brooklyn Artisan Coffee** - Food & Beverage ($850K asking price)
- **SF Wellness Centers** - Health & Fitness ($680K asking price)
- **Modern Home Furnishings** - Retail ($720K asking price)
- **Precision Parts Manufacturing** - Manufacturing ($1.8M asking price)
- **EcoHome Products** - E-commerce ($950K asking price)

## 🔧 Development Commands

```bash
# Development mode (recommended)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm run start
```

## 🚀 Deployment Options

### GitHub Pages
1. Build the application: `npm run build`
2. Deploy the `dist/client` folder to GitHub Pages
3. The demo runs entirely client-side after build

### Replit Hosting
1. The application is ready to publish directly from Replit
2. Use the "Publish" button in your Replit workspace
3. Your demo will be available at `your-app-name.replit.app`

### Other Hosting Services
Compatible with any static hosting service:
- Vercel
- Netlify
- Heroku
- AWS S3 + CloudFront
- And many others

## 🎨 Customization

### Update Business Data
Edit `server/data/demoBusinesses.ts` to modify the business listings.

### Adjust User Preferences
Modify the demo user preferences in `server/data/demoBusinesses.ts`.

### Change AI Scoring Logic
Update the mock scoring algorithm in `server/services/mockAIScoring.ts`.

### Styling & Branding
- Update colors in `client/src/index.css`
- Modify UI components in `client/src/components/`
- Change application name and branding as needed

## 📁 Project Structure

```
standalone-demo/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and query client
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express.js backend
│   ├── data/               # Static demo business data
│   ├── services/           # Mock AI scoring service
│   ├── storage/            # In-memory data storage
│   └── middleware/         # Demo authentication
├── shared/                 # Shared TypeScript schemas
└── dist/                   # Built application (after npm run build)
```

## 🛡️ Security Notes

This is a **demo application** designed for showcasing purposes:
- Uses simplified authentication (auto-login)
- No real user data or sensitive information
- No external API integrations
- Safe for public deployment and portfolio display

## 🔄 Differences from Production Version

| Feature | Production | Demo |
|---------|------------|------|
| Authentication | Full signup/login | Auto-login |
| Database | PostgreSQL | In-memory |
| AI Scoring | OpenAI GPT-4 | Mock algorithm |
| Business Data | Web scraping | Static demo data |
| User Management | Multi-user | Single demo user |
| External APIs | Required | None |
| Operational Cost | ~$50-100/month | $0 |

## 🤝 Contributing

This simplified demo is perfect for:
- Portfolio demonstrations
- Technical interviews
- Open source showcases
- Learning full-stack development patterns
- Testing UI/UX concepts

## 📄 License

MIT License - Feel free to use this demo for personal and educational purposes.

---

**Built with**: React, TypeScript, Express.js, Tailwind CSS, and Vite
**Demo Mode**: Zero external dependencies, perfect for portfolios!