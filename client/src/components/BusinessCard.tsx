import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Users, Calendar, Star, ExternalLink } from "lucide-react";

interface BusinessCardProps {
  id: string;
  name: string;
  description: string;
  location: string;
  industry: string;
  askingPrice: number;
  annualRevenue: number;
  cashFlow: number;
  ebitda: number;
  employees: number;
  yearEstablished: number;
  sourceUrl: string;
  sourceSite: string;
  aiScore?: number;
  onViewDetails: (id: string) => void;
  onContact: (id: string) => void;
}

export function BusinessCard({
  id,
  name,
  description,
  location,
  industry,
  askingPrice,
  annualRevenue,
  cashFlow,
  ebitda,
  employees,
  yearEstablished,
  sourceUrl,
  sourceSite,
  aiScore,
  onViewDetails,
  onContact
}: BusinessCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="hover-elevate" data-testid={`card-business-${id}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold" data-testid={`text-business-name-${id}`}>{name}</h3>
          <Badge variant="secondary" data-testid={`badge-industry-${id}`}>{industry}</Badge>
        </div>
        {aiScore !== undefined && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className={`font-bold ${getScoreColor(aiScore)}`} data-testid={`text-ai-score-${id}`}>
              {aiScore}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground" data-testid={`text-description-${id}`}>
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span data-testid={`text-location-${id}`}>{location}</span>
            <Calendar className="h-4 w-4 ml-2" />
            <span data-testid={`text-established-${id}`}>Est. {yearEstablished}</span>
          </div>

          {sourceUrl && sourceSite && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4" />
              <span className="text-muted-foreground">Source:</span>
              <a 
                href={sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                data-testid={`link-source-${id}`}
              >
                {sourceSite}
              </a>
            </div>
          )}

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground w-20">Asking Price</span>
                <span className="font-semibold text-primary text-right" data-testid={`text-asking-price-${id}`}>
                  {formatCurrency(askingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground w-20">Cash Flow</span>
                <span className="font-medium text-green-600 dark:text-green-400 text-right" data-testid={`text-cash-flow-${id}`}>
                  {formatCurrency(cashFlow)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground w-20">Revenue</span>
                <span className="font-medium text-right" data-testid={`text-revenue-${id}`}>
                  {formatCurrency(annualRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground w-20">EBITDA</span>
                <span className="font-medium text-right" data-testid={`text-ebitda-${id}`}>
                  {formatCurrency(ebitda)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span data-testid={`text-employees-${id}`}>{employees} employees</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(id)}
              data-testid={`button-view-details-${id}`}
              className="flex-1"
            >
              View Details
            </Button>
            <Button 
              size="sm"
              onClick={() => onContact(id)}
              data-testid={`button-contact-${id}`}
              className="flex-1"
            >
              Contact Seller
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}