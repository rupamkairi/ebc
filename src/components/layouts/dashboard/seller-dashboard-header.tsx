"use client";

import Link from "next/link";
import { PhoneCall, Menu, Home, Package, FileText, Headphones } from "lucide-react";
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

export function SellerDashboardHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const centerContent = (
    <nav className="hidden lg:flex items-center gap-6">
      <Link
        href="/seller-dashboard"
        className="text-sm font-medium transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        Home
      </Link>
      <Link
        href="/seller-dashboard/catalog"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        My Catalog
      </Link>
      <Link
        href="/seller-dashboard/enquiries"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        Enquiries
      </Link>
      <Link
        href="/seller-dashboard/support"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        Support
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
        <span>Support</span>
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
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
          <SheetHeader className="p-6 border-b text-left">
            <SheetTitle className="text-xl font-bold text-[#173072]">Seller Hub</SheetTitle>
          </SheetHeader>
          <div className="flex-col flex px-4 mt-6 gap-2">
            <Link
              href="/seller-dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <Home className="h-5 w-5" /> Home
            </Link>
            <Link
              href="/seller-dashboard/catalog"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <Package className="h-5 w-5" /> My Catalog
            </Link>
            <Link
              href="/seller-dashboard/enquiries"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <FileText className="h-5 w-5" /> Enquiries
            </Link>
            <Link
              href="/seller-dashboard/support"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <Headphones className="h-5 w-5" /> Support
            </Link>
          </div>
          <div className="mt-auto p-6 border-t flex flex-col gap-3">
             <div className="flex md:hidden items-center justify-between mb-2">
               <span className="text-sm font-medium text-gray-500">Wallet</span>
               <CoinBalance />
             </div>
             <Button className="w-full sm:hidden flex items-center justify-center gap-2 rounded-full" size="lg">
                <PhoneCall size={18} />
                <span>Contact Tech Support</span>
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
