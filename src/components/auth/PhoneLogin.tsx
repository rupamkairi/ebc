"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function PhoneLogin() {
  const router = useRouter();
  const { sendOtpMutation, verifyOtpMutation } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendOtpMutation.mutateAsync({ phoneNumber: phone });
    setOtpSent(true);
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = await verifyOtpMutation.mutateAsync({
      phoneNumber: phone,
      code: otp,
    });

    if (data?.user) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
      {!otpSent ? (
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <div>
            <label className="text-sm">Phone Number</label>
            <input
              className="w-full border p-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91xxxxxxxxxx"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Send OTP
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <label className="text-sm">Enter OTP</label>
            <input
              className="w-full border p-2 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="xxxxxx"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Verify & Login
          </button>
        </form>
      )}
    </div>
  );
}
