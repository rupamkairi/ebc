"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative flex h-11 w-11 items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-full w-full text-primary"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Outer House Shape */}
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#ec8305" className="fill-secondary opacity-20" />
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#ec8305" className="stroke-secondary" />
                  {/* Gear/Sun element inside */}
                  <circle cx="12" cy="13" r="4" fill="white" />
                  <circle cx="12" cy="13" r="3" stroke="#024caa" className="stroke-primary" strokeWidth="2" />
                  <path d="M12 10v1M12 15v1M9 13h1M14 13h1M10 11l.7.7M13.3 14.3l.7.7M9 15l.7-.7M14.3 11.7l.7-.7" stroke="#024caa" className="stroke-primary" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-3xl font-black tracking-tight text-primary">EBC</span>
            </Link>

            <div className="hidden lg:flex items-center gap-10 text-base font-bold text-slate-700">
              <Link href="#" className="hover:text-primary transition-colors">
                {t("materials")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("services")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("engineer_support")}
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                {t("how_it_works")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-bold rounded-xl px-8 py-6 text-base border-2">
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
              <Button variant="outline" className="border-primary text-primary font-bold py-6 rounded-xl text-base border-2">
                {t("contact_us")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
