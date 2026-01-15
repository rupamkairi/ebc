"use client";

import {
  ArrowLeft,
  MessageSquare,
  FileText,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { EnquiryDetailsView } from "@/components/dashboard/shared/enquiry-details-view";

export default function EnquiryDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data to match EnquiryDetailsView props
  const buyerDetails = {
    name: "Amit Sharma",
    phone: "+91 98765 43210",
    address: "Ring Road, Scheme 54",
    pincode: "452010",
    expectedDate: new Date("2025-12-23"),
    remarks: "Need delivery by tomorrow morning. Prefer local Indore dispatch.",
  };

  const items = [
    {
      name: "Cement",
      brandName: "Ultratech/ACC",
      quantity: 50,
      unit: "Bags",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/seller-dashboard/enquiries"
        className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-bold text-sm group"
      >
        <div className="p-1 rounded-full group-hover:bg-primary/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Back to Enquiries
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-foreground/50">
                    ID: {id}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    Open
                  </span>
                </div>
                <h1 className="text-3xl font-black text-foreground pt-2">
                  Requirement Details
                </h1>
              </div>
            </div>

            {/* Shared Enquiry View */}
            <EnquiryDetailsView buyerDetails={buyerDetails} items={items} />
          </div>

          {/* Tips Section */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-2 bg-secondary rounded-full text-white">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="font-black text-secondary">Pro Tip for Vendors</h4>
              <p className="text-sm text-foreground/70 font-medium">
                Buyers are 4x more likely to accept a quote when you provide a
                detailed breakdown of taxes and delivery charges.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Stats/Info */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <User size={18} className="text-primary" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center font-bold text-foreground/40">
                  AS
                </div>
                <div>
                  <p className="font-bold text-foreground leading-none">
                    Amit Sharma
                  </p>
                  <p className="text-xs font-medium text-foreground/40 mt-1">
                    Silver Buyer Member
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-dashed border-border flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                  <Phone size={14} />
                  Verified Mobile
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-foreground/60">
                  <MessageSquare size={14} />3 Past Purchases
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky Action Card */}
          <Card className="border-none shadow-xl bg-primary text-white sticky top-24">
            <CardContent className="p-6 space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Ready to Quote?</h3>
                <p className="text-sm opacity-80 font-medium">
                  Lock this deal by sending your best price now.
                </p>
              </div>
              <Link
                href={`/seller-dashboard/quotations/new?enquiryId=${id}`}
                className="block"
              >
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-black py-7 text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <FileText size={20} />
                  Create Quotation
                </Button>
              </Link>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Takes less than 1 minute
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
