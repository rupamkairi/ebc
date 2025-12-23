"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Calendar, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// Mock Data
const MOCK_ENQUIRIES = [
  {
    id: "enq_123456",
    createdAt: new Date(),
    itemCount: 5,
    pincode: "400053",
    status: "OPEN",
    quotations_count: 3,
    expectedDate: new Date(Date.now() + 86400000 * 5),
  },
  {
    id: "enq_789012",
    createdAt: new Date(Date.now() - 86400000 * 2),
    itemCount: 2,
    pincode: "110001",
    status: "CLOSED",
    quotations_count: 5,
    expectedDate: new Date(Date.now() + 86400000 * 10),
  },
  {
    id: "enq_345678",
    createdAt: new Date(Date.now() - 86400000 * 5),
    itemCount: 1,
    pincode: "560001",
    status: "OPEN",
    quotations_count: 0,
    expectedDate: new Date(Date.now() + 86400000 * 2),
  },
];

export default function EnquiryListPage() {
  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto py-4 px-4 max-w-5xl flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight text-primary">
            My Enquiries
          </h1>
          <Link href="/enquiry/create">
            <Button size="lg" className="font-bold shadow-lg shadow-primary/20">
              <Plus className="mr-2 size-4" /> Create New
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-5xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ENQUIRIES.map((enq) => (
            <div
              key={enq.id}
              className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div
                className={`h-1.5 w-full ${
                  enq.status === "OPEN" ? "bg-primary" : "bg-muted"
                }`}
              />
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant={enq.status === "OPEN" ? "default" : "secondary"}
                      className="mb-2 font-bold"
                    >
                      {enq.status}
                    </Badge>
                    <h3 className="text-lg font-black text-foreground">
                      #{enq.id.split("_")[1]}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {format(enq.createdAt, "PPP")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-foreground/80">
                      {enq.quotations_count}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                      Quotes
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Package className="size-4 text-primary/70" />
                    <span className="font-medium">{enq.itemCount} Items</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <MapPin className="size-4 text-primary/70" />
                    <span className="font-medium">{enq.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Calendar className="size-4 text-primary/70" />
                    <span className="font-medium">
                      {format(enq.expectedDate, "PP")}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <Link href={`/enquiry/${enq.id}/quotations`}>
                    <Button className="w-full font-bold bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white group-hover:shadow-md transition-all">
                      View Details{" "}
                      <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* New Enquiry Promo Card (if list is small or always) */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-center gap-4 group">
            <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="size-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">
                Create Another Enquiry
              </h3>
              <p className="text-sm text-muted-foreground">
                Get more competitive quotes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
