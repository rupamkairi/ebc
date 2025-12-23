"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/layouts/landing/navbar";
import { Footer } from "@/components/layouts/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Calendar, MapPin, Package, Sparkles } from "lucide-react";
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
  const { t } = useLanguage();
  const { user } = useAuthStore();
  
  const userName = user?.name || "User";

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />

      {/* Sub-header Instruction from Photo: (User Name) | (Empty) */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto py-4 px-4 max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Active Account</p>
              <h2 className="text-xl font-black text-foreground">
                Hi, <span className="text-primary">{userName}</span>
              </h2>
            </div>
          </div>
          {/* Empty Right Side as per instructions */}
          <div />
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">
              My Enquiries
            </h1>
            <Link href="/enquiry/create">
              <Button size="lg" className="font-bold shadow-lg shadow-primary/20 rounded-xl px-8">
                <Plus className="mr-2 size-5" /> {t("enquiry_section_cta")}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ENQUIRIES.map((enq) => (
              <div
                key={enq.id}
                className="group relative bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div
                  className={`h-1.5 w-full ${
                    enq.status === "OPEN" ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge
                        variant={enq.status === "OPEN" ? "default" : "secondary"}
                        className="mb-2 font-black rounded-lg"
                      >
                        {enq.status}
                      </Badge>
                      <h3 className="text-lg font-black text-foreground tracking-tight">
                        #{enq.id.split("_")[1]}
                      </h3>
                      <p className="text-xs text-muted-foreground font-bold">
                        {format(enq.createdAt, "PPP")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary">
                        {enq.quotations_count}
                      </div>
                      <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Quotes
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                      <Package className="size-4 text-primary" />
                      <span className="font-bold">{enq.itemCount} Items</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                      <MapPin className="size-4 text-primary" />
                      <span className="font-bold">{enq.pincode}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-foreground/80">
                      <Calendar className="size-4 text-primary" />
                      <span className="font-bold">
                        {format(enq.expectedDate, "PP")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link href={`/enquiry/${enq.id}/quotations`}>
                      <Button className="w-full h-12 font-black bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white group-hover:shadow-md transition-all rounded-xl">
                        View Details{" "}
                        <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* New Enquiry Promo Card */}
            <Link href="/enquiry/create" className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-center gap-4 group">
              <div className="bg-white p-5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-black text-primary uppercase tracking-tight">
                  Start New Project
                </h3>
                <p className="text-sm text-muted-foreground font-bold italic">
                  Get more competitive quotes.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
