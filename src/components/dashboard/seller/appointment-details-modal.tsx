"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Package
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ActivityAssignment } from "@/types/activity";

interface AppointmentDetailsModalProps {
  assignment: ActivityAssignment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: string, slotId: string) => void;
  onReject: (appointmentId: string) => void;
  isConfirming?: boolean;
  isRejecting?: boolean;
}

export function AppointmentDetailsModal({
  assignment,
  isOpen,
  onClose,
  onConfirm,
  onReject,
  isConfirming,
  isRejecting,
}: AppointmentDetailsModalProps) {
  const [selectedSlotIdx, setSelectedSlotIdx] = React.useState(0);

  if (!assignment) return null;

  const apt = assignment.appointment;
  if (!apt) return null;

  const firstItem = apt.appointmentLineItems?.[0];
  const details = apt.appointmentDetails?.[0];
  const slots = apt.appointmentSlots || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0! gap-0! overflow-hidden border-none rounded-4xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        <div className={cn(
          "h-2 w-full shrink-0",
          apt.status === 'PENDING' ? 'bg-rose-500' : 'bg-primary/30'
        )} />
        
        <DialogHeader className="p-6 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
              APT {apt.id.slice(-8).toUpperCase()}
            </span>
            <Badge className={cn(
              "uppercase tracking-tighter font-black text-[10px] rounded-full px-3 py-1 border-none",
              apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
              'bg-emerald-100 text-emerald-700'
            )}>
              {apt.status}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-black italic text-foreground tracking-tight">
            Appointment Details
          </DialogTitle>
          <DialogDescription className="text-foreground/60 font-bold italic text-sm">
            Onsite visit request from <span className="text-primary">{apt.createdBy?.name || "Buyer"}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-6 pt-2 space-y-6">
          {/* Main Info Section - Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Service Card */}
                <div className="md:col-span-2 bg-muted/10 p-4 rounded-3xl border border-muted/20 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Package size={16} />
                    <h4 className="font-black italic uppercase text-[10px] tracking-widest">Service Item</h4>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg font-black italic truncate">{firstItem?.item?.name || "Consultation"}</p>
                    <p className="text-xs text-foreground/40 font-bold italic line-clamp-1">{firstItem?.remarks || "No additional remarks"}</p>
                  </div>
                </div>

                {/* Buyer Card */}
                <div className="md:col-span-3 bg-muted/10 p-4 rounded-3xl border border-muted/20 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <User size={16} />
                    <h4 className="font-black italic uppercase text-[10px] tracking-widest">Contact Info</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-primary shrink-0" />
                      <p className="text-xs font-black italic truncate">{apt.createdBy?.phone || "Phone Hidden"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-primary shrink-0" />
                      <p className="text-xs font-black italic truncate">{apt.createdBy?.email || "No Email"}</p>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin size={12} className="text-primary shrink-0" />
                      <p className="text-xs font-black italic truncate">{details?.address || "Location Hidden"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slots Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock size={16} />
                    <h4 className="font-black italic uppercase text-[10px] tracking-widest">Select One Preference</h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {slots.map((slot, idx) => (
                    <div 
                      key={slot.id || idx} 
                      onClick={() => setSelectedSlotIdx(idx)}
                      className={cn(
                        "p-3 rounded-2xl border-2 transition-all cursor-pointer group hover:border-primary/50",
                        idx === selectedSlotIdx 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-white border-muted/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-xl flex flex-col items-center justify-center text-[9px] font-black shrink-0",
                          idx === selectedSlotIdx ? "bg-white/20" : "bg-primary/10 text-primary"
                        )}>
                          <span>{format(new Date(slot.toDateTime), "dd")}</span>
                          <span className="uppercase">{format(new Date(slot.fromDateTime), "MMM")}</span>
                        </div>
                        <div className="space-y-0 text-[11px]">
                          <p className={cn("font-black italic leading-tight")}>
                            {format(new Date(slot.fromDateTime), "p")} - {format(new Date(slot.toDateTime), "p")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 pt-4 shrink-0 border-t border-muted/5">
          {apt.status === 'CONFIRMED' || apt.status === 'REJECTED' || apt.status === 'COMPLETED' ? (
            <Button 
              variant="outline" 
              className="w-full border-border hover:border-primary hover:text-primary font-black rounded-2xl h-14 text-sm bg-white italic" 
              onClick={onClose}
            >
              Close Appointment View
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => {
                  const sId = slots[selectedSlotIdx]?.id;
                  if (sId) onConfirm(apt.id, sId);
                }}
                disabled={isConfirming || isRejecting || !slots[selectedSlotIdx]?.id}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl h-16 text-sm shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]"
              >
                {isConfirming ? <Loader2 className="animate-spin" /> : "Proceed to payment and review"}
              </Button>
              <div className="flex items-center justify-between px-2 font-black uppercase tracking-widest text-[10px]">
                <button 
                  onClick={() => onReject(apt.id)}
                  disabled={isRejecting || isConfirming}
                  className="text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Reject Request
                </button>
                <button 
                  onClick={onClose}
                  className="text-foreground/40 hover:text-foreground transition-colors"
                >
                  Close View
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
