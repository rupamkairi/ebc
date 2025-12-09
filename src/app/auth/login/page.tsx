// src/app/(auth)/login/page.tsx
"use client";
import React from "react";
import PhoneLogin from "@/components/auth/PhoneLogin";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-4">EBC Marketplace</h1>
            <p className="mb-6">
              Aapka Business, Ab Online & Smart! — Login to manage leads &
              quotations.
            </p>
            <ul className="space-y-3">
              <li>• Naye Buyer RFQs</li>
              <li>• Price Quote bhejein</li>
              <li>• Manage Product Catalog</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mt-2">
              Login to your EBC Account
            </h2>
            <p className="text-sm text-gray-500">
              Use your phone number to receive OTP
            </p>
          </div>

          <PhoneLogin />
        </div>
      </div>
    </div>
  );
}
