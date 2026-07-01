import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2, Lock, PlayCircle, BookOpen, Clock, Users,
} from 'lucide-react';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentCourse, isLoading: isCourseLoading, error, isEnrolled,
    getCourseById, checkout, verifyEnrollment, resetCurrentCourse,
  } = useCourses();
  const { user, fetchUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchParams] = [new URLSearchParams(window.location.search)];
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      fetchUser().catch(() => {});
    }
  }, [isAuthenticated, fetchUser]);

  React.useEffect(() => {
    if (id) {
      getCourseById(id);
      if (user) verifyEnrollment(id);
    }
    return () => { resetCurrentCourse(); };
  }, [id, user]);

  React.useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessModal(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleEnrollClick = async () => {
    if (!user) { navigate('/login'); return; }
    if (id) {
      try {
        const url = await checkout(id);
        if (url) window.location.href = url as string;
      } catch (err) {
        console.error('Checkout failed', err);
      }
    }
  };

  // Skeleton loading
  if (isCourseLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-white border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_280px] gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-40 mt-4" />
            </div>
            <Skeleton className="h-44 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-center p-8">
        <p className="text-destructive font-medium text-lg mb-4">{error || 'Course not found'}</p>
        <Button onClick={() => navigate('/courses')} variant="outline" size="sm">Back to Catalogue</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_280px] gap-8 items-start">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-0 font-medium">
              Course
            </Badge>
            <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
              {currentCourse.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl">
              {currentCourse.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {currentCourse.chapters?.reduce((acc: number, ch: any) => acc + (ch.lessons?.length || 0), 0)} lessons
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Enrolled students
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl font-bold text-foreground">
                {currentCourse.price === 0 ? 'Free' : `₹${currentCourse.price}`}
              </span>
              {isEnrolled ? (
                <Button asChild>
                  <Link to={currentCourse.chapters[0]?.lessons[0]
                    ? `/courses/${currentCourse._id}/lessons/${currentCourse.chapters[0].lessons[0]._id}`
                    : '#'
                  }>
                    <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning
                  </Link>
                </Button>
              ) : (
                <Button onClick={handleEnrollClick}>
                  {!user ? 'Login to Enroll' : `Enroll Now`}
                </Button>
              )}
            </div>
          </div>

          {/* Stats card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">This course includes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { icon: BookOpen, label: `${currentCourse.chapters?.length || 0} chapters` },
                { icon: Clock, label: 'On-demand video lessons' },
                { icon: Users, label: 'Community access' },
                { icon: CheckCircle2, label: 'Certificate of completion' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-muted-foreground">
                  <Icon className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                  {label}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Course Curriculum</h2>
        <Card className="border-border shadow-none overflow-hidden">
          <Accordion type="multiple" defaultValue={[currentCourse.chapters?.[0]?._id]} className="w-full">
            {currentCourse.chapters.map((chapter: any) => (
              <AccordionItem key={chapter._id} value={chapter._id} className="border-border px-4">
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:text-primary hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-muted-foreground text-xs font-normal">Ch. {chapter.order}</span>
                    {chapter.title}
                  </div>
                  <span className="ml-auto mr-2 text-xs font-normal text-muted-foreground">
                    {chapter.lessons?.length || 0} lessons
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <ul className="space-y-0.5">
                    {chapter.lessons.map((lesson: any) => (
                      <li key={lesson._id}>
                        {isEnrolled ? (
                          <Link
                            to={`/courses/${currentCourse._id}/lessons/${lesson._id}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <PlayCircle className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
                            <span className="text-sm text-foreground/80 flex-1">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">{lesson.duration}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-3 py-2.5 opacity-50 cursor-not-allowed">
                            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground/70 flex-1">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">{lesson.duration}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-card border border-border shadow-2xl">
            <div className="flex flex-col items-center p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" strokeWidth={2} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold tracking-tight">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  You are now enrolled in <span className="font-medium text-foreground">{currentCourse.title}</span>.
                </p>
              </div>
              <Button className="w-full" onClick={() => setShowSuccessModal(false)}>
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
