import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
          <TrendingUp className="w-3 h-3" /> 100,000+ learners and counting
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
          Learn skills that matter,<br />
          <span className="text-indigo-600">at your own pace</span>
        </h1>
        <p className="text-zinc-500 text-lg leading-relaxed max-w-xl mx-auto mb-8">
          Expert-led courses in development, design, and more. Join thousands of learners building real skills with Learnify.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-8">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Feature row */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: BookOpen, title: "100+ Courses", desc: "From web dev to design to data science — all in one place." },
          { icon: GraduationCap, title: "Expert Instructors", desc: "Learn from industry professionals who do what they teach." },
          { icon: TrendingUp, title: "Track Progress", desc: "Your personal dashboard shows exactly where you are and what's next." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white border border-zinc-100 rounded-xl p-6 shadow-none hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <Icon className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-zinc-800 mb-1">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
