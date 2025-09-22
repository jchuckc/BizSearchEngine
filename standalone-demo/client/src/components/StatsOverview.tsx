import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, DollarSign, Star } from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
}

interface StatsOverviewProps {
  stats: StatItem[];
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up": return "text-green-600 dark:text-green-400";
      case "down": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      default: return "";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} data-testid={`card-stat-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" data-testid={`text-stat-title-${index}`}>
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                {stat.value}
              </div>
              {stat.change && (
                <p className={`text-xs ${getTrendColor(stat.trend)}`} data-testid={`text-stat-change-${index}`}>
                  {getTrendIcon(stat.trend)} {stat.change}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}