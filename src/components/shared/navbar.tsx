"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("cost_calculator"), href: "#ai-calculator" },
    { name: t("conference_hall"), href: "#conference-hall" },
    { name: t("offers"), href: "#" },
    { name: t("find_sellers"), href: "#" },
    { name: t("help"), href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300">
      <Container size="xl">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-44">
                <img
                  src="/logo.svg"
                  alt="E-CON Building Centre"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Centered Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2">
            {navLinks.map((link) => {
              const isActive = (link.href === "/" && pathname === "/") || 
                              (link.href !== "/" && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 transition-all duration-200 text-sm font-medium rounded-full",
                    isActive 
                      ? "bg-[#445EB4] text-white" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 mr-1">
                {t("join_as")}
              </span>
              <Link href="/auth/register?role=SELLER">
                <Button
                  className="bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg px-6 h-10 border-none shadow-sm"
                >
                  {t("seller_btn")}
                </Button>
              </Link>
              <Link href="/auth/register?role=BUYER">
                <Button
                  className="bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg px-6 h-10 border-none shadow-sm"
                >
                  {t("buyer_btn")}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-lg ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-6 text-foreground" />
              ) : (
                <Menu className="size-6 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-in slide-in-from-top duration-300">
          <Container className="py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-lg font-medium text-slate-600 hover:text-[#445EB4] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-border" />
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold text-slate-500 mb-2">
                {t("join_as")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/register?role=SELLER" className="w-full">
                  <Button
                    className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg py-5"
                  >
                    {t("seller_btn")}
                  </Button>
                </Link>
                <Link href="/auth/register?role=BUYER" className="w-full">
                  <Button
                    className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg py-5"
                  >
                    {t("buyer_btn")}
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
