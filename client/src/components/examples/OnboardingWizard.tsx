import { OnboardingWizard } from "../OnboardingWizard";

export default function OnboardingWizardExample() {
  return (
    <OnboardingWizard
      onComplete={(data) => console.log("Onboarding completed:", data)}
      onSkip={() => console.log("Onboarding skipped")}
    />
  );
}