"use client";

import { 
  ArrowLeft, 
  FileText, 
  IndianRupee, 
  Info,
  Calendar,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  PlusCircle,
  Package
} from "lucide-react";
import { DashboardHeader } from "../../dashboard-header";
import { BottomNav } from "../../bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CreateQuotationPage() {
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get("enquiryId");
  
  const [items, setItems] = useState([
    { id: 1, name: "Cement (Ultratech/ACC)", quantity: 50, unit: "Bags", price: 0 }
  ]);
  const [remarks, setRemarks] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = calculateSubtotal() + Number(deliveryCharge);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link href={`/seller-dashboard/enquiries/${enquiryId}`} className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-bold text-sm group">
            <ArrowLeft size={18} />
            Back to Requirement
          </Link>

          <header className="space-y-1">
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Create New Quotation
            </h1>
            <p className="text-foreground/60 font-medium">
              Reference: <span className="text-primary font-bold">#{enquiryId || "GEN-01"}</span>
            </p>
          </header>

          {/* Quotation Form */}
          <div className="grid gap-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-border">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  Price Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Items List */}
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-4 bg-muted/20 border border-border rounded-xl space-y-4 relative group">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{item.name}</p>
                            <p className="text-xs font-bold text-foreground/40 mt-0.5">{item.quantity} {item.unit} Requested</p>
                          </div>
                        </div>
                        {index > 0 && (
                          <button className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-50 rounded">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">
                            Final Rate (per {item.unit})
                          </label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                            <input 
                              type="number" 
                              placeholder="0.00"
                              className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[index].price = Number(e.target.value);
                                setItems(newItems);
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">
                            Line Total
                          </label>
                          <div className="w-full bg-muted/30 rounded-xl py-2 px-4 h-[42px] flex items-center text-sm font-black text-foreground/60">
                            <IndianRupee size={14} className="mr-1" />
                            {(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="ghost" className="w-full border-2 border-dashed border-border py-8 rounded-2xl text-foreground/40 hover:text-primary hover:border-primary/40 transition-all font-bold gap-2">
                    <PlusCircle size={20} />
                    Add More Items to Quote
                  </Button>
                </div>

                {/* Additional Charges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">
                      Delivery Charges (if any)
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">
                      Valid Until
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                      <input 
                        type="text" 
                        defaultValue="25 Dec 2025"
                        className="w-full bg-white border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">
                    Remarks / Conditions
                  </label>
                  <textarea 
                    placeholder="E.g. Price includes GST. Delivery within 24 hours of confirmation..."
                    className="w-full bg-white border border-border rounded-xl py-4 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Total & Submit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-primary rounded-3xl text-white space-y-1 shadow-lg shadow-primary/20">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Grand Total Amount</p>
                <div className="flex items-center gap-1">
                  <IndianRupee size={28} className="opacity-80" />
                  <span className="text-4xl font-black leading-none">
                    {total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-white font-black py-8 text-xl rounded-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform group">
                  <Send size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  SUBMIT QUOTATION
                </Button>
                <div className="flex items-center justify-center gap-2 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                  <Info size={12} />
                  Buyer will be notified instantly
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
