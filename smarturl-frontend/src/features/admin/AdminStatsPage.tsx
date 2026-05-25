import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { BlacklistedDomain } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, Plus, ShieldAlert } from 'lucide-react';

export const AdminStatsPage: React.FC = () => {
  const [blacklist, setBlacklist] = useState<BlacklistedDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBlacklist = async () => {
    try {
      const res = await api.get('/admin/blacklist');
      setBlacklist(res.data);
    } catch (err) {
      console.error('Failed to load blacklist', err);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/blacklist', {
        domain: newDomain,
        reason
      });
      setBlacklist([res.data, ...blacklist]);
      setNewDomain('');
      setReason('');
      setSuccess('Domain blacklisted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to blacklist domain');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/blacklist/${id}`);
      setBlacklist(blacklist.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete blacklist entry', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Domain Blacklist Manager</h1>
        <p className="text-muted-foreground">Manage target domains explicitly blocked from being shortened by users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Add domain form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Blocked Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                {error && <div className="text-sm text-rose-400">{error}</div>}
                {success && <div className="text-sm text-emerald-400">{success}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Domain Name</label>
                  <Input
                    type="text"
                    required
                    placeholder="bad-site.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Reason</label>
                  <Input
                    type="text"
                    required
                    placeholder="Malware distribution"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Block Domain</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Blacklist catalog */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                <span>Blocked Domains Checklist</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-sm text-muted-foreground">
                  <thead className="bg-secondary/40 text-foreground text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-3 rounded-l-lg">Domain</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3 rounded-r-lg text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {blacklist.length > 0 ? (
                      blacklist.map((item) => (
                        <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="p-3 font-semibold text-foreground">{item.domain}</td>
                          <td className="p-3 truncate max-w-[150px]">{item.reason}</td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="icon" className="text-rose-400 hover:text-rose-300" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-6">
                          No blacklisted domains.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
