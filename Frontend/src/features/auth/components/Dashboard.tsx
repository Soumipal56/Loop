import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { BookOpen, GraduationCap, LogOut, PlayCircle } from 'lucide-react';

const THUMBNAIL_COLORS = [
  'from-blue-100 to-indigo-100',
  'from-green-100 to-emerald-100',
  'from-pink-100 to-rose-100',
  'from-violet-100 to-purple-100',
  'from-yellow-100 to-amber-100',
  'from-teal-100 to-cyan-100',
];

function DashboardCardSkeleton() {
  return (
    <Card className="border-border shadow-none overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">My Courses</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Welcome back, <span className="font-medium text-foreground">{user.username}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-border text-muted-foreground hidden sm:inline-flex">
              <Link to="/courses">
                <BookOpen className="w-3.5 h-3.5 mr-2" /> Browse more
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Courses grid */}
        {isCoursesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <DashboardCardSkeleton key={i} />)}
          </div>
        ) : coursesError ? (
          <Card className="border-border shadow-none p-12 text-center">
            <p className="text-destructive font-medium">{coursesError}</p>
          </Card>
        ) : enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No courses yet</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">
              Enroll in your first course and start learning today.
            </p>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map((course: any, idx: number) => {
              const pct = Math.round(course.progress ?? 0);
              return (
                <Card key={course.enrollmentId} className="border-border shadow-none hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
                  <div className={`aspect-video w-full bg-gradient-to-br ${THUMBNAIL_COLORS[idx % THUMBNAIL_COLORS.length]} flex items-center justify-center`}>
                    <BookOpen className="w-9 h-9 text-zinc-400/60" />
                  </div>

                  <CardContent className="p-4 space-y-3 flex-1">
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                      {course.courseTitle}
                    </h3>
                    <div className="space-y-1.5">
                      <Progress value={pct} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">
                        {course.completedLessons} of {course.totalLessons} lessons complete
                        <span className="ml-1 text-primary font-medium">({pct}%)</span>
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="px-4 pb-4 pt-0">
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/courses/${course.courseId}`}>
                        <PlayCircle className="w-3.5 h-3.5 mr-2" /> Continue Learning
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
