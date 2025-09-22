import { StatsOverview } from "../StatsOverview";
import { TrendingUp, Building2, DollarSign, Star } from "lucide-react";

export default function StatsOverviewExample() {
  // TODO: remove mock functionality
  const mockStats = [
    {
      title: "Total Businesses",
      value: "2,847",
      change: "+12% from last month",
      trend: "up" as const,
      icon: Building2
    },
    {
      title: "Avg. Asking Price",
      value: "$485K",
      change: "+5% from last month", 
      trend: "up" as const,
      icon: DollarSign
    },
    {
      title: "High-Score Matches",
      value: "184",
      change: "+23% from last month",
      trend: "up" as const,
      icon: Star
    },
    {
      title: "Price Growth",
      value: "8.2%",
      change: "+2.1% from last month",
      trend: "up" as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="p-6">
      <StatsOverview stats={mockStats} />
    </div>
  );
}