import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, X } from "lucide-react";

interface OnboardingData {
  capitalRange: [number, number];
  targetIncome: string;
  riskTolerance: string;
  involvement: string;
  location: string;
  industries: string[];
  businessSize: string;
  paybackPeriod: string;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const steps = [
  "Investment Capacity",
  "Investment Goals", 
  "Risk & Involvement",
  "Preferences"
];

const targetIncomeOptions = [
  { value: "75k", label: "Less than $75K" },
  { value: "75k-150k", label: "$75K - $150K" },
  { value: "150k-250k", label: "$150K - $250K" },
  { value: "250k+", label: "$250K+" }
];

const riskToleranceOptions = [
  { value: "low", label: "Low Risk", description: "Proven, cash-flowing businesses" },
  { value: "medium", label: "Medium Risk", description: "Established businesses with growth potential" },
  { value: "high", label: "High Risk", description: "Startups and high-growth opportunities" }
];

const involvementOptions = [
  { value: "low", label: "Low Touch", description: "Semi-absentee owner, minimal day-to-day involvement" },
  { value: "medium", label: "Medium Touch", description: "Managerial role, strategic oversight" },
  { value: "high", label: "High Touch", description: "Owner-operator, hands-on daily management" }
];

const industries = [
  "Food & Beverage", "Retail", "Technology", "Healthcare", "Manufacturing",
  "Professional Services", "Real Estate", "Transportation", "Education", "Entertainment"
];

const businessSizeOptions = [
  { value: "small", label: "Small & Simple", description: "1-5 employees, easier to manage" },
  { value: "medium", label: "Established", description: "6-25 employees, systems in place" },
  { value: "large", label: "Enterprise", description: "25+ employees, complex operations" }
];

const paybackOptions = [
  { value: "2-3", label: "2-3 Years", description: "Faster payback, higher risk" },
  { value: "4-5", label: "4-5 Years", description: "Balanced approach" },
  { value: "5+", label: "5+ Years", description: "Safer, longer-term investment" }
];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    capitalRange: [100000, 500000],
    targetIncome: "",
    riskTolerance: "",
    involvement: "",
    location: "",
    industries: [],
    businessSize: "",
    paybackPeriod: ""
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleIndustry = (industry: string) => {
    const newIndustries = data.industries.includes(industry)
      ? data.industries.filter(i => i !== industry)
      : [...data.industries, industry];
    setData({ ...data, industries: newIndustries });
  };

  const removeIndustry = (industry: string) => {
    setData({ ...data, industries: data.industries.filter(i => i !== industry) });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return data.capitalRange[0] > 0 && data.capitalRange[1] > data.capitalRange[0];
      case 1: return data.targetIncome !== "";
      case 2: return data.riskTolerance !== "" && data.involvement !== "";
      case 3: return data.location !== "" && data.businessSize !== "" && data.paybackPeriod !== "";
      default: return true;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Set Up Your Investment Profile</CardTitle>
            <Button variant="ghost" size="sm" onClick={onSkip} data-testid="button-skip-onboarding">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 0: Investment Capacity */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How much capital do you have available?</h3>
                <p className="text-muted-foreground mb-4">
                  This helps us show you businesses within your investment range.
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base">
                  Investment Capital Range: {formatCurrency(data.capitalRange[0])} - {formatCurrency(data.capitalRange[1])}
                </Label>
                <Slider
                  value={data.capitalRange}
                  onValueChange={(value) => setData({ ...data, capitalRange: [value[0], value[1]] })}
                  max={2000000}
                  min={25000}
                  step={25000}
                  className="w-full"
                  data-testid="slider-capital-range"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$25K</span>
                  <span>$2M+</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Investment Goals */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What's your target annual income?</h3>
                <p className="text-muted-foreground mb-4">
                  This helps us prioritize businesses that can provide your desired cash flow.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {targetIncomeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={data.targetIncome === option.value ? "default" : "outline"}
                    className="h-auto p-4 justify-start text-left"
                    onClick={() => setData({ ...data, targetIncome: option.value })}
                    data-testid={`button-target-income-${option.value}`}
                  >
                    <div className="flex items-center gap-3">
                      {data.targetIncome === option.value && <CheckCircle className="h-5 w-5" />}
                      <span>{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Risk & Involvement */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Risk Tolerance & Involvement</h3>
                <p className="text-muted-foreground mb-6">
                  Tell us about your preferred risk level and how involved you want to be.
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Risk Tolerance</Label>
                <div className="grid grid-cols-1 gap-3">
                  {riskToleranceOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={data.riskTolerance === option.value ? "default" : "outline"}
                      className="h-auto p-4 justify-start text-left"
                      onClick={() => setData({ ...data, riskTolerance: option.value })}
                      data-testid={`button-risk-${option.value}`}
                    >
                      <div className="flex items-center gap-3">
                        {data.riskTolerance === option.value && <CheckCircle className="h-5 w-5" />}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Desired Involvement Level</Label>
                <div className="grid grid-cols-1 gap-3">
                  {involvementOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={data.involvement === option.value ? "default" : "outline"}
                      className="h-auto p-4 justify-start text-left"
                      onClick={() => setData({ ...data, involvement: option.value })}
                      data-testid={`button-involvement-${option.value}`}
                    >
                      <div className="flex items-center gap-3">
                        {data.involvement === option.value && <CheckCircle className="h-5 w-5" />}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Final Preferences</h3>
                <p className="text-muted-foreground mb-6">
                  Set your location, industry, and business size preferences.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Location</Label>
                  <Input
                    placeholder="City, State or 'Nationwide'"
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    data-testid="input-preferred-location"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Interested Industries (select multiple)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {data.industries.map((industry) => (
                      <Badge key={industry} variant="default" className="gap-1" data-testid={`badge-selected-${industry.replace(/\s+/g, '-').toLowerCase()}`}>
                        {industry}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeIndustry(industry)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {industries
                      .filter(industry => !data.industries.includes(industry))
                      .map((industry) => (
                        <Button
                          key={industry}
                          variant="outline"
                          size="sm"
                          onClick={() => toggleIndustry(industry)}
                          data-testid={`button-add-industry-${industry.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          + {industry}
                        </Button>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Business Size</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {businessSizeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={data.businessSize === option.value ? "default" : "outline"}
                        className="h-auto p-3 justify-start text-left"
                        onClick={() => setData({ ...data, businessSize: option.value })}
                        data-testid={`button-business-size-${option.value}`}
                      >
                        <div className="flex items-center gap-3">
                          {data.businessSize === option.value && <CheckCircle className="h-5 w-5" />}
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferred Payback Period</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {paybackOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={data.paybackPeriod === option.value ? "default" : "outline"}
                        className="h-auto p-3 justify-start text-left"
                        onClick={() => setData({ ...data, paybackPeriod: option.value })}
                        data-testid={`button-payback-${option.value}`}
                      >
                        <div className="flex items-center gap-3">
                          {data.paybackPeriod === option.value && <CheckCircle className="h-5 w-5" />}
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              data-testid="button-onboarding-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              data-testid="button-onboarding-next"
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
              {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}