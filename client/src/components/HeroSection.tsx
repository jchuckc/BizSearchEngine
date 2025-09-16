import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Filter, Zap } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Business_handshake_hero_image_9e473f8c.png";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onGetStarted: () => void;
}

export function HeroSection({ onSearch, onGetStarted }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl" data-testid="text-hero-title">
            Find Your Perfect
            <span className="block text-primary-foreground">Business Acquisition</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200" data-testid="text-hero-description">
            AI-powered business search that ranks opportunities based on your investment preferences, 
            risk tolerance, and involvement level. Stop spending months searching - get curated results in minutes.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Input
                placeholder="Search businesses by industry, location, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-0 text-white placeholder-gray-300 focus-visible:ring-0"
                data-testid="input-hero-search"
              />
              <Button 
                onClick={handleSearch}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-hero-search"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-8"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>

          {/* Key Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Ranking</h3>
              <p className="text-gray-300 text-sm">
                Get personalized business recommendations based on your specific investment criteria
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Filtering</h3>
              <p className="text-gray-300 text-sm">
                Filter by price, revenue, location, risk level, and involvement preferences
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Market Data</h3>
              <p className="text-gray-300 text-sm">
                Access comprehensive financial data from major business listing platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}