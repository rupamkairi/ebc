"use client";

import { Button } from "@/components/ui/button";
import { HeadphonesIcon, Menu } from "lucide-react";
import Link from "next/link";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { SidebarItems } from "./buyer-dashboard-sidebar";

export default function BuyerDashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-20 items-center justify-between px-4 sm:px-8 relative max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-6 text-[#3D52A0]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="text-left flex items-center gap-2">
                  <img src="/logo.svg" alt="E-CON" className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <SidebarItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Moved to the left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="E-CON"
              className="h-10 sm:h-14 w-auto"
            />
          </Link>
        </div>
        
        {/* Right side: Action Button */}
        <div className="flex items-center gap-4">
          <Button 
            className="rounded-full bg-[#FFA500] hover:bg-[#E69500] text-white px-4 sm:px-6 py-5 h-auto flex items-center gap-2 font-semibold shadow-sm text-sm"
          >
            <HeadphonesIcon className="size-4" />
            <span className="hidden sm:inline">Talk To Support Team</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
