import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useTheme } from '../hooks/use-theme';
import { 
  LayoutDashboard, 
  Link2, 
  BarChart3, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Users, 
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/links', label: 'My Links', icon: Link2 },
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/dashboard/admin/users', label: 'Users', icon: Users },
    { to: '/dashboard/admin/urls', label: 'All Links', icon: Link2 },
    { to: '/dashboard/admin/stats', label: 'System Stats', icon: ShieldAlert },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Link2 className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">SmartURL</span>
          </div>

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-sm text-foreground truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Menu
            </span>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                end={link.to === '/dashboard'}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}

            {/* Admin Links */}
            {user?.role === 'ADMIN' && (
              <>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-2 px-3">
                  Admin Panel
                </span>
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start space-x-3" 
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </>
            )}
          </Button>

          <Button 
            variant="destructive" 
            className="w-full justify-start space-x-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};
