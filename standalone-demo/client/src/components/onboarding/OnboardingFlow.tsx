import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuthForms } from "@/components/auth/AuthForms";
import { PreferencesForm } from "@/components/onboarding/PreferencesForm";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, User, Settings } from "lucide-react";

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type OnboardingStep = "welcome" | "auth" | "preferences" | "complete";

export function OnboardingFlow({ isOpen, onClose, onComplete }: OnboardingFlowProps) {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");

  const handleAuthSuccess = () => {
    // Small delay to ensure auth state is updated
    setTimeout(() => {
      setStep("preferences");
    }, 100);
  };

  const handlePreferencesComplete = () => {
    // Skip the complete step and immediately finish onboarding
    onComplete?.();
    setStep("welcome"); // Reset for next time
  };

  const handleSkipPreferences = () => {
    setStep("complete");
  };

  const handleComplete = () => {
    onComplete?.();
    setStep("welcome"); // Reset for next time
  };

  const handleClose = () => {
    onClose();
    setStep("welcome"); // Reset for next time
  };

  // If user is already authenticated, skip to preferences
  const currentStep = isAuthenticated && step === "welcome" ? "preferences" : step;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {currentStep === "welcome" && (
          <div className="space-y-6 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Welcome to Business Search</DialogTitle>
            </DialogHeader>
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Get Started in 2 Simple Steps</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Create your account and set your investment preferences to unlock AI-powered business recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium">Create Account</h4>
                  <p className="text-sm text-muted-foreground">Quick signup to save your preferences</p>
                </div>
                
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Settings className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium">Set Preferences</h4>
                  <p className="text-sm text-muted-foreground">Tell us your investment criteria</p>
                </div>
              </div>

              <Button onClick={() => setStep("auth")} size="lg" data-testid="button-get-started">
                Get Started
              </Button>
            </div>
          </div>
        )}

        {currentStep === "auth" && (
          <div>
            <DialogHeader className="pb-4">
              <DialogTitle>Step 1: Create Your Account</DialogTitle>
            </DialogHeader>
            <AuthForms onSuccess={handleAuthSuccess} />
          </div>
        )}

        {currentStep === "preferences" && (
          <div>
            <DialogHeader className="pb-4">
              <DialogTitle>Step 2: Set Your Investment Preferences</DialogTitle>
            </DialogHeader>
            <PreferencesForm 
              onComplete={handlePreferencesComplete}
              onSkip={handleSkipPreferences}
            />
          </div>
        )}

        {currentStep === "complete" && (
          <div className="space-y-6 p-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl">You're All Set!</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Welcome to Business Search!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your preferences have been saved. Browse businesses and get AI-powered compatibility scores based on your investment criteria.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">What's next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse businesses ranked by AI compatibility</li>
                  <li>• Use advanced search and filtering</li>
                  <li>• Get detailed business analysis</li>
                  <li>• Save and track your favorite opportunities</li>
                </ul>
              </div>

              <Button onClick={handleComplete} size="lg" data-testid="button-start-exploring">
                Start Exploring Businesses
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}