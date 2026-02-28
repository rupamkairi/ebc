"use client";

import Container from "@/components/containers/containers";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UnifiedHeader } from "./unified-header";
import { useSessionQuery } from "@/queries/authQueries";

export function Header() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: sessionData } = useSessionQuery();
  const user = sessionData?.user;

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("cost_calculator"), href: "#ai-calculator" },
    { name: t("conference_hall"), href: "/conference-hall" },
    // { name: t("offers"), href: "/offers" },
    // { name: t("find_sellers"), href: "#" },
    // { name: t("help"), href: "#" },
  ];

  const centerContent = navLinks.map((link) => {
    const isActive =
      (link.href === "/" && pathname === "/") ||
      (link.href !== "/" && pathname.startsWith(link.href));

    return (
      <Link
        key={link.name}
        href={link.href}
        className={cn(
          "px-4 py-2 transition-all duration-200 text-sm font-medium rounded-full",
          isActive
            ? "bg-[#445EB4] text-white"
            : "text-slate-500 hover:text-slate-900",
        )}
      >
        {link.name}
      </Link>
    );
  });

  const mobileMenu = (
    <>
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

      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full border-t border-border bg-white animate-in slide-in-from-top duration-300 lg:hidden shadow-lg z-50">
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
              {!user ? (
                <>
                  <p className="text-sm font-semibold text-slate-500 mb-2">
                    {t("join_as")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/auth/register?role=SELLER" className="w-full">
                      <Button className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg py-5">
                        {t("seller_btn")}
                      </Button>
                    </Link>
                    <Link href="/auth/register?role=BUYER" className="w-full">
                      <Button className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold rounded-lg py-5">
                        {t("buyer_btn")}
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-[#445EB4] flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      {user.name}
                    </span>
                    <span className="text-sm text-slate-500 capitalize">
                      {user.role?.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </>
  );

  return (
    <UnifiedHeader
      variant="public"
      centerContent={centerContent}
      mobileMenu={mobileMenu}
    />
  );
}
