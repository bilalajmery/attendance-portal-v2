import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { LogOut, LayoutDashboard, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const EmployeeLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Attendance Portal</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {profile?.name || 'Employee'}
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Link to="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={isActive('/dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/calendar">
              <Button
                variant={isActive('/calendar') ? 'default' : 'ghost'}
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={isActive('/calendar')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
