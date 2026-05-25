import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Url, AnalyticsSummary } from '../../types';
import { QrCodePreview } from '../../components/QrCodePreview';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ChevronLeft, BarChart3, Clock, Globe, Compass, Terminal, Trash2, Edit } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

export const LinkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<Url | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [error, setError] = useState('');

  const COLORS = ['#a855f7', '#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444'];

  const fetchDetails = async () => {
    try {
      const [linkRes, analyticsRes] = await Promise.all([
        api.get(`/urls/${id}`),
        api.get(`/urls/${id}/analytics`)
      ]);
      setLink(linkRes.data);
      setEditUrl(linkRes.data.originalUrl);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to load link details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.put(`/urls/${id}`, { originalUrl: editUrl });
      setLink(res.data);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update URL');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await api.delete(`/urls/${id}`);
        navigate('/dashboard/links');
      } catch (err) {
        console.error('Failed to delete URL', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!link) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button variant="ghost" className="flex items-center space-x-2 self-start" onClick={() => navigate('/dashboard/links')}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Links</span>
        </Button>
        <Button variant="destructive" className="flex items-center space-x-2" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          <span>Delete Link</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* URL details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">URL Information</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
                <Edit className="h-4 w-4 mr-2" />
                {editing ? 'Cancel' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent>
              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  {error && <div className="text-sm text-rose-400">{error}</div>}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Original URL</label>
                    <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} required />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase font-bold">Short URL</h4>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-primary hover:underline">
                      {link.shortUrl}
                    </a>
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground uppercase font-bold">Original URL</h4>
                    <p className="text-foreground break-all">{link.originalUrl}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase font-bold">Clicks</h4>
                      <p className="text-2xl font-bold">{link.totalClicks}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase font-bold">Safety Level</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        link.riskLevel === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' :
                        link.riskLevel === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {link.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Click performance chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Click Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
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
                  No clicks registered yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* QR Preview & Distribution charts */}
        <div className="space-y-6">
          {link.qrCodeData && (
            <QrCodePreview qrCodeData={link.qrCodeData} shortCode={link.shortCode} />
          )}

          {/* Browser Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Browsers</CardTitle>
            </CardHeader>
            <CardContent className="h-44">
              {analytics?.browserDistribution && analytics.browserDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.browserDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}>
                      {analytics.browserDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No data.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
