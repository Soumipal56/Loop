import React, { useEffect } from 'react';
import { useCourses } from '../hooks/useCourses';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const CourseCatalogue = () => {
  const { courses, isLoading, error, getCourses } = useCourses();

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-12 mt-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Course Catalogue
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our premium collection of courses and master new skills.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive font-medium">{error}</p>
            <Button onClick={() => getCourses()} variant="outline" className="mt-4 bg-transparent border-border hover:bg-muted">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course._id} className="flex flex-col shadow-2xl border-border bg-card backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] overflow-hidden">
                <div className="h-48 bg-muted border-b border-border flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-4xl">🎓</span>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                  <CardDescription className="text-muted-foreground/80 line-clamp-2 mt-2">
                    {course.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center space-x-2 text-sm text-foreground/60 font-medium">
                    <span>{course.price === 0 ? 'Free' : `₹${course.price.toFixed(2)}`}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    <Link to={`/courses/${course._id}`}>
                      View Course
                    </Link>
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
