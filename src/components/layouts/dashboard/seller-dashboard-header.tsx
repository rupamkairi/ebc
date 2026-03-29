"use client";

import Link from "next/link";
import {
  PhoneCall,
  Menu,
  Home,
  Package,
  FileText,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinBalance } from "@/components/dashboard/seller/coin-balance";
import { UnifiedHeader } from "@/components/shared/unified-header";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/hooks/useLanguage";
import { useSessionQuery } from "@/queries/authQueries";
import { isServiceBusiness } from "@/constants/roles";

export function SellerDashboardHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { data: user } = useSessionQuery();
  const isServiceProvider = isServiceBusiness(user?.user?.role);

  const middleNavLink = isServiceProvider
    ? { href: "/seller-dashboard/appointments", label: t("appointments") }
    : { href: "/seller-dashboard/enquiries", label: t("enquiries") };

  const centerContent = (
    <nav className="hidden lg:flex items-center gap-6">
      <Link
        href="/seller-dashboard"
        className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
      >
        {t("home", "Home")}
      </Link>
      <Link
        href="/seller-dashboard/catalog"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-primary flex items-center gap-2"
      >
        {t("catalog", "Catalog")}
      </Link>
      <Link
        href={middleNavLink.href}
        className="text-sm font-medium text-slate-500 transition-colors hover:text-primary flex items-center gap-2"
      >
        {middleNavLink.label}
      </Link>
      <Link
        href="/seller-dashboard/reports"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-primary flex items-center gap-2"
      >
        {t("reports", "Reports")}
      </Link>
      <Link
        href="/seller-dashboard/wallet"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-primary flex items-center gap-2"
      >
        {t("wallet", "Wallet")}
      </Link>
    </nav>
  );

  const rightContent = (
    <div className="flex items-center gap-4">
      <CoinBalance className="hidden md:flex" />
      <Button
        variant="default"
        size="sm"
        className="hidden sm:flex items-center gap-2 rounded-full"
      >
        <PhoneCall size={16} />
        <span>{t("support", "Support")}</span>
      </Button>
    </div>
  );

  const leftMobileMenu = (
    <div className="lg:hidden flex items-center mr-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[350px] p-0 flex flex-col"
        >
          <SheetHeader className="p-6 border-b text-left">
            <SheetTitle className="text-xl font-bold text-primary">
              Seller Hub
            </SheetTitle>
          </SheetHeader>
          <div className="flex-col flex px-4 mt-6 gap-2">
            <Link
              href="/seller-dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-primary"
            >
              <Home className="h-5 w-5" /> {t("home", "Home")}
            </Link>
            <Link
              href="/seller-dashboard/catalog"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-primary"
            >
              <Package className="h-5 w-5" /> {t("catalog", "Catalog")}
            </Link>
            <Link
              href={middleNavLink.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-primary"
            >
              {isServiceProvider ? (
                <CalendarDays className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              {middleNavLink.label}
            </Link>
            <Link
              href="/seller-dashboard/reports"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-primary"
            >
              <FileText className="h-5 w-5" /> {t("reports", "Reports")}
            </Link>
            <Link
              href="/seller-dashboard/wallet"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-primary"
            >
              <Wallet className="h-5 w-5" /> {t("wallet", "Wallet")}
            </Link>
          </div>
          <div className="mt-auto p-6 border-t flex flex-col gap-3">
            <div className="flex md:hidden items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                {t("wallet", "Wallet")}
              </span>
              <CoinBalance />
            </div>
            <Button
              className="w-full sm:hidden flex items-center justify-center gap-2 rounded-full"
              size="lg"
            >
              <PhoneCall size={18} />
              <span>{t("contact_support", "Contact Support")}</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <UnifiedHeader
      variant="seller"
      centerContent={centerContent}
      rightContent={rightContent}
      leftMobileMenu={leftMobileMenu}
    />
  );
}
