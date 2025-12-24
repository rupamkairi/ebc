"use client";

import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2, 
  Package, 
  Info,
  Send,
  PlusCircle,
  MapPin,
  Calendar
} from "lucide-react";
import { BuyerHeader } from "../../buyer-header";
import { BuyerBottomNav } from "../../buyer-bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function PostRequirementPage() {
  const [items, setItems] = useState([
    { id: 1, name: "", quantity: "", unit: "Bags" }
  ]);
  const [showSearch, setShowSearch] = useState<number | null>(null);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: "", unit: "Bags" }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <BuyerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link href="/buyer-dashboard" className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-bold text-sm group">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <header className="space-y-1">
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Post Your Requirement
            </h1>
            <p className="text-foreground/60 font-medium">
              We&apos;ll find the best sellers to provide quotes for you.
            </p>
          </header>

          <div className="grid gap-6">
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-white border-b border-border pb-6 pt-8 px-8">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Package size={20} className="text-primary" />
                  What do you need?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Items List */}
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id} className="p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] space-y-4 relative group transition-all hover:border-blue-500/20 hover:bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">
                          Product #{index + 1}
                        </span>
                        {items.length > 1 && (
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8 space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 px-1">
                            Find & Select Product
                          </label>
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                            <input 
                              type="text" 
                              placeholder="Search e.g. ACC Cement, TATA Steel..." 
                              className="w-full h-14 bg-white border border-border rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-4 space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 px-1">
                            Quantity
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="number" 
                              placeholder="Qty"
                              className="w-full h-14 bg-white border border-border rounded-2xl px-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                            <select className="bg-white border border-border rounded-2xl px-3 text-xs font-black uppercase tracking-tighter w-24 focus:ring-4 focus:ring-primary/10 outline-none">
                              <option>Bags</option>
                              <option>Pcs</option>
                              <option>Tons</option>
                              <option>Sqft</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    onClick={addItem}
                    className="w-full border-2 border-dashed border-border py-10 rounded-[1.5rem] text-foreground/40 hover:text-primary hover:border-primary/40 transition-all font-black gap-2 text-base"
                  >
                    <PlusCircle size={24} />
                    Add Another Product
                  </Button>
                </div>

                <hr className="border-dashed border-border" />

                {/* Additional Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 px-1">
                      Delivery Location (Pin Code)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                      <input 
                        type="text" 
                        placeholder="e.g. 452001"
                        className="w-full h-14 bg-white border border-border rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 px-1">
                      Expected Delivery By
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                      <input 
                        type="date" 
                        className="w-full h-14 bg-white border border-border rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 px-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea 
                    placeholder="E.g. Call before coming, urgent requirement, need specific brand..."
                    className="w-full bg-white border border-border rounded-[1.5rem] py-4 px-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submission Section */}
            <div className="flex flex-col gap-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black py-8 text-xl rounded-[2rem] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform group">
                <Send size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                POST MY REQUIREMENT
              </Button>
              <p className="text-center text-foreground/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Info size={12} />
                Sellers will receive your request immediately
              </p>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
