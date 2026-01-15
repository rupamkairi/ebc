"use client";

import { 
  FileText, 
  Search, 
  Filter,
  IndianRupee,
  Clock,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuotationsQuery } from "@/queries/activityQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

export default function QuotationsPage() {
  const { data: entities } = useEntitiesQuery();
  const sellerEntityId = entities?.[0]?.id;

  const { data: quotations, isLoading } = useQuotationsQuery({
    // We could filter by sellerEntityId if the API supports it, 
    // but usually the backend handles session-based filtering.
  });

  const displayQuotations = useMemo(() => {
    if (!quotations) return [];
    
    return quotations.map(qut => {
      const totalAmount = qut.quotationLineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      const mainItem = qut.quotationLineItems[0]?.item?.name || "Multiple Items";
      const itemCount = qut.quotationLineItems.length;
      
      return {
        ...qut,
        displayAmount: totalAmount.toLocaleString("en-IN"),
        displayItems: itemCount > 1 ? `${mainItem} (+${itemCount - 1} more)` : mainItem,
        customerName: qut.enquiry?.createdBy?.name || `Enquiry #${qut.enquiryId.slice(0, 8)}`,
        displayDate: format(new Date(qut.createdAt), "dd MMM yyyy"),
        // Map isActive to a status label for the UI
        uiStatus: qut.isActive ? "Accepted" : "Sent"
      };
    });
  }, [quotations]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground/60 font-bold italic">Loading your deals...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">
            Deal Board
          </h1>
          <p className="text-foreground/60 font-bold italic mt-1">
            Track your active quotations and conversion status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-12 px-5 border-border font-bold bg-white italic">
            <Filter size={18} className="mr-2 text-primary" />
            Filter Deals
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
        <input 
          type="text" 
          placeholder="Search by quote ID or customer name..." 
          className="w-full bg-white border border-border rounded-3xl py-4.5 pl-14 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Quotations List */}
      <div className="grid gap-6">
        {displayQuotations.length === 0 ? (
          <div className="bg-muted/20 border-2 border-dashed border-muted rounded-4xl p-20 text-center">
            <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground/40 italic">No quotations found</h3>
            <p className="text-sm text-foreground/30 italic">When you respond to enquiries, they will appear here.</p>
          </div>
        ) : (
          displayQuotations.map((qut) => (
            <Card key={qut.id} className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group bg-white rounded-4xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Status Indicator Bar */}
                  <div className={`w-full md:w-2 h-2 md:h-auto ${
                    qut.uiStatus === 'Accepted' ? 'bg-emerald-500' : 
                    qut.uiStatus === 'Sent' ? 'bg-blue-600' : 'bg-slate-300'
                  }`} />
                  
                  <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex gap-6">
                      <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center text-foreground/20 shrink-0 group-hover:bg-primary/5 transition-colors">
                        <FileText size={32} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                            {qut.id.split('-').pop()?.toUpperCase() || qut.id.slice(-8).toUpperCase()}
                          </span>
                          <Badge className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-3 py-1 border-none ${
                            qut.uiStatus === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                            qut.uiStatus === 'Sent' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {qut.uiStatus}
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl font-black text-foreground italic">
                          {qut.customerName}
                        </h3>
                        <p className="text-sm font-bold text-foreground/40 italic flex items-center gap-2 bg-muted/30 w-fit px-3 py-1 rounded-lg">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {qut.displayItems}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-10">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Quote Value</p>
                        <div className="flex items-center justify-end font-black text-primary text-3xl tracking-tighter italic">
                          <IndianRupee size={24} className="mr-0.5" />
                          {qut.displayAmount}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-[11px] font-bold text-foreground/40 mt-1 italic">
                          <Clock size={12} className="text-primary/50" />
                          Updated {qut.displayDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button asChild variant="outline" className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-black rounded-2xl px-10 h-14 group/btn bg-white italic">
                          <Link href={`/seller-dashboard/quotations/${qut.id}`}>
                            Edit / Review
                            <ChevronRight size={20} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-foreground/20 hover:text-primary hidden md:flex">
                          <MoreVertical size={24} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Tip */}
      <div className="bg-primary/5 border border-primary/10 rounded-4xl p-8 flex items-center gap-6 shadow-xs">
        <div className="bg-white p-4 rounded-3xl shadow-md text-primary shrink-0">
          <AlertCircle size={32} />
        </div>
        <div>
          <p className="text-lg font-black text-primary italic leading-tight">Pro Tip: Following up on &quot;Sent&quot; quotations within 24 hours increases conversion by 40%!</p>
          <p className="text-sm font-medium text-primary/60 mt-1 italic">Personal reaching out builds trust with the buyers.</p>
        </div>
      </div>
    </div>
  );
}

