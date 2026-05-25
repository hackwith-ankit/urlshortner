import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { AnalyticsSummary } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { StatsCard } from '../../components/StatsCard';
import { BarChart3, MousePointerClick, Users, Globe, Compass, Laptop } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#a855f7', '#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/urls/dashboard/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load global analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Global Analytics</h1>
        <p className="text-muted-foreground">Aggregate link traffic statistics across all shortened URLs.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard title="Total Clicks" value={analytics?.totalClicks || 0} icon={MousePointerClick} description="Total redirection counts" />
        <StatsCard title="Unique Visitors" value={analytics?.uniqueVisitors || 0} icon={Users} description="Unique device IP counts" />
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Daily Clicks Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {analytics?.clickTrend && analytics.clickTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.clickTrend}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="clicks" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No redirection traffic.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browser breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Browser Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {analytics?.browserDistribution && analytics.browserDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.browserDistribution}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {analytics.browserDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {analytics?.deviceDistribution && analytics.deviceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.deviceDistribution}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {analytics.deviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
