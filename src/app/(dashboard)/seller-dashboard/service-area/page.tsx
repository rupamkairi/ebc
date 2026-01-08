"use client";

import { 
  MapPin, 
  Search, 
  Plus, 
  Navigation, 
  Trash2, 
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const locations = [
  {
    id: 1,
    area: "Indore City",
    pincodes: "452001, 452010, 452016",
    status: "Active",
    type: "Primary Hub",
    deliveryFee: "Free",
  },
  {
    id: 2,
    area: "Ujjain",
    pincodes: "456001, 456006",
    status: "Active",
    type: "Satellite",
    deliveryFee: "₹500",
  },
  {
    id: 3,
    area: "Dewas",
    pincodes: "455001",
    status: "Pending Approval",
    type: "Extension",
    deliveryFee: "₹800",
  },
];

export default function ServiceAreaPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Service Area Management</h1>
          <p className="text-foreground/60 font-medium">Manage areas where you provide delivery and services.</p>
        </div>
        <Button className="rounded-2xl h-12 px-6 bg-secondary hover:bg-secondary/90 text-white font-black shadow-lg shadow-secondary/20 flex items-center gap-2 text-sm">
          <Plus size={20} />
          Add New Area
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder or Visual Area */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-sm h-64 md:h-80 bg-muted/30 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4 text-foreground/20">
                    <Navigation size={48} className="animate-pulse" />
                    <span className="font-bold italic uppercase tracking-widest text-xs">Map View Loading...</span>
                 </div>
              </div>
              {/* Subtle Grid Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="grid grid-cols-10 h-full w-full">
                    {[...Array(100)].map((_, i) => (
                       <div key={i} className="border border-foreground/10" />
                    ))}
                 </div>
              </div>
           </Card>
           
           <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                 <AlertTriangle size={20} />
                 <h4 className="font-black italic text-sm">Action Required</h4>
              </div>
              <p className="text-xs font-medium text-amber-700/60 leading-relaxed italic">Your extension to &quot;Dewas&quot; is pending verification. Please upload address proof of your godown in that area.</p>
           </div>
        </div>

        {/* Locations List */}
        <div className="lg:col-span-2 space-y-4">
          {locations.map((loc) => (
            <Card key={loc.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                         loc.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-foreground/20'
                      }`}>
                        <MapPin size={24} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                           <h3 className="text-xl font-bold text-foreground">{loc.area}</h3>
                           <Badge className={`uppercase tracking-tighter font-black text-[9px] rounded-full px-2 py-0 h-4 border-none ${
                              loc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                           }`}>
                              {loc.status}
                           </Badge>
                        </div>
                        <p className="text-xs font-bold text-foreground/40 italic">Pincodes: {loc.pincodes}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{loc.type}</p>
                          <p className="text-sm font-black text-primary italic">Fee: {loc.deliveryFee}</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl text-foreground/20 hover:text-rose-500 transition-colors">
                             <Trash2 size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-foreground/20 hover:text-primary">
                             <MoreVertical size={18} />
                          </Button>
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-center pt-4">
             <Button variant="ghost" className="text-foreground/30 font-black flex items-center gap-2 group italic text-sm">
                View Distribution Network
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
