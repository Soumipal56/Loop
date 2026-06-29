import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu } from 'lucide-react';

export const Sidebar = ({ isOpen = true, toggleSidebar }: { isOpen?: boolean; toggleSidebar?: () => void }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { courses, getCourses } = useCourses();
  const location = useLocation();

  useEffect(() => {
    if (courses.length === 0) {
      getCourses();
    }
  }, [courses.length]);

  const handleLogout = async () => {
    await logout();
    // Redirect handled by App or Auth components usually, or we can just let Redux handle it
  };

  const navItems = [
    { name: 'Browse Courses', path: '/courses', icon: '📚' },
    { name: 'Dashboard', path: '/dashboard', icon: '🎛️' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 border-r border-border bg-card/50 backdrop-blur-md flex flex-col transition-all duration-300 z-40 ${
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-16 md:translate-x-0 overflow-hidden'
      }`}
    >
      <div className={`py-4 md:py-6 flex-grow flex flex-col min-h-0 w-full transition-all duration-300 ${isOpen ? 'px-4 md:px-6' : 'px-2'}`}>
        <div className={`flex items-center mb-4 shrink-0 transition-all duration-300 ${isOpen ? 'justify-between pr-4 md:pr-6' : 'justify-center'}`}>
          <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
            Main Menu
          </h3>
          {toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex text-muted-foreground hover:text-foreground shrink-0">
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
        <nav className="space-y-2 mb-8 shrink-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                asChild
                className={`w-full whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'justify-start px-4' : 'justify-center px-0'} ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Link to={item.path} className="flex items-center">
                  <span className={`${isOpen ? 'mr-3' : 'mr-0'} shrink-0`}>{item.icon}</span>
                  <span className={`transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {item.name}
                  </span>
                </Link>
              </Button>
            );
          })}
        </nav>

        <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 shrink-0 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Course Catalog
        </h3>
        
        <ScrollArea className={`flex-grow pr-4 -mr-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="space-y-1">
            {courses.map((course) => {
              const isActive = location.pathname === `/courses/${course._id}`;
              return (
                <Button
                  key={course._id}
                  variant="ghost"
                  asChild
                  className={`w-full h-auto py-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'justify-start text-left px-4' : 'justify-center px-0'} ${
                    isActive 
                      ? 'bg-primary/5 text-primary border-l-2 border-primary rounded-none' 
                      : 'text-muted-foreground hover:text-foreground border-l-2 border-transparent rounded-none'
                  }`}
                >
                  <Link to={`/courses/${course._id}`} className="flex items-center w-full">
                    {!isOpen && <span className="font-bold text-lg mx-auto">{course.title.charAt(0)}</span>}
                    <span className={`line-clamp-2 text-sm leading-snug transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                      {course.title}
                    </span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className={`p-4 md:p-6 border-t border-border w-full transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-muted-foreground border-border" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center mb-2">Join us to enroll in courses!</p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
              <Link to="/register">Register</Link>
            </Button>
            <Button variant="outline" asChild className="w-full border-border">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
