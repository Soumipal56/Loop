import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Left Side */}
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link to="/courses" className="text-2xl font-bold text-primary tracking-tight">
              Loop
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/courses" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Right Side Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline-block mr-2">
                  Welcome, {user.username}
                </span>
                <Button variant="outline" asChild className="border-border">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-md">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};
