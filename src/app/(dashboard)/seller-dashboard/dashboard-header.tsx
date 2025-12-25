"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-28">
              <img
                src="/logo.svg"
                alt="E-CON Building Centre"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-semibold text-primary border-b-2 border-primary py-1"
            >
              Home
            </Link>
            <Link
              href="/seller-dashboard/catalog"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              My Catalog
            </Link>
            <Link
              href="/seller-dashboard/enquiries"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Enquiries
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>

        <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 flex items-center gap-2">
          <PhoneCall size={18} />
          <span className="hidden sm:inline">Talk to Support Team</span>
          <span className="sm:hidden">Support</span>
        </Button>
      </div>
    </header>
  );
}
