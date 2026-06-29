import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCourse, isLoading: isCourseLoading, error, isEnrolled, getCourseById, enroll, verifyEnrollment, resetCurrentCourse } = useCourses();
  const { user, fetchUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().catch(() => {
        // User is not logged in, ignore
      });
    }
  }, [isAuthenticated, fetchUser]);

  useEffect(() => {
    if (id) {
      getCourseById(id);
      if (user) {
        verifyEnrollment(id);
      }
    }
    return () => {
      resetCurrentCourse();
    };
  }, [id, user]);

  const handleEnrollClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      try {
        await enroll(id);
      } catch (err) {
        console.error('Enrollment failed', err);
      }
    }
  };

  if (isCourseLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="h-12 w-12 rounded-full border-t-2 border-primary animate-spin" />
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-8">
        <p className="text-destructive font-medium text-xl">{error || 'Course not found'}</p>
        <Button onClick={() => navigate('/courses')} variant="outline" className="mt-6 border-border">
          Back to Catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Section */}
      <div className="relative border-b border-border bg-card overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-8 py-16 md:py-24 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/20 mb-4">
            Course
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {currentCourse.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {currentCourse.description}
          </p>
          
          <div className="pt-8 flex items-center space-x-6">
            {isEnrolled ? (
              <Button size="lg" className="px-8 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                Continue learning
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={handleEnrollClick}
                className="px-8 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
              >
                {!user ? 'Log in to Enroll' : `Enroll Now`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-primary">⚡</span> Curriculum
        </h2>
        
        <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <Accordion type="multiple" className="w-full">
            {currentCourse.chapters.map((chapter) => (
              <AccordionItem key={chapter._id} value={chapter._id} className="border-border px-6">
                <AccordionTrigger className="text-lg font-semibold py-6 hover:no-underline hover:text-primary transition-colors">
                  <div className="flex items-center text-left">
                    <span className="text-muted-foreground mr-4 text-sm font-normal">
                      Chapter {chapter.order}
                    </span>
                    {chapter.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <ul className="space-y-3">
                    {chapter.lessons.map((lesson) => (
                      <li 
                        key={lesson._id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                            ▶
                          </div>
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground font-mono">
                          {lesson.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
            </Accordion>
          </div>
        </div>
      </div>
  );
};
