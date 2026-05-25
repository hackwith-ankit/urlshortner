import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { DashboardHome } from './DashboardHome';
import { LinksPage } from '../links/LinksPage';
import { CreateLinkPage } from '../links/CreateLinkPage';
import { LinkDetailPage } from '../links/LinkDetailPage';
import { AnalyticsPage } from '../analytics/AnalyticsPage';
import { SettingsPage } from '../settings/SettingsPage';
import { AdminUsersPage } from '../admin/AdminUsersPage';
import { AdminUrlsPage } from '../admin/AdminUrlsPage';
import { AdminStatsPage } from '../admin/AdminStatsPage';
import { useAuth } from '../../hooks/use-auth';

export const DashboardLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/links/new" element={<CreateLinkPage />} />
          <Route path="/links/:id" element={<LinkDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Admin routes */}
          {user.role === 'ADMIN' && (
            <>
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/urls" element={<AdminUrlsPage />} />
              <Route path="/admin/stats" element={<AdminStatsPage />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};
