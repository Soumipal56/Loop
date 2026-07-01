"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { GithubIcon, BookOpen, ArrowLeft } from "lucide-react";

type AuthStep = "initial" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("initial");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("otp");
    toast.success("Code sent!", { description: `Check ${email} for your 6-digit code.` });
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success("Welcome back!", { description: "You're now signed in." });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4">
      {/* Branding */}
      <Link href="/" className="flex items-center gap-2 mb-8 text-zinc-800 hover:text-indigo-600 transition-colors">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Learnify</span>
      </Link>

      <Card className="w-full max-w-sm shadow-sm border-zinc-200">
        <CardHeader className="space-y-1 pb-4">
          {step === "otp" && (
            <button
              onClick={() => { setStep("initial"); setOtp(""); }}
              className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          )}
          <CardTitle className="text-xl font-semibold">
            {step === "initial" ? "Sign in to Learnify" : "Check your email"}
          </CardTitle>
          <CardDescription className="text-zinc-500">
            {step === "initial"
              ? "Continue to access your courses"
              : `We sent a 6-digit code to ${email}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "initial" ? (
            <>
              {/* GitHub */}
              <Button
                variant="outline"
                className="w-full border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                onClick={() => toast.info("GitHub auth coming soon!")}
              >
                <GithubIcon className="w-4 h-4 mr-2" />
                Continue with GitHub
              </Button>

              <div className="flex items-center gap-3">
                <Separator className="flex-1 bg-zinc-100" />
                <span className="text-xs text-zinc-400 font-medium">or</span>
                <Separator className="flex-1 bg-zinc-100" />
              </div>

              {/* Email */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-zinc-200 focus-visible:ring-indigo-500 focus-visible:border-indigo-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending code…" : "Continue with Email"}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-zinc-200 focus-within:ring-indigo-500" />
                    <InputOTPSlot index={1} className="border-zinc-200 focus-within:ring-indigo-500" />
                    <InputOTPSlot index={2} className="border-zinc-200 focus-within:ring-indigo-500" />
                    <InputOTPSlot index={3} className="border-zinc-200 focus-within:ring-indigo-500" />
                    <InputOTPSlot index={4} className="border-zinc-200 focus-within:ring-indigo-500" />
                    <InputOTPSlot index={5} className="border-zinc-200 focus-within:ring-indigo-500" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? "Verifying…" : "Verify Code"}
              </Button>
              <p className="text-center text-sm text-zinc-500">
                Didn't receive it?{" "}
                <button
                  className="text-indigo-600 hover:underline font-medium"
                  onClick={() => toast.info("Code resent!")}
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          <p className="text-center text-xs text-zinc-400 pt-2">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline hover:text-zinc-600">Terms</Link> and{" "}
            <Link href="#" className="underline hover:text-zinc-600">Privacy Policy</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
