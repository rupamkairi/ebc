"use client";

import Container from "@/components/containers/containers";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  value: string;
}

function FilterDropdown({ label, value }: FilterDropdownProps) {
  return (
    <div className="flex items-center bg-[#E5E7EB] rounded-md overflow-hidden min-w-[140px] md:min-w-[180px]">
      <div className="px-3 py-2 text-slate-500 text-[10px] md:text-xs font-bold whitespace-nowrap border-r border-slate-300">
        {label} :
      </div>
      <button className="flex items-center justify-between grow px-3 py-2 text-[#445EB4] font-black text-[10px] md:text-sm">
        <span className="truncate">{value}</span>
        <div className="bg-[#445EB4] p-1 rounded-sm ml-2">
            <ChevronDown className="size-3 text-white" />
        </div>
      </button>
    </div>
  );
}

export function ConferenceFilters() {
  return (
    <div className="bg-[#F3F4F6] py-8">
      <Container size="xl">
        {/* Dropdowns Row */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
          <FilterDropdown label="Location" value="Select area" />
          <FilterDropdown label="Category" value="All Categories" />
          <FilterDropdown label="Session Type" value="All Sessions" />
          <FilterDropdown label="Time" value="Live & Upcoming" />
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search for live or upcoming meetings..."
              className="w-full h-12 px-6 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FFA500] shadow-sm pr-32 transition-all"
            />
            <button className="absolute right-1 top-1 bottom-1 px-8 bg-[#FFA500] hover:bg-[#FFB733] text-white font-black rounded-full transition-colors flex items-center justify-center gap-2">
              <span className="text-sm">Search</span>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
