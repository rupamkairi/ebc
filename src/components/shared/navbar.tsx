"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <Container size="xl">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center group">
              <div className="relative h-14 w-40">
                <img
                  src="/logo.svg"
                  alt="E-CON Building Centre"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-10 text-slate-700">
              <Link
                href="#"
                className="hover:text-primary transition-colors font-bold"
              >
                {t("materials")}
              </Link>
              <Link
                href="#"
                className="hover:text-primary transition-colors font-bold"
              >
                {t("services")}
              </Link>
              <Link
                href="#"
                className="hover:text-primary transition-colors font-bold"
              >
                {t("engineer_support")}
              </Link>
              <Link
                href="#"
                className="hover:text-primary transition-colors font-bold"
              >
                {t("how_it_works")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                className="cursor-pointer border-primary text-primary hover:bg-primary/5 font-bold rounded-xl px-8 py-6 text-base border-2"
              >
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
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-in slide-in-from-top duration-300">
          <Container className="py-6 space-y-4">
            <Link
              href="#"
              className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors"
            >
              {t("materials")}
            </Link>
            <Link
              href="#"
              className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors"
            >
              {t("services")}
            </Link>
            <Link
              href="#"
              className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors"
            >
              {t("engineer_support")}
            </Link>
            <Link
              href="#"
              className="block text-lg font-bold text-foreground/70 hover:text-primary transition-colors"
            >
              {t("how_it_works")}
            </Link>
            <hr className="border-border" />
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="border-primary text-primary font-bold py-6 rounded-xl text-base border-2"
              >
                {t("contact_us")}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
