import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (query: string) => {
    console.log(`Global search: ${query}`);
    // TODO: Implement global search functionality
  };

  const handleShowProfile = () => {
    console.log("Show profile");
    // TODO: Implement profile modal or page
  };

  const handleShowSettings = () => {
    console.log("Show settings");
    // TODO: Implement settings modal or page
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="bizsearch-theme">
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <AppHeader
                onSearch={handleSearch}
                onShowProfile={handleShowProfile}
                onShowSettings={handleShowSettings}
                onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
              />
              <main className="flex-1">
                <Router />
              </main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
