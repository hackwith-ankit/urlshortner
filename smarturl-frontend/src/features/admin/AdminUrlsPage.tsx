import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Url } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ShieldAlert, RefreshCw, Trash2, Search, ExternalLink } from 'lucide-react';

export const AdminUrlsPage: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/urls?search=${search}`);
      setUrls(res.data || []);
    } catch (err) {
      console.error('Failed to fetch URLs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this URL globally from the system?')) {
      try {
        await api.delete(`/admin/urls/${id}`);
        setUrls(urls.filter(u => u.id !== id));
      } catch (err) {
        console.error('Failed to delete URL', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Global Links Administration</h1>
          <p className="text-muted-foreground">Monitor and manage all shortened URLs globally across all users.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchUrls} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Filter and search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search all original URLs or short codes..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/40 text-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4 rounded-l-lg">ID</th>
                  <th className="p-4">Short Code</th>
                  <th className="p-4">Original URL</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {urls.length > 0 ? (
                  urls.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-4 text-foreground font-semibold">{u.id}</td>
                      <td className="p-4 font-semibold text-foreground">
                        <a href={u.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1">
                          <span>{u.shortCode}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="p-4 truncate max-w-sm">{u.originalUrl}</td>
                      <td className="p-4 text-foreground font-semibold">{u.totalClicks}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          u.riskLevel === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' :
                          u.riskLevel === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {u.riskLevel}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-300" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      No URLs found.
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
