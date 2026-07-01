"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { BookOpen, Clock } from "lucide-react";

// Mock data
const COURSES = [
  { id: "1", title: "The Complete React Developer in 2024", description: "Learn React, Hooks, Redux, React Router, Webpack, Next.js and more! This is the most comprehensive React course online.", price: 89, badge: "Bestseller", chapters: 8, lessons: 64, duration: "28h", thumbnail: "bg-gradient-to-br from-blue-100 to-indigo-100" },
  { id: "2", title: "Node.js, Express & MongoDB Bootcamp", description: "Master Node by building a real-world RESTful API and web app (with authentication, Node.js security, payments & more).", price: 79, badge: "New", chapters: 12, lessons: 91, duration: "42h", thumbnail: "bg-gradient-to-br from-green-100 to-emerald-100" },
  { id: "3", title: "Advanced CSS and Sass: Flexbox, Grid & More", description: "The most advanced and modern CSS course on the internet: master flexbox, CSS Grid, responsive design, and so much more.", price: 69, badge: null, chapters: 10, lessons: 52, duration: "22h", thumbnail: "bg-gradient-to-br from-pink-100 to-rose-100" },
  { id: "4", title: "TypeScript: The Complete Developer's Guide", description: "Master Typescript by building large projects. Includes React and Express integrations!", price: 84, badge: "Bestseller", chapters: 14, lessons: 110, duration: "35h", thumbnail: "bg-gradient-to-br from-violet-100 to-purple-100" },
  { id: "5", title: "Python Bootcamp: From Beginner to Expert", description: "Learn Python like a professional. Start from the basics and go all the way to creating your own applications and games.", price: 94, badge: null, chapters: 20, lessons: 149, duration: "55h", thumbnail: "bg-gradient-to-br from-yellow-100 to-amber-100" },
  { id: "6", title: "Complete SQL and Databases Bootcamp", description: "Zero to Mastery for all SQL databases: PostgreSQL, MySQL, SQLite, NoSQL + More! Build real-world apps and master SQL.", price: 74, badge: "New", chapters: 11, lessons: 83, duration: "30h", thumbnail: "bg-gradient-to-br from-teal-100 to-cyan-100" },
];

function CourseCardSkeleton() {
  return (
    <Card className="border-zinc-100 shadow-none overflow-hidden">
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

function CourseCard({ course }: { course: typeof COURSES[0] }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <Card className="border-zinc-100 shadow-none hover:shadow-md transition-all duration-200 overflow-hidden h-full">
        {/* Thumbnail */}
        <div className={`aspect-video w-full ${course.thumbnail} flex items-center justify-center relative`}>
          <BookOpen className="w-10 h-10 text-zinc-400/60" />
          {course.badge && (
            <Badge className="absolute top-3 left-3 bg-amber-400 text-amber-900 border-0 text-xs font-semibold hover:bg-amber-400">
              {course.badge}
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-zinc-800 leading-snug text-sm group-hover:text-indigo-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {course.lessons} lessons
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {course.duration}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold text-zinc-700 bg-zinc-100 border-0">
              ${course.price}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CoursesPage() {
  const isLoading = false;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">All Courses</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {COURSES.length} courses · Expand your skills with expert-led lessons
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : COURSES.map((course) => <CourseCard key={course.id} course={course} />)
          }
        </div>
      </main>
    </div>
  );
}
