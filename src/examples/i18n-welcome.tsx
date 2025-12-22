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
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function I18NWelcome() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto rounded-xl shadow-md p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("welcome")} 👋</h1>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {t("login")}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/auth/login?role=buyer" className="w-full">
                    {t("buyer")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/login?role=seller" className="w-full">
                    {t("seller")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LanguageSwitcher />
          </div>
        </header>
      </div>
    </div>
  );
}
