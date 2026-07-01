"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Lock, ChevronLeft, ChevronRight, Menu, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const COURSE_ID = "1";
const LESSON_ID = "l3";

const CURRICULUM = [
  {
    id: "c1", title: "Getting Started with React", lessons: [
      { id: "l1", title: "Welcome & Course Overview", duration: "4:30", completed: true },
      { id: "l2", title: "What is React?", duration: "8:12", completed: true },
      { id: "l3", title: "Creating Your First React App", duration: "12:45", completed: false },
    ],
  },
  {
    id: "c2", title: "React Components & Props", lessons: [
      { id: "l4", title: "Understanding Components", duration: "9:22", completed: false },
      { id: "l5", title: "Props Deep Dive", duration: "11:05", completed: false },
    ],
  },
  {
    id: "c3", title: "State & Lifecycle", lessons: [
      { id: "l6", title: "useState Hook", duration: "10:18", completed: false },
      { id: "l7", title: "useEffect Hook", duration: "13:50", completed: false },
    ],
  },
];

const CURRENT_LESSON = {
  id: "l3",
  title: "Creating Your First React App",
  body: `
In this lesson, we'll bootstrap a brand-new React application using Vite — the fastest build tool for modern web development.

## What you'll learn
- How to initialize a project with \`npm create vite@latest\`
- Understanding the project structure
- Running the dev server and seeing React in action

## Getting started

Open your terminal and run the following command:

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

This will create a fully configured React + TypeScript project and start the dev server on **localhost:5173**.

## Project structure breakdown

- **\`src/main.tsx\`** — The entry point that mounts your React tree to the DOM.
- **\`src/App.tsx\`** — Your root component, where the fun begins.
- **\`public/\`** — Static assets served as-is.

Take a moment to explore the files before moving on to the next lesson!
  `,
  prevLesson: "l2",
  nextLesson: "l4",
};

function Sidebar({ currentLessonId, onClose }: { currentLessonId: string; onClose?: () => void }) {
  return (
    <nav className="flex flex-col gap-2 py-4">
      <div className="px-4 pb-2">
        <Link href={`/courses/${COURSE_ID}`} className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" /> Back to course
        </Link>
      </div>
      {CURRICULUM.map((chapter) => (
        <div key={chapter.id} className="px-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1.5">
            {chapter.title}
          </p>
          {chapter.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/courses/${COURSE_ID}/lessons/${lesson.id}`}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                lesson.id === currentLessonId
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {lesson.completed
                ? <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                : lesson.id === currentLessonId
                  ? <Circle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  : <Circle className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
              }
              <span className="flex-1 leading-snug">{lesson.title}</span>
              <span className="text-xs text-zinc-400 tabular-nums">{lesson.duration}</span>
            </Link>
          ))}
          <Separator className="my-2 bg-zinc-100" />
        </div>
      ))}
    </nav>
  );
}

function LessonSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export default function LessonViewerPage() {
  const [completed, setCompleted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoading = false;

  const handleMarkComplete = () => {
    setCompleted(true);
    toast.success("Lesson complete!", {
      description: "Great job! Keep going 🎉",
      icon: <CheckCircle2 className="w-4 h-4 text-indigo-500" />,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 h-14 flex items-center px-4 gap-3">
        {/* Mobile sidebar trigger */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden w-8 h-8">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 overflow-y-auto">
            <Sidebar currentLessonId={LESSON_ID} onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link href={`/courses/${COURSE_ID}`} className="text-sm font-semibold text-zinc-700 hover:text-indigo-600 transition-colors truncate flex-1">
          The Complete React Developer in 2024
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 border-r border-zinc-100 overflow-y-auto shrink-0">
          <Sidebar currentLessonId={LESSON_ID} />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {isLoading ? (
            <LessonSkeleton />
          ) : (
            <article className="max-w-2xl mx-auto px-6 py-8">
              <h1 className="text-2xl font-bold text-zinc-900 mb-6 tracking-tight">
                {CURRENT_LESSON.title}
              </h1>

              {/* Lesson body — prose styled */}
              <div className="prose prose-zinc prose-sm max-w-none leading-relaxed text-zinc-700 space-y-4">
                {CURRENT_LESSON.body.trim().split("\n\n").map((block, i) => {
                  if (block.startsWith("## ")) {
                    return <h2 key={i} className="text-base font-semibold text-zinc-800 mt-6 mb-2">{block.slice(3)}</h2>;
                  }
                  if (block.startsWith("```")) {
                    const code = block.replace(/```bash\n/, "").replace(/```/, "");
                    return (
                      <pre key={i} className="bg-zinc-900 text-zinc-100 rounded-lg px-4 py-3 text-xs overflow-x-auto font-mono">
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  return <p key={i} className="text-sm leading-7 text-zinc-600" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, '<code class="bg-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-800">$1</code>").replace(/\n- /g, "<br/>• ") }} />;
                })}
              </div>

              {/* Mark complete */}
              <div className="mt-10 pt-6 border-t border-zinc-100">
                {completed ? (
                  <Button disabled variant="outline" className="border-zinc-200 text-zinc-400 gap-2">
                    <CheckCheck className="w-4 h-4 text-indigo-500" />
                    Completed
                  </Button>
                ) : (
                  <Button
                    onClick={handleMarkComplete}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Complete
                  </Button>
                )}
              </div>

              {/* Prev / Next nav */}
              <div className="flex items-center justify-between mt-6">
                {CURRENT_LESSON.prevLesson ? (
                  <Button asChild variant="outline" size="sm" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 gap-1">
                    <Link href={`/courses/${COURSE_ID}/lessons/${CURRENT_LESSON.prevLesson}`}>
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Link>
                  </Button>
                ) : <div />}

                {CURRENT_LESSON.nextLesson ? (
                  <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
                    <Link href={`/courses/${COURSE_ID}/lessons/${CURRENT_LESSON.nextLesson}`}>
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : <div />}
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
