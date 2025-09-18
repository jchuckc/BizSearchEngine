import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Building2, User, Settings, Menu, LogOut } from "lucide-react";
import { useState } from "react";

interface AppHeaderProps {
  onSearch: (query: string) => void;
  onShowProfile: () => void;
  onShowSettings: () => void;
  onToggleMobileMenu?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function AppHeader({ onSearch, onShowProfile, onShowSettings, onToggleMobileMenu, onLogout, isAuthenticated }: AppHeaderProps) {
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMobileMenu}
              className="md:hidden"
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight" data-testid="text-brand-name">
                  BizSearch
                </h1>
                <p className="text-xs text-muted-foreground">Business Acquisition Platform</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4"
                data-testid="input-header-search"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                  onClick={handleSearch}
                  data-testid="button-header-search"
                >
                  Search
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              data-testid="button-mobile-search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowProfile}
              data-testid="button-profile"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Profile</span>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowSettings}
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Settings</span>
            </Button>

            {/* Logout */}
            {isAuthenticated && onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}