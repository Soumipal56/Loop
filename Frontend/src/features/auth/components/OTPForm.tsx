import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const OTPForm = () => {
  const { verify, resend, isLoading, error, otpEmail } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!otpEmail) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verify({ email: otpEmail, otp });
      navigate('/dashboard');
    } catch (err) {
      // Error handled by redux
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    try {
      await resend({ email: otpEmail });
      setTimeLeft(300); // Reset timer to 5 minutes
      setOtp(''); // Clear old OTP input
    } catch (err) {
      // Error handled by redux
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-[400px] shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verification</CardTitle>
          <CardDescription>Enter the 6-digit OTP sent to {otpEmail}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input 
                id="otp" 
                type="text" 
                placeholder="123456" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="text-center tracking-widest text-lg"
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {timeLeft > 0 ? (
              <p className="text-slate-500">
                OTP will expire in <span className="font-semibold text-primary">{formatTime(timeLeft)}</span> mins
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-red-500 font-medium">OTP has expired</p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  Resend OTP
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
