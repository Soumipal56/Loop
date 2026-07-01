import React, { useEffect } from 'react';
import { useCourses } from '../hooks/useCourses';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';

function CourseCardSkeleton() {
  return (
    <Card className="border-border shadow-none overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

const THUMBNAIL_COLORS = [
  'from-blue-100 to-indigo-100',
  'from-green-100 to-emerald-100',
  'from-pink-100 to-rose-100',
  'from-violet-100 to-purple-100',
  'from-yellow-100 to-amber-100',
  'from-teal-100 to-cyan-100',
];

export const CourseCatalogue = () => {
  const { courses, isLoading, error, getCourses } = useCourses();

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">All Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Expand your skills with expert-led lessons
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-medium mb-4">{error}</p>
            <Button onClick={() => getCourses()} variant="outline" size="sm">Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, idx) => (
              <Link to={`/courses/${course._id}`} key={course._id} className="group block">
                <Card className="border-border shadow-none hover:shadow-md transition-all duration-200 overflow-hidden h-full">
                  {/* Thumbnail */}
                  <div className={`aspect-video w-full bg-gradient-to-br ${THUMBNAIL_COLORS[idx % THUMBNAIL_COLORS.length]} flex items-center justify-center`}>
                    <BookOpen className="w-10 h-10 text-zinc-400/60" />
                  </div>

                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground leading-snug text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {course.shortDescription}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> View course
                      </span>
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {course.price === 0 ? 'Free' : `₹${course.price}`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
