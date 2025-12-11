"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import TopNavbar from "./TopNavbar";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow-md p-4 z-40 dark:bg-gray-900 dark:border-r">
        <h2 className="text-xl font-semibold mb-6">Seller Dashboard</h2>

        <nav className="space-y-3">
          <Link href="/dashboard/dashboardhome">
            <Button
              className={`w-full justify-start text-[22px] ${
                pathname === "/dashboard/dashboardhome"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-transparent text-gray-600 hover:bg-gray-700 dark:text-gray-50"
              }`}
            >
              Dashboard
            </Button>
          </Link>

          <Link href="/dashboard/leadsInquiriespage">
            <Button
              className={`w-full justify-start ${
                pathname === "/dashboard/leadsInquiriespage"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-transparent text-gray-600 hover:bg-gray-700 dark:text-gray-50"
              }`}
            >
              Leads & Inquiries
            </Button>
          </Link>

          <Link href="/dashboard/businessprofilepage">
            <Button
              className={`w-full justify-start ${
                pathname === "/dashboard/businessprofilepage"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-transparent text-gray-600 hover:bg-gray-700 dark:text-gray-50"
              }`}
            >
              Business Profile
            </Button>
          </Link>
        </nav>
      </aside>

      {/* ---------- RIGHT SIDE AREA ---------- */}
      <div className="ml-64 flex-1">
        {/* ---------- FIXED TOP NAV ---------- */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-white z-30 shadow-sm flex items-center px-4 dark:bg-gray-900 dark:border-b">
          <TopNavbar />
        </div>

        {/* ---------- MAIN CONTENT (SCROLLABLE) ---------- */}
        <main className="mt-15 p-6 min-h-screen bg-linear-to-br from-[#e5f2ff] via-[#e5f2ff] to-[#ffe9d6] dark:bg-black dark:from-black dark:via-black dark:to-black">
          {children}
        </main>
      </div>
    </div>
  );
}
