"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinBalance } from "@/components/dashboard/seller/coin-balance";
import Container from "@/components/containers/containers";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-24">
              <Image
                src="/logo.svg"
                alt="E-CON Building Centre"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/seller-dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/seller-dashboard/catalog"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              My Catalog
            </Link>
            <Link
              href="/seller-dashboard/enquiries"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Enquiries
            </Link>
            <Link
              href="/seller-dashboard/support"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Support
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <CoinBalance className="hidden md:flex" />
          <Button
            variant="default"
            size="sm"
            className="hidden sm:flex items-center gap-2 rounded-full"
          >
            <PhoneCall size={16} />
            <span>Support</span>
          </Button>
        </div>
      </Container>
    </header>
  );
}
