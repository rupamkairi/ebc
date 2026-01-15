import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight,
  Clock,
  FileText,
  IndianRupee,
  MoreVertical,
} from "lucide-react";

interface QuotationCardProps {
  id: string;
  customer: string;
  items: string;
  amount: string;
  date: string;
  status: string;
  expiry?: string;
}

export function QuotationCard({
  id,
  customer,
  items,
  amount,
  date,
  status,
  expiry,
}: QuotationCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group bg-white rounded-4xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Status Indicator Bar */}
          <div
            className={`w-full md:w-2 h-2 md:h-auto ${
              status === "Accepted"
                ? "bg-emerald-500"
                : status === "Sent"
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          />

          <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex gap-6">
              <div className="h-20 w-20 rounded-3xl bg-muted/20 flex items-center justify-center text-foreground/20 shrink-0 group-hover:bg-primary/5 transition-colors">
                <FileText size={32} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                    {id}
                  </span>
                  <Badge
                    className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-3 py-1 border-none ${
                      status === "Accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : status === "Sent"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>

                <h3 className="text-2xl font-black text-foreground italic">
                  {customer}
                </h3>
                <p className="text-sm font-bold text-foreground/40 italic flex items-center gap-2 bg-muted/30 w-fit px-3 py-1 rounded-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {items}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">
                  Quote Value
                </p>
                <div className="flex items-center justify-end font-black text-primary text-3xl tracking-tighter italic">
                  <IndianRupee size={24} className="mr-0.5" />
                  {amount}
                </div>
                <div className="flex items-center justify-end gap-2 text-[11px] font-bold text-foreground/40 mt-1 italic">
                  <Clock size={12} className="text-primary/50" />
                  Sent on {date}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-black rounded-2xl px-10 h-14 group/btn bg-white italic"
                >
                  Edit / Review
                  <ChevronRight
                    size={20}
                    className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl h-12 w-12 text-foreground/20 hover:text-primary hidden md:flex"
                >
                  <MoreVertical size={24} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
