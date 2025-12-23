"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg shadow-lg shadow-primary/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-white"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-primary">EBC</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-foreground/60">
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">
                {t("materials")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">
                {t("services")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">
                {t("engineer_support")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4 decoration-2">
                {t("how_it_works")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 font-bold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full px-5">
                    {t("login")}
                    <ChevronDown className="size-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-border shadow-xl">
                  <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/5 focus:text-primary cursor-pointer font-bold py-2.5">
                    <Link href="/auth/login?role=buyer" className="w-full">
                      {t("buyer")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/5 focus:text-primary cursor-pointer font-bold py-2.5">
                    <Link href="/auth/login?role=seller" className="w-full">
                      {t("seller")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="h-6 w-px bg-border mx-1" />
              <LanguageSwitcher />
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full px-6 flex items-center gap-2 shadow-lg shadow-secondary/20">
                <PhoneCall size={18} />
                {t("contact_us")}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="size-6 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Link href="#" className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors">
              {t("materials")}
            </Link>
            <Link href="#" className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors">
              {t("services")}
            </Link>
            <Link href="#" className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors">
              {t("engineer_support")}
            </Link>
            <Link href="#" className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors">
              {t("how_it_works")}
            </Link>
            <hr className="border-border" />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-widest text-foreground/40">Login As</span>
                <LanguageSwitcher />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="font-bold rounded-xl border-2">
                  <Link href="/auth/login?role=buyer">{t("buyer")}</Link>
                </Button>
                <Button variant="outline" asChild className="font-bold rounded-xl border-2">
                  <Link href="/auth/login?role=seller">{t("seller")}</Link>
                </Button>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 rounded-xl shadow-lg shadow-secondary/20">
                {t("contact_us")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
