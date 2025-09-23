import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import HomePage from "@/pages/HomePage";
import AIResultsPage from "@/pages/AIResultsPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function Router({ globalSearchQuery }: { globalSearchQuery: string }) {
  return (
    <Switch>
      <Route path="/">
        <HomePage globalSearchQuery={globalSearchQuery} />
      </Route>
      <Route path="/ai-rankings">
        <AIResultsPage />
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const { isAuthenticated, logout } = useAuth();

  const handleSearch = (query: string) => {
    console.log(`Global search: ${query}`);
    // Pass search query to HomePage via prop
    setGlobalSearchQuery(query);
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
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        onSearch={handleSearch}
        onShowProfile={handleShowProfile}
        onShowSettings={handleShowSettings}
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
      />
      <main className="flex-1">
        <Router globalSearchQuery={globalSearchQuery} />
      </main>
    </div>
  );
}

function App() {
  // DETECTION MARKER - if you see this title, standalone-demo is active
  document.title = "STANDALONE_DEMO_ACTIVE - BizSearch";
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="light" storageKey="bizsearch-theme">
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
