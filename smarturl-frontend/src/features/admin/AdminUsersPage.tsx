import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { User } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, Shield, RefreshCw } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
      fetchUsers(); // reload to get exact state
    } catch (err) {
      console.error('Failed to toggle active status', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">User Administration</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and status parameters.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-secondary/40 text-foreground text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4 rounded-l-lg">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-4 text-foreground font-semibold">{u.id}</td>
                      <td className="p-4 text-foreground font-semibold">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          Toggle Active
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      {loading ? 'Loading users...' : 'No users registered.'}
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
