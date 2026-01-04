"use client";

import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ChevronRight,
  Filter,
  Plus
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const appointments = [
  {
    id: "APT-001",
    customer: "Amit Sharma",
    type: "Site Survey",
    date: "Tomorrow, 11:00 AM",
    location: "Scheme 54, Indore",
    status: "Pending",
    urgency: "High",
  },
  {
    id: "APT-002",
    customer: "Priya Verma",
    type: "Material Consultation",
    date: "26 Dec 2025, 02:30 PM",
    location: "Vijay Nagar, Indore",
    status: "Confirmed",
    urgency: "Normal",
  },
  {
    id: "APT-003",
    customer: "Rahul Gupta",
    type: "Final Measurement",
    date: "24 Dec 2025, 10:00 AM",
    location: "Aranya Nagar, Indore",
    status: "Completed",
    urgency: "Normal",
  },
];

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Appointments
              </h1>
              <p className="text-foreground/60 font-medium">
                Manage your site visits and customer meetings.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl h-12 px-5 border-border font-bold bg-white">
                <Filter size={18} className="mr-2" />
                Filter
              </Button>
              <Button className="rounded-2xl h-12 px-6 bg-secondary hover:bg-secondary/90 text-white font-black shadow-lg shadow-secondary/20 flex items-center gap-2">
                <Plus size={20} />
                Schedule New
              </Button>
            </div>
          </div>

          {/* Appointment List */}
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <Card key={apt.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Urgency Stripe */}
                    <div className={`w-full md:w-1.5 h-1 md:h-auto ${
                      apt.urgency === 'High' ? 'bg-rose-500' : 'bg-primary/20'
                    }`} />
                    
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-muted/30 flex flex-col items-center justify-center text-foreground/40 shrink-0">
                          <Calendar size={24} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded text-foreground/50">
                              {apt.id}
                            </span>
                            <Badge className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-2.5 py-0.5 ${
                              apt.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                              apt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                              'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            }`}>
                              {apt.status}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-foreground">
                            {apt.type} with {apt.customer}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-foreground/60 italic">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-primary/60" />
                              {apt.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-primary/60" />
                              {apt.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {apt.status === 'Pending' ? (
                          <>
                            <Button variant="outline" className="flex-1 md:flex-none border-rose-200 text-rose-500 hover:bg-rose-50 font-bold rounded-xl px-6 h-12">
                              <XCircle size={18} className="mr-2" />
                              Reject
                            </Button>
                            <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-8 h-12 shadow-lg shadow-primary/10">
                              <CheckCircle2 size={18} className="mr-2" />
                              Confirm
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-bold rounded-xl px-8 h-12 group/btn bg-white">
                            View Details
                            <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="rounded-full text-foreground/20 hover:text-primary hidden md:flex">
                          <MoreVertical size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
