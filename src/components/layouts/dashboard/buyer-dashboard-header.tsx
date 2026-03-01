"use client";

import { Button } from "@/components/ui/button";
import { HeadphonesIcon, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { SidebarItems } from "./buyer-dashboard-sidebar";
import { UnifiedHeader } from "../../shared/unified-header";

export default function BuyerDashboardHeader() {
  const leftMobileMenu = (
    <div className="flex items-center gap-4 lg:hidden mr-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-6 text-[#3D52A0]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-left flex items-center gap-2">
              <div className="relative h-8 w-24">
                <Image
                  src="/logo.svg"
                  alt="E-CON Building Centre"
                  fill
                  className="object-contain"
                />
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <SidebarItems />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  const rightContent = (
    <Button className="rounded-full bg-[#FFA500] hover:bg-[#E69500] text-white px-8 py-2 sm:py-3 h-auto flex items-center gap-2 font-semibold shadow-sm text-sm">
      <HeadphonesIcon className="size-4" />
      <span className="hidden sm:inline">Talk To Support Team</span>
    </Button>
  );

  return (
    <UnifiedHeader
      variant="buyer"
      leftMobileMenu={leftMobileMenu}
      rightContent={rightContent}
    />
  );
}
