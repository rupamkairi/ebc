"use client";

import { Button } from "@/components/ui/button";
import {
  HeadphonesIcon,
  Menu,
  Home,
  FileText,
  CalendarDays,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UnifiedHeader } from "../../shared/unified-header";
import { useState } from "react";
import Link from "next/link";

export default function BuyerDashboardHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const centerContent = (
    <nav className="hidden lg:flex items-center gap-6">
      <Link
        href="/buyer-dashboard"
        className="text-sm font-medium transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        Home
      </Link>
      <Link
        href="/buyer-dashboard/enquiries"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        My Enquiries
      </Link>
      <Link
        href="/buyer-dashboard/appointments"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        Appointments
      </Link>
      <Link
        href="/buyer-dashboard/conference-hall"
        className="text-sm font-medium text-slate-500 transition-colors hover:text-[#445EB4] flex items-center gap-2"
      >
        Conference Hall
      </Link>
    </nav>
  );

  const rightContent = (
    <Button className="rounded-full bg-[#FFA500] hover:bg-[#E69500] text-white px-6 py-2 sm:py-3 h-10 flex items-center gap-2 font-bold shadow-sm text-xs uppercase tracking-wider transition-all active:scale-95 border-none">
      <HeadphonesIcon className="size-4" />
      <span className="hidden sm:inline">Talk To Support</span>
    </Button>
  );

  const leftMobileMenu = (
    <div className="flex items-center gap-4 lg:hidden mr-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="size-6 text-[#3D52A0]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
          <SheetHeader className="p-6 border-b text-left">
            <SheetTitle className="text-xl font-bold text-[#173072]">Buyer Hub</SheetTitle>
          </SheetHeader>
          <div className="flex-col flex px-4 mt-6 gap-2">
            <Link
              href="/buyer-dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <Home className="h-5 w-5" /> Home
            </Link>
            <Link
              href="/buyer-dashboard/enquiries"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <FileText className="h-5 w-5" /> My Enquiries
            </Link>
            <Link
              href="/buyer-dashboard/appointments"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <CalendarDays className="h-5 w-5" /> Appointments
            </Link>
            <Link
              href="/buyer-dashboard/conference-hall"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-[#173072]"
            >
              <Users className="h-5 w-5" /> Conference Hall
            </Link>
          </div>
          <div className="mt-auto p-6 border-t">
            <Button
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFA500] h-12 font-bold"
              size="lg"
            >
              <HeadphonesIcon size={18} />
              <span>Contact Support</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <UnifiedHeader
      variant="buyer"
      centerContent={centerContent}
      leftMobileMenu={leftMobileMenu}
      rightContent={rightContent}
    />
  );
}
