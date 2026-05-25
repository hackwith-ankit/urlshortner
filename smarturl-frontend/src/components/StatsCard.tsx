import React from 'react';
import { Card, CardContent } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}) => {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center space-x-1.5 mt-1">
              <span className={`text-xs font-semibold ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend.value}
              </span>
              <span className="text-[10px] text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-secondary rounded-lg text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
};
