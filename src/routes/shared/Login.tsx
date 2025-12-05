import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const { user, role, signIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role) {
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'employee') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/access-denied', { replace: true });
      }
    }
  }, [user, role, navigate]);

  const handleSignIn = async () => {
    try {
      await signIn();
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
      console.error('Sign in error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Attendance Portal</CardTitle>
          <CardDescription>
            Sign in with your Google account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSignIn}
            className="w-full h-12 text-base"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Only authorized users can access this portal
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
