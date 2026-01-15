import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  MoreVertical,
  XCircle,
} from "lucide-react";

interface AppointmentCardProps {
  id: string;
  customer: string;
  type: string;
  date: string;
  location: string;
  status: string;
  urgency: string;
}

export function AppointmentCard({
  id,
  customer,
  type,
  date,
  location,
  status,
  urgency,
}: AppointmentCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl transition-all overflow-hidden group bg-white rounded-4xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Urgency Stripe */}
          <div
            className={`w-full md:w-2 h-2 md:h-auto ${
              urgency === "High" ? "bg-rose-500" : "bg-primary/30"
            }`}
          />

          <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex gap-6">
              <div className="h-20 w-20 rounded-3xl bg-muted/20 flex flex-col items-center justify-center text-foreground/20 shrink-0 group-hover:bg-primary/5 transition-colors">
                <Calendar size={32} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                    APT {id}
                  </span>
                  <Badge
                    className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-3 py-1 border-none ${
                      status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {status}
                  </Badge>
                </div>

                <h3 className="text-2xl font-black text-foreground italic">
                  {type} with <span className="text-primary">{customer}</span>
                </h3>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-bold text-foreground/40 italic">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    {date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {location}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {status === "Pending" ? (
                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-black text-xs uppercase px-4 py-2 rounded-xl border border-emerald-100 italic">
                    Confirm for 10 Coins
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                      variant="outline"
                      className="flex-1 md:flex-none border-rose-200 text-rose-500 hover:bg-rose-50 font-black rounded-2xl px-6 h-14 italic"
                    >
                      <XCircle size={20} className="mr-2" />
                      Reject
                    </Button>
                    <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl px-10 h-14 shadow-xl shadow-emerald-100 group/btn">
                      <CheckCircle2 size={20} className="mr-2" />
                      Confirm
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-black rounded-2xl px-10 h-14 group/btn bg-white italic"
                >
                  View Directions
                  <ChevronRight
                    size={20}
                    className="ml-2 group-hover/btn:translate-x-1 transition-transform"
                  />
                </Button>
              )}
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
      </CardContent>
    </Card>
  );
}
