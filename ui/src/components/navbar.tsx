"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Menu, LogOut, LayoutDashboard, User } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn] = useState(true); // swap with real auth context

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-800 hover:text-indigo-600 transition-colors">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base tracking-tight">Learnify</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">JD</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 shadow-sm border-zinc-100">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-sm">
                  <User className="w-3.5 h-3.5" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-sm text-red-500 focus:text-red-500">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white hidden md:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden w-8 h-8">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-800 mb-8" onClick={() => setOpen(false)}>
                <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                Learnify
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="text-sm font-medium text-zinc-700 hover:text-indigo-600 transition-colors">
                    {l.label}
                  </Link>
                ))}
                {!isLoggedIn && (
                  <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
                    <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
