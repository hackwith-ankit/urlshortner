import React from 'react';
import { Card, CardContent } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  action 
}) => {
  return (
    <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center">
      <CardContent className="flex flex-col items-center max-w-sm space-y-4 p-6">
        <div className="p-4 bg-secondary rounded-full text-muted-foreground">
          <Icon className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action && <div className="pt-2">{action}</div>}
      </CardContent>
    </Card>
  );
};
