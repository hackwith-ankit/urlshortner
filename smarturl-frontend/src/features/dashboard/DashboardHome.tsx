import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { DashboardStats, Url, AnalyticsSummary } from '../../types';
import { StatsCard } from '../../components/StatsCard';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Link2, MousePointerClick, Users, ShieldAlert, ArrowRight, Plus, ExternalLink } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLinks, setRecentLinks] = useState<Url[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, linksRes, analyticsRes] = await Promise.all([
          api.get('/urls/dashboard/stats'),
          api.get('/urls?size=5'),
          api.get('/urls/dashboard/analytics')
        ]);
        setStats(statsRes.data);
        setRecentLinks(linksRes.data.content || []);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Links', value: stats?.totalLinks || 0, icon: Link2, description: 'All shortened URLs' },
    { title: 'Active Links', value: stats?.activeLinks || 0, icon: Link2, description: 'Links receiving traffic' },
    { title: 'Total Clicks', value: stats?.totalClicks || 0, icon: MousePointerClick, description: 'Total clicks redirected' },
    { title: 'Unique Visitors', value: stats?.uniqueVisitors || 0, icon: Users, description: 'Unique device IPs tracked' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your links and monitor redirect analytics in real-time.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/links/new')} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Shorten Link</span>
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <StatsCard key={idx} {...card} />
        ))}
      </div>

      {/* Charts & Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Click Performance (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {analytics?.clickTrend && analytics.clickTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.clickTrend}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No redirection traffic data available yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* System safety status summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security & System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/40 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Spam Blocked</h4>
                  <p className="text-xs text-muted-foreground">High risk links stopped</p>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">{stats?.spamLinksBlocked || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/40 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">QR Codes</h4>
                  <p className="text-xs text-muted-foreground">QR graphics generated</p>
                </div>
              </div>
              <span className="text-xl font-bold text-foreground">{stats?.qrCodesGenerated || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Links Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Links</CardTitle>
          <Link to="/dashboard/links" className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/40 text-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4 rounded-l-lg">Short Link</th>
                  <th className="p-4">Original URL</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentLinks.length > 0 ? (
                  recentLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-semibold text-foreground">
                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1.5">
                          <span>{link.shortCode}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                      </td>
                      <td className="p-4 truncate max-w-xs">{link.originalUrl}</td>
                      <td className="p-4 text-foreground font-semibold">{link.totalClicks}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          link.riskLevel === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' :
                          link.riskLevel === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {link.riskLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/links/${link.id}`)}>
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6">
                      No links shortened yet. Click "Shorten Link" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
