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
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">EBC</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {t("login")}
                    <ChevronDown className="size-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login?role=buyer" className="w-full cursor-pointer">
                      {t("buyer")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login?role=seller" className="w-full cursor-pointer">
                      {t("seller")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <LanguageSwitcher />
              <Button size="sm">{t("contact_us")}</Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Placeholder - Can be expanded */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-4">
          <Link href="#" className="block text-base font-medium">
            {t("materials")}
          </Link>
          <Link href="#" className="block text-base font-medium">
            {t("services")}
          </Link>
          <Link href="#" className="block text-base font-medium">
            {t("engineer_support")}
          </Link>
          <Link href="#" className="block text-base font-medium">
            {t("how_it_works")}
          </Link>
          <hr />
          <div className="flex flex-col gap-2">
            <Link href="/auth/login?role=buyer" className="text-base font-medium">
              {t("login")} as {t("buyer")}
            </Link>
            <Link href="/auth/login?role=seller" className="text-base font-medium">
              {t("login")} as {t("seller")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
