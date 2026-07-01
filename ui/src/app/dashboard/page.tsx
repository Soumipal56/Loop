"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { BookOpen, PlayCircle, User, LogOut, GraduationCap } from "lucide-react";

const ENROLLED = [
  { id: "1", title: "The Complete React Developer in 2024", thumbnail: "bg-gradient-to-br from-blue-100 to-indigo-100", completed: 3, total: 8, lastLesson: "l3" },
  { id: "2", title: "Node.js, Express & MongoDB Bootcamp", thumbnail: "bg-gradient-to-br from-green-100 to-emerald-100", completed: 12, total: 20, lastLesson: "l12" },
  { id: "4", title: "TypeScript: The Complete Developer's Guide", thumbnail: "bg-gradient-to-br from-violet-100 to-purple-100", completed: 0, total: 14, lastLesson: "l1" },
];

function DashboardCardSkeleton() {
  return (
    <Card className="border-zinc-100 shadow-none overflow-hidden">
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

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
        <GraduationCap className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="font-semibold text-zinc-700 mb-1">No courses yet</h3>
      <p className="text-sm text-zinc-500 mb-5 max-w-xs">
        Enroll in your first course and start learning today.
      </p>
      <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
        <Link href="/courses">Browse Courses</Link>
      </Button>
    </div>
  );
}

export default function DashboardPage() {
  const isLoading = false;
  const courses = ENROLLED; // set to [] to see empty state

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">My Courses</h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              {courses.length} course{courses.length !== 1 ? "s" : ""} in progress
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-zinc-200 text-zinc-600 hover:bg-zinc-50 hidden sm:inline-flex">
            <Link href="/courses">
              <BookOpen className="w-3.5 h-3.5 mr-2" /> Browse more
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <DashboardCardSkeleton key={i} />)
          ) : courses.length === 0 ? (
            <EmptyState />
          ) : (
            courses.map((course) => {
              const pct = Math.round((course.completed / course.total) * 100);
              return (
                <Card key={course.id} className="border-zinc-100 shadow-none hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Thumbnail */}
                  <div className={`aspect-video w-full ${course.thumbnail} flex items-center justify-center`}>
                    <BookOpen className="w-9 h-9 text-zinc-400/60" />
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-zinc-800 text-sm leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <Progress value={pct} className="h-1.5 bg-zinc-100 [&>div]:bg-indigo-500" />
                      <p className="text-xs text-zinc-500">
                        {course.completed} of {course.total} lessons complete
                        <span className="ml-1 text-indigo-600 font-medium">({pct}%)</span>
                      </p>
                    </div>

                    <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Link href={`/courses/${course.id}/lessons/${course.lastLesson}`}>
                        <PlayCircle className="w-3.5 h-3.5 mr-2" /> Continue Learning
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
