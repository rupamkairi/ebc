"use client";

import React from "react";
import { useEnquiryStore } from "@/store/enquiryStore";
import { ClipboardList } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InquiryPanel } from "./inquiry-panel";

export function FloatingInquiryButton() {
  const inquiryCount = useEnquiryStore((state) => state.items.length);

  if (inquiryCount === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Sheet>
        <SheetTrigger asChild>
          <button
            key={inquiryCount} // Triggers CSS animation when count changes
            className="relative bg-secondary hover:bg-secondary/90 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group animate-in zoom-in spin-in-1 duration-300"
          >
            <ClipboardList className="size-8" />
            <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-black size-7 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              {inquiryCount}
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              View Inquiries
            </div>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 border-none bg-transparent">
          <SheetHeader className="sr-only">
            <SheetTitle>Your Inquiry List</SheetTitle>
          </SheetHeader>
          <div className="h-full p-4 pt-12">
            <InquiryPanel isMobile />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
