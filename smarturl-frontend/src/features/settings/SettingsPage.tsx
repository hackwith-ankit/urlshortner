import React, { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import api from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Settings, ShieldCheck, Mail, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSubmitting(true);
    try {
      const res = await api.put('/user/profile', {
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      updateUser(res.data);
      setSuccess('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Modify your profile details and developer account credentials.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-sm text-emerald-400">
                {success}
              </div>
            )}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-sm text-rose-400">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email (Cannot be modified)</label>
              <Input type="email" value={user?.email} disabled />
            </div>

            <hr className="border-border my-6" />

            <h4 className="font-semibold text-sm text-foreground flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span>Change Password</span>
            </h4>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Password</label>
              <Input
                type="password"
                placeholder="Required for password updates"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
