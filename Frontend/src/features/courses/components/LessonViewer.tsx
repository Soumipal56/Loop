import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, PlayCircle } from 'lucide-react';

export const LessonViewer = () => {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { currentLesson, isLessonCompleted, isLoading, error, getLesson, markComplete } = useCourses();

  useEffect(() => {
    if (courseId && lessonId) {
      getLesson(courseId, lessonId);
    }
  }, [courseId, lessonId, getLesson]);

  const handleMarkComplete = async () => {
    if (courseId && lessonId) {
      try {
        await markComplete(courseId, lessonId);
      } catch (err) {
        console.error('Failed to mark complete', err);
      }
    }
  };

  if (isLoading && !currentLesson) {
    return <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-background">Loading lesson...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center max-w-2xl py-24">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!currentLesson) return null;

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-6">
      <Button variant="ghost" className="mb-2 hover:bg-secondary/50" asChild>
        <Link to={`/courses/${courseId}`}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Course
        </Link>
      </Button>

      <Card className="shadow-lg border-t-4 border-t-primary bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">{currentLesson.title}</CardTitle>
              {currentLesson.duration && (
                <p className="text-muted-foreground mt-2 flex items-center">
                  <PlayCircle className="w-4 h-4 mr-2" /> 
                  Duration: {currentLesson.duration}
                </p>
              )}
            </div>
            {isLessonCompleted && (
              <div className="flex items-center text-green-500 font-semibold bg-green-500/10 px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-4">
          {currentLesson.videoUrl ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/90 flex items-center justify-center shadow-inner border border-border">
              {/* Fallback to simple video tag if it's an mp4, otherwise a more complex player might be needed */}
              <video 
                src={currentLesson.videoUrl} 
                controls 
                className="w-full h-full object-contain"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-xl bg-muted/30 border border-dashed flex flex-col items-center justify-center text-muted-foreground">
              <PlayCircle className="w-12 h-12 mb-4 opacity-20" />
              <p>No video available for this lesson.</p>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none bg-muted/20 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Lesson Notes</h3>
            <p className="text-muted-foreground">Watch the video above to complete this lesson.</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-6 pb-6 border-t bg-muted/10 rounded-b-xl">
          <Button 
            size="lg" 
            onClick={handleMarkComplete} 
            disabled={isLessonCompleted || isLoading}
            className={`transition-all duration-300 shadow-md ${isLessonCompleted ? "bg-green-600 text-white hover:bg-green-700 opacity-100 disabled:opacity-100" : "hover:scale-105"}`}
          >
            {isLessonCompleted ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 animate-in zoom-in" />
                Completed
              </>
            ) : isLoading ? (
              'Processing...'
            ) : (
              'Mark as Complete'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
