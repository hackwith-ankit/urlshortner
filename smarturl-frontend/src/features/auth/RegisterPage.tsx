import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Link2, Mail, Lock, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto p-3 bg-primary rounded-lg text-primary-foreground w-fit">
            <Link2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Create your Account</CardTitle>
          <CardDescription>Enter details to register your SmartURL developer account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-md text-sm text-destructive text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Full Name</span>
              </label>
              <Input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-2" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <span>
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Login
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};
