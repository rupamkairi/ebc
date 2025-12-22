"use client";

import Link from "next/link";
import { ShoppingBag, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BuyerHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-white"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">
              EBC
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/buyer-dashboard"
              className="text-sm font-semibold text-primary border-b-2 border-primary py-1"
            >
              Dashboard
            </Link>
            <Link
              href="/buyer-dashboard/enquiries/new"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Post Requirement
            </Link>
            <Link
              href="/buyer-dashboard/quotations"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              My Quotes
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-foreground/60">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </Button>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <Button variant="ghost" className="flex items-center gap-2 text-foreground/70 hover:text-primary">
            <UserCircle size={24} />
            <span className="hidden sm:inline font-bold">My Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
