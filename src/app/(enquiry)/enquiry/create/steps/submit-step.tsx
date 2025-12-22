"use client";

import { useEnquiryStore } from "../../store/enquiry-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { StyledCard } from "@/components/ui/styled-card";

export function SubmitStep() {
  const { buyerDetails, resetEnquiry } = useEnquiryStore();
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  // Mock checking session
  const activeSession = false;

  const handleSendOtp = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setShowOtp(true);
    toast.success(`OTP sent to ${buyerDetails.phone}`);
  };

  const handleSubmit = async () => {
    if (showOtp && otp.length !== 6) {
      toast.error("Please enter valid OTP");
      return;
    }

    setLoading(true);
    // Simulate Submit API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);

    toast.success("Enquiry Submitted Successfully!");
    resetEnquiry();
    // Navigate to list or details. For now, navigate to list.
    router.push("/enquiry");
  };

  useEffect(() => {
    if (!activeSession && !showOtp) {
      // Auto trigger OTP flow or just show button
    }
  }, [activeSession, showOtp]);

  return (
    <div className="max-w-md mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StyledCard
        title="Finalize Submission"
        description={
          activeSession
            ? "Ready to submit your enquiry?"
            : "Verify your number to submit securely."
        }
        icon={ShieldCheck}
        headerClassName="bg-gradient-to-r from-indigo-600 to-indigo-500"
        className="border-none shadow-xl"
      >
        <div className="space-y-6">
          {!activeSession && !showOtp && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-6 rounded-xl text-center border border-muted">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Verification Code will be sent to
                </p>
                <p className="font-black text-2xl tracking-wide text-primary">
                  {buyerDetails.phone}
                </p>
                <p className="text-xs text-muted-foreground mt-2 bg-primary/5 inline-block px-2 py-1 rounded">
                  Secure Account Creation
                </p>
              </div>
              <Button
                onClick={handleSendOtp}
                className="w-full font-bold py-6 text-lg"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Send OTP
              </Button>
            </div>
          )}

          {!activeSession && showOtp && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-center space-y-4 w-full">
                <Label htmlFor="otp" className="text-muted-foreground">
                  Enter 6-digit Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className="h-12 w-10 md:w-12 border-primary/20"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-12 w-10 md:w-12 border-primary/20"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-12 w-10 md:w-12 border-primary/20"
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={3}
                        className="h-12 w-10 md:w-12 border-primary/20"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-12 w-10 md:w-12 border-primary/20"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-12 w-10 md:w-12 border-primary/20"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p
                  className="text-xs text-primary font-bold cursor-pointer hover:underline"
                  onClick={handleSendOtp}
                >
                  Resend OTP
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full font-bold py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 size-4" />
                )}
                Verify & Submit
              </Button>
            </div>
          )}

          {activeSession && (
            <Button
              onClick={handleSubmit}
              className="w-full font-bold py-6 text-lg"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                "Submit Enquiry"
              )}
            </Button>
          )}
        </div>
      </StyledCard>
    </div>
  );
}
