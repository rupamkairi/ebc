"use client";

import { 
  ArrowLeft, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Package,
  XCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { BuyerHeader } from "../../buyer-header";
import { BuyerBottomNav } from "../../buyer-bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function QuotationReviewPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <BuyerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/buyer-dashboard/quotations" className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-bold text-sm group">
            <ArrowLeft size={18} />
            Back to All Quotes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Main Content Card */}
              <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                        Quote #{id}
                      </span>
                    </div>
                    <CardTitle className="text-3xl font-black text-foreground">
                      Quotation Details
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Clock size={14} />
                    Valid till 25 Dec 2025
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  {/* Items Table-like View */}
                  <div className="space-y-4">
                    <h3 className="font-black text-foreground uppercase tracking-widest text-xs flex items-center gap-2">
                      <Package size={16} className="text-primary" />
                      Product & Pricing
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'ACC Gold Premium Cement', qty: '50 Bags', rate: '450', total: '22,500' },
                        { name: 'Standard Red Bricks (A Grade)', qty: '5000 Pcs', rate: '11', total: '55,000' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="space-y-1">
                            <p className="font-black text-foreground">{item.name}</p>
                            <p className="text-xs font-bold text-foreground/40">{item.qty} × ₹{item.rate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-foreground flex items-center">
                              <IndianRupee size={16} /> {item.total}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold opacity-60">
                      <span>Subtotal</span>
                      <span>₹77,500</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold opacity-60">
                      <span>Delivery (Ring Road Area)</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <hr className="border-slate-800" />
                    <div className="flex justify-between items-center">
                      <span className="font-black uppercase tracking-widest text-xs">Total Payable</span>
                      <span className="text-3xl font-black flex items-center">
                        <IndianRupee size={24} className="mt-1" /> 77,500
                      </span>
                    </div>
                  </div>

                  {/* Seller Remarks */}
                  <div className="space-y-3">
                    <h3 className="font-black text-foreground uppercase tracking-widest text-xs flex items-center gap-2">
                      <MessageSquare size={16} className="text-primary" />
                      Seller Remarks
                    </h3>
                    <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl text-sm font-medium text-blue-900/70 italic">
                      "We provide genuine ACC cement. Prices include GST. Direct delivery from warehouse. Can execute delivery within 4 hours of confirmation."
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 text-sm">Lowest Price Match</h4>
                    <p className="text-xs font-medium text-emerald-800/60 mt-1">If you find a lower price on EBC for the same items, we will match it.</p>
                  </div>
               </div>
               <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-blue-900 text-sm">Verified Transaction</h4>
                    <p className="text-xs font-medium text-blue-800/60 mt-1">Payments made through EBC are protected by our Buyer Safety program.</p>
                  </div>
               </div>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              {/* Seller Card */}
              <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    Selling Party
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center text-center space-y-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="h-16 w-16 bg-white shadow-sm rounded-2xl flex items-center justify-center text-primary font-black text-xl">GH</div>
                    <div>
                      <h4 className="font-black text-foreground uppercase tracking-tight">Global Hardware & Paints</h4>
                      <div className="flex items-center justify-center gap-1 text-orange-500 mt-1">
                        <Star size={14} className="fill-current" />
                        <Star size={14} className="fill-current" />
                        <Star size={14} className="fill-current" />
                        <Star size={14} className="fill-current" />
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-black text-foreground/40 ml-1">4.9 (42 Reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/60">
                      <MapPin size={16} className="text-primary" />
                      Loha Mandi, Indore
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/60">
                      <Phone size={16} className="text-primary" />
                      Verified Business Contact
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground/60">
                      <ShieldCheck size={16} className="text-primary" />
                      12 Years on EBC
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Area */}
              <div className="space-y-4 sticky top-24">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-8 text-xl rounded-[2.5rem] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform group">
                  <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                  ACCEPT & PAY
                </Button>
                <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-400 font-black py-7 rounded-[2rem] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2 group">
                  <XCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  REJECT QUOTE
                </Button>
                
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-4">
                  <div className="flex items-center gap-3 text-blue-400">
                    <AlertCircle size={20} />
                    <span className="font-black text-sm">Need a better price?</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    Contact EBC support. We might be able to negotiate a group discount for you.
                  </p>
                  <Button variant="ghost" className="w-full text-white font-black hover:bg-slate-800 rounded-xl justify-start px-0 underline decoration-blue-500">
                    Connect with Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}

// Support missing icon from lucide locally
function Building2({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 22V4c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v18M6 18h12M6 14h12M6 10h12M6 6h12" />
    </svg>
  );
}
