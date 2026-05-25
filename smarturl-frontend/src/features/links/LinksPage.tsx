import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Url } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Plus, Search, ExternalLink, RefreshCw, Trash2, Eye } from 'lucide-react';

export const LinksPage: React.FC = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/urls?page=${page}&size=10&search=${search}`);
      setLinks(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load links', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [page, search]);

  const handleToggleActive = async (id: number) => {
    try {
      const res = await api.patch(`/urls/${id}/toggle`);
      setLinks(links.map(l => l.id === id ? { ...l, isActive: res.data.isActive } : l));
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await api.delete(`/urls/${id}`);
        setLinks(links.filter(l => l.id !== id));
      } catch (err) {
        console.error('Failed to delete link', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Links</h1>
          <p className="text-muted-foreground">Detailed catalog of all active and inactive shortened URLs.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/links/new')} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Shorten Link</span>
        </Button>
      </div>

      {/* Filtering and Actions */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search links..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchLinks} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardContent>
      </Card>

      {/* Links List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/40 text-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4 rounded-l-lg">Short URL</th>
                  <th className="p-4">Original URL</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Safety</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {links.length > 0 ? (
                  links.map((link) => (
                    <tr key={link.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground">
                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1.5">
                          <span>{link.shortCode}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                      </td>
                      <td className="p-4 truncate max-w-sm">{link.originalUrl}</td>
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
                        <button
                          onClick={() => handleToggleActive(link.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                            link.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                          }`}
                        >
                          {link.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/links/${link.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-300" onClick={() => handleDelete(link.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      {loading ? 'Loading links...' : 'No shortened links found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
