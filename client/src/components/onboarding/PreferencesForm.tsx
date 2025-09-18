import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

const industries = [
  "Technology",
  "Healthcare", 
  "Finance",
  "Manufacturing",
  "Retail",
  "Food & Beverage",
  "Services",
  "Real Estate",
  "Education",
  "Transportation"
];

const locations = [
  "New York, NY",
  "Los Angeles, CA", 
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "Austin, TX",
  "Remote/Online"
];

interface PreferencesFormProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function PreferencesForm({ onComplete, onSkip }: PreferencesFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    industries: [] as string[],
    capitalRange: {
      min: "",
      max: ""
    },
    revenueRange: {
      min: "",
      max: ""
    },
    riskTolerance: "",
    targetIncome: "",
    involvement: "",
    location: "",
    businessSize: "",
    paybackPeriod: ""
  });

  const handleIndustryChange = (industry: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      industries: checked 
        ? [...prev.industries, industry]
        : prev.industries.filter(i => i !== industry)
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industries: preferences.industries,
          capitalRange: [
            parseInt(preferences.capitalRange.min) || 50000,
            parseInt(preferences.capitalRange.max) || 1000000
          ],
          revenueRange: [
            parseInt(preferences.revenueRange.min) || 100000,
            parseInt(preferences.revenueRange.max) || 10000000
          ],
          riskTolerance: preferences.riskTolerance,
          targetIncome: preferences.targetIncome,
          involvement: preferences.involvement,
          location: preferences.location,
          businessSize: preferences.businessSize,
          paybackPeriod: preferences.paybackPeriod
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save preferences");
      }

      // Invalidate preferences and businesses queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user', 'preferences'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['businesses', 'ranked'] });

      toast({
        title: "Preferences saved!",
        description: "Your investment preferences have been saved and we'll personalize your business recommendations.",
      });
      
      onComplete?.();
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Your Investment Preferences</CardTitle>
          <CardDescription>
            Help us personalize your business search with AI-powered recommendations based on your investment criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Budget Range */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Budget Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-min">Minimum ($)</Label>
                  <Input
                    id="budget-min"
                    type="number"
                    placeholder="e.g., 100000"
                    value={preferences.capitalRange.min}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      capitalRange: { ...prev.capitalRange, min: e.target.value }
                    }))}
                    data-testid="input-budget-min"
                  />
                </div>
                <div>
                  <Label htmlFor="budget-max">Maximum ($)</Label>
                  <Input
                    id="budget-max"
                    type="number"
                    placeholder="e.g., 500000"
                    value={preferences.capitalRange.max}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      capitalRange: { ...prev.capitalRange, max: e.target.value }
                    }))}
                    data-testid="input-budget-max"
                  />
                </div>
              </div>
            </div>

            {/* Revenue Range */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Target Annual Revenue Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenue-min">Minimum ($)</Label>
                  <Input
                    id="revenue-min"
                    type="number"
                    placeholder="e.g., 500000"
                    value={preferences.revenueRange.min}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      revenueRange: { ...prev.revenueRange, min: e.target.value }
                    }))}
                    data-testid="input-revenue-min"
                  />
                </div>
                <div>
                  <Label htmlFor="revenue-max">Maximum ($)</Label>
                  <Input
                    id="revenue-max"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={preferences.revenueRange.max}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      revenueRange: { ...prev.revenueRange, max: e.target.value }
                    }))}
                    data-testid="input-revenue-max"
                  />
                </div>
              </div>
            </div>

            {/* Target Income */}
            <div className="space-y-2">
              <Label htmlFor="target-income">Target Annual Income</Label>
              <Input
                id="target-income"
                type="number"
                placeholder="e.g., 150000"
                value={preferences.targetIncome}
                onChange={(e) => setPreferences(prev => ({ ...prev, targetIncome: e.target.value }))}
                data-testid="input-target-income"
              />
            </div>

            {/* Risk Tolerance */}
            <div className="space-y-2">
              <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
              <Select
                value={preferences.riskTolerance}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, riskTolerance: value }))}
              >
                <SelectTrigger data-testid="select-risk-tolerance">
                  <SelectValue placeholder="Select your risk tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Risk Level</SelectItem>
                  <SelectItem value="low">Low Risk - Stable, established businesses</SelectItem>
                  <SelectItem value="medium">Medium Risk - Some growth potential acceptable</SelectItem>
                  <SelectItem value="high">High Risk - High growth, higher risk acceptable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Involvement */}
            <div className="space-y-2">
              <Label htmlFor="involvement">Your Involvement Level</Label>
              <Select
                value={preferences.involvement}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, involvement: value }))}
              >
                <SelectTrigger data-testid="select-involvement">
                  <SelectValue placeholder="How involved do you want to be?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Involvement Level</SelectItem>
                  <SelectItem value="low">Low Touch (Semi-Absentee)</SelectItem>
                  <SelectItem value="medium">Medium Touch (Managerial)</SelectItem>
                  <SelectItem value="high">High Touch (Owner-Operator)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Select
                value={preferences.location}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger data-testid="select-location">
                  <SelectValue placeholder="Where do you want to invest?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Location</SelectItem>
                  <SelectItem value="Albuquerque, NM">Albuquerque, NM</SelectItem>
                  <SelectItem value="Arlington, TX">Arlington, TX</SelectItem>
                  <SelectItem value="Atlanta, GA">Atlanta, GA</SelectItem>
                  <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                  <SelectItem value="Baltimore, MD">Baltimore, MD</SelectItem>
                  <SelectItem value="Boston, MA">Boston, MA</SelectItem>
                  <SelectItem value="Charlotte, NC">Charlotte, NC</SelectItem>
                  <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                  <SelectItem value="Colorado Springs, CO">Colorado Springs, CO</SelectItem>
                  <SelectItem value="Columbus, OH">Columbus, OH</SelectItem>
                  <SelectItem value="Dallas, TX">Dallas, TX</SelectItem>
                  <SelectItem value="Denver, CO">Denver, CO</SelectItem>
                  <SelectItem value="Detroit, MI">Detroit, MI</SelectItem>
                  <SelectItem value="El Paso, TX">El Paso, TX</SelectItem>
                  <SelectItem value="Fort Worth, TX">Fort Worth, TX</SelectItem>
                  <SelectItem value="Fresno, CA">Fresno, CA</SelectItem>
                  <SelectItem value="Houston, TX">Houston, TX</SelectItem>
                  <SelectItem value="Indianapolis, IN">Indianapolis, IN</SelectItem>
                  <SelectItem value="Jacksonville, FL">Jacksonville, FL</SelectItem>
                  <SelectItem value="Kansas City, MO">Kansas City, MO</SelectItem>
                  <SelectItem value="Las Vegas, NV">Las Vegas, NV</SelectItem>
                  <SelectItem value="Long Beach, CA">Long Beach, CA</SelectItem>
                  <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                  <SelectItem value="Louisville, KY">Louisville, KY</SelectItem>
                  <SelectItem value="Memphis, TN">Memphis, TN</SelectItem>
                  <SelectItem value="Mesa, AZ">Mesa, AZ</SelectItem>
                  <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                  <SelectItem value="Milwaukee, WI">Milwaukee, WI</SelectItem>
                  <SelectItem value="Minneapolis, MN">Minneapolis, MN</SelectItem>
                  <SelectItem value="Nashville, TN">Nashville, TN</SelectItem>
                  <SelectItem value="New Orleans, LA">New Orleans, LA</SelectItem>
                  <SelectItem value="New York, NY">New York, NY</SelectItem>
                  <SelectItem value="Oakland, CA">Oakland, CA</SelectItem>
                  <SelectItem value="Oklahoma City, OK">Oklahoma City, OK</SelectItem>
                  <SelectItem value="Omaha, NE">Omaha, NE</SelectItem>
                  <SelectItem value="Philadelphia, PA">Philadelphia, PA</SelectItem>
                  <SelectItem value="Phoenix, AZ">Phoenix, AZ</SelectItem>
                  <SelectItem value="Portland, OR">Portland, OR</SelectItem>
                  <SelectItem value="Raleigh, NC">Raleigh, NC</SelectItem>
                  <SelectItem value="Sacramento, CA">Sacramento, CA</SelectItem>
                  <SelectItem value="San Antonio, TX">San Antonio, TX</SelectItem>
                  <SelectItem value="San Diego, CA">San Diego, CA</SelectItem>
                  <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                  <SelectItem value="San Jose, CA">San Jose, CA</SelectItem>
                  <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                  <SelectItem value="Tampa, FL">Tampa, FL</SelectItem>
                  <SelectItem value="Tucson, AZ">Tucson, AZ</SelectItem>
                  <SelectItem value="Tulsa, OK">Tulsa, OK</SelectItem>
                  <SelectItem value="Virginia Beach, VA">Virginia Beach, VA</SelectItem>
                  <SelectItem value="Washington, DC">Washington, DC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Size Preference */}
            <div className="space-y-2">
              <Label htmlFor="business-size">Business Size Preference</Label>
              <Select
                value={preferences.businessSize}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, businessSize: value }))}
              >
                <SelectTrigger data-testid="select-business-size">
                  <SelectValue placeholder="What size business interests you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small - Under 10 employees</SelectItem>
                  <SelectItem value="medium">Medium - 10-50 employees</SelectItem>
                  <SelectItem value="large">Large - 50+ employees</SelectItem>
                  <SelectItem value="any">No preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payback Period */}
            <div className="space-y-2">
              <Label htmlFor="payback-period">Expected Payback Period</Label>
              <Select
                value={preferences.paybackPeriod}
                onValueChange={(value) => setPreferences(prev => ({ ...prev, paybackPeriod: value }))}
              >
                <SelectTrigger data-testid="select-payback-period">
                  <SelectValue placeholder="When do you expect to recoup investment?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2 years">1-2 years - Quick return</SelectItem>
                  <SelectItem value="3-5 years">3-5 years - Medium term</SelectItem>
                  <SelectItem value="5+ years">5+ years - Long term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Industries */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Preferred Industries (select all that interest you)</Label>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={preferences.industries.includes(industry)}
                      onCheckedChange={(checked) => handleIndustryChange(industry, !!checked)}
                      data-testid={`checkbox-industry-${industry.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label htmlFor={`industry-${industry}`} className="text-sm font-normal">
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
            </div>



            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} data-testid="button-save-preferences">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving preferences...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                data-testid="button-skip-preferences"
              >
                Skip for now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}