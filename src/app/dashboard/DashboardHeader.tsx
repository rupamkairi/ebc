"use client";
import React from "react";
import { BadgeCheck, MapPin, Star } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div
      className="w-full rounded-2xl p-6 shadow-sm border flex justify-between items-center mb-12
                    bg-linear-to-r from-[#ffac68] via-[#afcfff] to-[#3995ff]
                    dark:bg-gray-800 dark:border-gray-700
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800"
    >
      {/* LEFT SIDE TEXT */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-[#003169] dark:text-white">
          Namaste, Ramesh Sharma Ji 👋
        </h1>

        <p className="mt-1 text-gray-700 dark:text-gray-300">
          Aapka Business Ab Online — Aapke Sheher Mein!
        </p>

        {/* BADGES */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            Verified Seller
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
            <MapPin className="w-4 h-4 text-blue-600" />
            Service Area: 110001
          </div>

          {/* Uncomment if rating needed */}
          {/* <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
            <Star className="w-4 h-4 text-yellow-500" />
            4.3 Rating
          </div> */}
        </div>
      </div>

      {/* RIGHT SIDE CIRCLES */}
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-600"></div>
        <div className="absolute inset-3 rounded-full border-2 border-gray-200 dark:border-gray-600"></div>
        <div className="absolute inset-8 rounded-full border-2 border-gray-200 dark:border-gray-600"></div>
      </div>
    </div>
  );
}
