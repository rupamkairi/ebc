"use client";

import { useState, useRef } from "react";
import { EnquiryDetailsView } from "@/components/enquiry/enquiry-details-view";
import { QuotationComparison } from "./quotation-comparison";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { StyledCard } from "@/components/ui/styled-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_ENQUIRY = {
  id: "enq_123",
  buyerDetails: {
    name: "John Doe",
    phone: "+91 9876543210",
    pincode: "400053",
    expectedDate: new Date(Date.now() + 86400000 * 5),
    address: "Lokhandwala, Andheri West",
    remarks: "Urgent Requirement",
  },
  items: [
    {
      itemId: "1",
      name: "Ambuja Cement (PPC)",
      quantity: 50,
      unit: "Bags",
      remarks: "Fresh stock only",
    },
    { itemId: "2", name: "TATA Tiscon 12mm", quantity: 5, unit: "Tons" },
  ],
};

const MOCK_QUOTATIONS = [
  {
    id: "q_1",
    sellerName: "ABC Builders Supply",
    totalAmount: 250000,
    items: [
      { itemId: "1", rate: 400, remarks: "Including delivery" },
      { itemId: "2", rate: 46000 }, // per ton
    ],
  },
  {
    id: "q_2",
    sellerName: "Super Steel & Cement",
    totalAmount: 248000,
    items: [
      { itemId: "1", rate: 395, remarks: "Delivery extra ₹500" },
      { itemId: "2", rate: 45650 },
    ],
  },
];

export default function EnquiryQuotationsPage() {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);

  const handleQuoteSelect = (id: string) => {
    setSelectedQuoteId(id);
    // Smooth scroll to review component
    setTimeout(() => {
      reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const selectedQuote = MOCK_QUOTATIONS.find((q) => q.id === selectedQuoteId);

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto py-4 px-4 max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/enquiry">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-black text-foreground">Quotations</h1>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                Compare & Finalize Request #{MOCK_ENQUIRY.id}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
              {MOCK_QUOTATIONS.length} Received
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
        {/* 1. Buyer Details Accordion */}
        <Collapsible
          open={isSummaryOpen}
          onOpenChange={setIsSummaryOpen}
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-2.5 rounded-xl group-hover:bg-gray-800 group-hover:text-white transition-all">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">Enquiry Summary</h3>
                  <p className="text-xs text-muted-foreground font-bold">
                    Buyer details & requested items list
                  </p>
                </div>
              </div>
              {isSummaryOpen ? (
                <ChevronUp className="size-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-5 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t">
            <div className="p-6 bg-muted/5">
              <EnquiryDetailsView
                buyerDetails={MOCK_ENQUIRY.buyerDetails}
                items={MOCK_ENQUIRY.items}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* 2. Buyers Quotations List */}
        <div className="space-y-4">
          <h2 className="text-xl font-black px-1 flex items-center gap-2">
            Available Offers
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {MOCK_QUOTATIONS.map((q) => (
              <div
                key={q.id}
                onClick={() => handleQuoteSelect(q.id)}
                className={cn(
                  "flex items-center justify-between p-5 bg-white border-2 rounded-2xl cursor-pointer transition-all duration-300",
                  selectedQuoteId === q.id
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.01]"
                    : "hover:border-primary/30 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "size-12 rounded-xl flex items-center justify-center font-black text-lg",
                      selectedQuoteId === q.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {q.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-lg">{q.sellerName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-muted-foreground">
                        Total Amount:
                      </span>
                      <span className="text-base font-black text-primary">
                        ₹{q.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black uppercase text-muted-foreground mb-0.5">
                      Rating
                    </div>
                    <div className="text-sm font-bold text-amber-500">
                      4.8 ★
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "size-5 transition-transform",
                      selectedQuoteId === q.id
                        ? "text-primary translate-x-1"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Review Component (Details) */}
        {selectedQuoteId && selectedQuote && (
          <div
            ref={reviewRef}
            className="pt-4 animate-in fade-in slide-in-from-bottom-6 duration-500"
          >
            <StyledCard
              title={`Quotation Detail: ${selectedQuote.sellerName}`}
              description="Review comparison between your request and seller's offer"
              icon={CheckCircle2}
              headerClassName="bg-gradient-to-r from-primary to-primary/80"
              className="border-none shadow-2xl"
            >
              <QuotationComparison
                enquiryItems={MOCK_ENQUIRY.items}
                quotation={selectedQuote}
              />

              <div className="mt-8 flex flex-col md:flex-row justify-end gap-3 pt-8 border-t-2 border-dashed">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-black border-2 h-14 rounded-xl px-8 hover:bg-muted"
                >
                  <MessageSquare className="mr-2 size-5" /> Message Seller
                </Button>
                <Button
                  size="lg"
                  className="font-black h-14 text-lg px-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 text-white"
                >
                  <CheckCircle2 className="mr-2 size-6" /> Accept Quotation
                </Button>
              </div>
            </StyledCard>
          </div>
        )}

        {!selectedQuoteId && (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/5 border-2 border-dashed rounded-3xl opacity-50">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <ChevronRight className="size-10 text-muted-foreground" />
            </div>
            <p className="font-black text-xl text-muted-foreground">
              Select a quotation to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
