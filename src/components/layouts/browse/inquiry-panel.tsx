"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEnquiryStore } from "@/store/enquiryStore";
import { X } from "lucide-react";

export function InquiryPanel() {
  const { items, removeItem } = useEnquiryStore();

  return (
    <div className="bg-[#FFA500] rounded-lg overflow-hidden flex flex-col h-[calc(100vh-120px)] shadow-lg">
      <div className="p-4 bg-orange-600/10 border-b border-orange-600/20">
        <h2 className="text-white font-black text-xl text-center">
          Total Inquiry : {items.length}
        </h2>
      </div>

      <div className="p-3 flex flex-col gap-2 overflow-y-auto flex-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-white/70 text-center">
            <p className="font-bold text-sm leading-tight">Your inquiry list is empty</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded p-2 flex items-center gap-3 relative shadow-sm group"
            >
              <div className="absolute top-1 right-1 text-[10px] font-bold text-slate-300">
                Item no: {index + 1}
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute -top-1 -right-1 size-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              >
                <X className="size-3" />
              </button>
              <div className="size-12 relative shrink-0 bg-slate-50 rounded p-1 border border-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex flex-col max-w-[180px]">
                <span className="text-[11px] font-black text-slate-800 leading-tight truncate">
                  {item.title}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                  {item.brand}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-orange-600/5 mt-auto">
        <Button 
          disabled={items.length === 0}
          className="w-full bg-white text-[#FFA500] hover:bg-white/90 font-black rounded-md shadow-md disabled:opacity-50"
        >
            SEND INQUIRY
        </Button>
      </div>
    </div>
  );
}
