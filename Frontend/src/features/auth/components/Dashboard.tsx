import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const { user, fetchUser, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().catch(() => navigate('/login'));
    }
  }, [isAuthenticated, fetchUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading || !user) {
    return <div className="flex justify-center items-center h-screen bg-slate-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Card className="max-w-2xl mx-auto shadow-md border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h2 className="text-xl">Welcome back, <span className="font-bold text-primary">{user.username}</span>!</h2>
            <div className="bg-slate-100 p-6 rounded-lg border">
              <h3 className="font-semibold text-slate-700 mb-3 border-b pb-2">Your Profile Details</h3>
              <div className="space-y-2">
                <p><strong className="w-16 inline-block">Email:</strong> {user.email}</p>
                <p><strong className="w-16 inline-block">ID:</strong> <span className="text-slate-500 font-mono text-sm">{user._id}</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
