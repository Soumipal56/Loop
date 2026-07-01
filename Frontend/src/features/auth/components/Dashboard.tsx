import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { BookOpen } from 'lucide-react';

export const Dashboard = () => {
  const { user, fetchUser, logout, isAuthenticated } = useAuth();
  const { enrolledCourses, getDashboardCourses, isLoading: isCoursesLoading, error: coursesError } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getDashboardCourses();
    }
  }, [isAuthenticated, getDashboardCourses]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-background">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 space-y-12 px-4 md:px-8">
      {/* Profile Overview */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="flex-1 shadow-md border-t-4 border-t-primary w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-xl">Welcome back, <span className="font-bold text-primary">{user.username}</span>!</h2>
              <div className="bg-muted p-4 md:p-6 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-3 border-b border-border pb-2">Your Profile Details</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong className="w-16 inline-block text-foreground">Email:</strong> {user.email}</p>
                  <p><strong className="w-16 inline-block text-foreground">ID:</strong> <span className="font-mono text-sm">{user._id}</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
        </div>
        
        {isCoursesLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
        ) : coursesError ? (
          <Card className="p-12 text-center border-dashed">
            <h3 className="text-xl font-semibold mb-2 text-destructive">Failed to load courses</h3>
            <p className="text-muted-foreground">{coursesError}</p>
          </Card>
        ) : enrolledCourses.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <h3 className="text-xl font-semibold mb-2">You aren't enrolled in any courses yet.</h3>
            <p className="text-muted-foreground mb-6">Browse our catalog to start learning!</p>
            <Button asChild>
              <Link to="/courses">Explore Catalog</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: any) => (
              <Card key={course.enrollmentId} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.courseTitle}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.courseDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(course.progress)}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {course.completedLessons} of {course.totalLessons} lessons complete
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to={`/courses/${course.courseId}`}>Continue Learning</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
