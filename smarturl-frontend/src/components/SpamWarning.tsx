import React from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { SafetyResult } from '../types';

interface SpamWarningProps {
  safetyResult: SafetyResult;
}

export const SpamWarning: React.FC<SpamWarningProps> = ({ safetyResult }) => {
  const { riskLevel, warnings, checks } = safetyResult;

  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'HIGH_RISK':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30',
          text: 'text-rose-400',
          badge: 'destructive' as const,
          icon: AlertTriangle
        };
      case 'SUSPICIOUS':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30',
          text: 'text-amber-400',
          badge: 'warning' as const,
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'success' as const,
          icon: ShieldCheck
        };
    }
  };

  const styles = getRiskStyles();
  const Icon = styles.icon;

  return (
    <div className="space-y-4">
      <Card className={`border ${styles.bg}`}>
        <CardContent className="p-6 flex items-start space-x-4">
          <div className={`p-3 bg-secondary rounded-lg ${styles.text}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-lg text-foreground">Safety Analysis</h4>
              <Badge variant={styles.badge}>{riskLevel.replace('_', ' ')}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {riskLevel === 'SAFE' 
                ? 'This URL passed all safety scanner checks.' 
                : 'Potential security threats detected. Shortening this URL may trigger warning pages for visitors.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Warnings List */}
      {warnings.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <h5 className="font-semibold text-sm text-foreground">Detected Issues</h5>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Checklist Results */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h5 className="font-semibold text-sm text-foreground">Scanner Checklist</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checks.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <Badge variant={c.passed ? 'success' : 'destructive'}>
                  {c.passed ? 'PASSED' : 'FAILED'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
