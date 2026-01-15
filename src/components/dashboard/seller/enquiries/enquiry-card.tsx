import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";

interface EnquiryCardProps {
  id: string;
  customer: string;
  location: string;
  items: string;
  date: string;
  time: string;
  status: string;
  priority: string;
}

export function EnquiryCard({
  id,
  customer,
  location,
  items,
  date,
  time,
  status,
  priority,
}: EnquiryCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group bg-white rounded-4xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Urgency/Status Marker */}
          <div
            className={`w-full md:w-2 h-2 md:h-auto ${
              status === "New" ? "bg-amber-500" : "bg-primary/30"
            }`}
          />

          <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                  LEAD {id}
                </span>
                {status === "New" && (
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Premium Lead
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors italic">
                  {customer}
                </h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm font-bold text-foreground/40 italic">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    {date}, {time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-3 shadow-inner">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">
                    Buyer Requirement
                  </p>
                  <span className="text-lg font-black text-primary italic">
                    {items}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {status === "New" ? (
                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 font-black text-xs uppercase px-4 py-2 rounded-xl border border-amber-100 italic">
                    Unlock for 5 Coins
                  </div>
                  <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black py-7 px-10 rounded-2xl flex items-center gap-3 group/btn shadow-xl shadow-amber-200">
                    Unlock Lead
                    <ChevronRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Button>
                </div>
              ) : (
                <Link
                  href={`/seller-dashboard/enquiries/${id}`}
                  className="w-full md:w-auto"
                >
                  <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-black py-7 px-10 rounded-2xl flex items-center gap-3 group/btn shadow-xl shadow-primary/20">
                    Create Quotation
                    <ChevronRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
