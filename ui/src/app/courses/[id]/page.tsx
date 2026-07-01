"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/navbar";
import { CheckCircle2, Lock, BookOpen, Clock, Users, PlayCircle } from "lucide-react";
import { toast } from "sonner";

const isEnrolled = false;
const isGuest = false;

const COURSE = {
  id: "1",
  title: "The Complete React Developer in 2024",
  description: "Learn React, Hooks, Redux, React Router, Webpack, Next.js and more! This course is your ultimate shortcut — the most comprehensive React course available, updated for 2024.",
  price: 89,
  students: 48239,
  totalLessons: 64,
  duration: "28h",
  thumbnail: "bg-gradient-to-br from-blue-100 to-indigo-100",
  chapters: [
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
        { id: "l6", title: "Component Composition", duration: "14:30", completed: false },
      ],
    },
    {
      id: "c3", title: "State & Lifecycle", lessons: [
        { id: "l7", title: "useState Hook", duration: "10:18", completed: false },
        { id: "l8", title: "useEffect Hook", duration: "13:50", completed: false },
        { id: "l9", title: "Custom Hooks", duration: "16:22", completed: false },
      ],
    },
  ],
};

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-36 mt-4" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const isLoading = false;

  if (isLoading) return <DetailSkeleton />;

  const handleEnroll = () => {
    setEnrolled(true);
    toast.success("Enrolled successfully!", { description: `Welcome to "${COURSE.title}"` });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-0 font-medium">
              React Development
            </Badge>
            <h1 className="text-3xl font-bold text-zinc-900 leading-tight tracking-tight">
              {COURSE.title}
            </h1>
            <p className="text-zinc-500 leading-relaxed max-w-xl">
              {COURSE.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{COURSE.students.toLocaleString()} students</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{COURSE.totalLessons} lessons</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{COURSE.duration}</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl font-bold text-zinc-900">${COURSE.price}</span>
              {isGuest ? (
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                  <Link href="/login">Login to Enroll</Link>
                </Button>
              ) : enrolled ? (
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                  <Link href={`/courses/${COURSE.id}/lessons/${COURSE.chapters[0].lessons[0].id}`}>
                    <PlayCircle className="w-4 h-4 mr-2" /> Continue Learning
                  </Link>
                </Button>
              ) : (
                <Button onClick={handleEnroll} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                  Enroll Now — ${COURSE.price}
                </Button>
              )}
            </div>
          </div>

          {/* Stats card */}
          <Card className="border-zinc-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-zinc-700">Course includes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { icon: Clock, label: `${COURSE.duration} of on-demand video` },
                { icon: BookOpen, label: `${COURSE.totalLessons} lessons across ${COURSE.chapters.length} chapters` },
                { icon: Users, label: `${COURSE.students.toLocaleString()} enrolled students` },
                { icon: CheckCircle2, label: "Certificate of completion" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-zinc-600">
                  <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                  {label}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Course Curriculum</h2>
        <Card className="border-zinc-100 shadow-none overflow-hidden">
          <Accordion type="multiple" defaultValue={["c1"]} className="w-full">
            {COURSE.chapters.map((chapter) => (
              <AccordionItem key={chapter.id} value={chapter.id} className="border-zinc-100 px-4">
                <AccordionTrigger className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:no-underline py-4">
                  {chapter.title}
                  <span className="ml-auto mr-2 text-xs font-normal text-zinc-400">
                    {chapter.lessons.length} lessons
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <ul className="space-y-1">
                    {chapter.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        {enrolled ? (
                          <Link
                            href={`/courses/${COURSE.id}/lessons/${lesson.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                          >
                            {lesson.completed
                              ? <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                              : <PlayCircle className="w-4 h-4 text-zinc-300 group-hover:text-zinc-400 shrink-0 transition-colors" />
                            }
                            <span className={`text-sm flex-1 ${lesson.completed ? "text-zinc-500 line-through" : "text-zinc-700"}`}>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-zinc-400 tabular-nums">{lesson.duration}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 px-3 py-2.5 opacity-60 cursor-not-allowed">
                            <Lock className="w-4 h-4 text-zinc-300 shrink-0" />
                            <span className="text-sm text-zinc-500 flex-1">{lesson.title}</span>
                            <span className="text-xs text-zinc-400 tabular-nums">{lesson.duration}</span>
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
    </div>
  );
}
