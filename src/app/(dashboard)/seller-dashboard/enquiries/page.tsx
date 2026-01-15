"use client";

import { Search, MapPin, Calendar } from "lucide-react";
import { EnquiryCard } from "@/components/dashboard/seller/enquiries/enquiry-card";

const enquiries = [
  {
    id: "ENQ-001",
    customer: "Amit Sharma",
    location: "Indore, MP",
    items: "Cement (50 bags)",
    date: "22 Dec 2025",
    time: "10:30 AM",
    status: "New",
    priority: "High",
  },
  {
    id: "ENQ-002",
    customer: "Priya Verma",
    location: "Ujjain, MP",
    items: "Bricks (5000 pcs)",
    date: "22 Dec 2025",
    time: "11:45 AM",
    status: "New",
    priority: "Medium",
  },
  {
    id: "ENQ-003",
    customer: "Rahul Gupta",
    location: "Bhopal, MP",
    items: "Sariya (2 Ton)",
    date: "21 Dec 2025",
    time: "03:20 PM",
    status: "Quoted",
    priority: "High",
  },
  {
    id: "ENQ-004",
    customer: "Vivek Roy",
    location: "Indore, MP",
    items: "Marble (1200 Sqft)",
    date: "21 Dec 2025",
    time: "05:10 PM",
    status: "New",
    priority: "Low",
  },
];

export default function EnquiriesPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">
            Active Enquiries
          </h1>
          <p className="text-foreground/60 font-bold italic mt-1">
            New leads from buyers looking for your products & services.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30"
              size={20}
            />
            <input
              type="text"
              placeholder="Search leads by customer or item..."
              className="w-full bg-white border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="grid gap-6">
        {enquiries.map((enq) => (
          <EnquiryCard key={enq.id} {...enq} />
        ))}
      </div>
    </div>
  );
}
