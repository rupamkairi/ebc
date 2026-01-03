"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface OTPVerificationFormProps {
  onVerify: () => void;
}

export function OTPVerificationForm({ onVerify }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (otp === "123456") {
        // Mock OTP
        onVerify();
      } else {
        alert("Invalid OTP. Try 123456");
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your registered mobile number.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Input
            className="text-center text-lg tracking-widest w-40"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
        <div className="text-center text-xs text-muted-foreground">
          Mock OTP is 123456
        </div>
      </CardContent>
    </Card>
  );
}
