import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../../auth/hooks/useAuth';
import { CheckCircle, X } from 'lucide-react';
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
  const { currentCourse, isLoading: isCourseLoading, error, isEnrolled, getCourseById, checkout, verifyEnrollment, resetCurrentCourse } = useCourses();
  const { user, fetchUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (success === 'true') {
      setShowSuccessModal(true);
      navigate('.', { replace: true });
    }
  }, [success, navigate]);

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
        const url = await checkout(id);
        if (url) {
          window.location.href = url as string;
        }
      } catch (err) {
        console.error('Checkout failed', err);
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
              <Button size="lg" className="px-8 shadow-[0_0_20px_rgba(var(--primary),0.3)]" asChild>
                <Link to={currentCourse.chapters[0]?.lessons[0] ? `/courses/${currentCourse._id}/lessons/${currentCourse.chapters[0].lessons[0]._id}` : '#'}>
                  Continue learning
                </Link>
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
                      isEnrolled ? (
                        <Link 
                          to={`/courses/${currentCourse._id}/lessons/${lesson._id}`} 
                          key={lesson._id}
                          className="block group"
                        >
                          <li className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border group-hover:border-primary/50 group-hover:bg-muted/50 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                ▶
                              </div>
                              <span className="font-medium group-hover:text-primary transition-colors">{lesson.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground font-mono">
                              {lesson.duration}
                            </span>
                          </li>
                        </Link>
                      ) : (
                        <li 
                          key={lesson._id} 
                          className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border opacity-60 cursor-not-allowed"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              🔒
                            </div>
                            <span className="font-medium">{lesson.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground font-mono">
                            {lesson.duration}
                          </span>
                        </li>
                      )
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
            </Accordion>
          </div>
        </div>
        
        {/* Success Modal Overlay */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="absolute right-4 top-4">
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col items-center p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={2.5} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">Payment Successful!</h3>
                  <p className="text-muted-foreground">
                    You are now officially enrolled in <span className="font-medium text-foreground">{currentCourse.title}</span>.
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full font-semibold"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Start Learning
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};
