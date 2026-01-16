"use client";

import React from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { 
  useAssignmentsQuery, 
  useCreateVisitMutation,
  useRejectAppointmentMutation 
} from "@/queries/activityQueries";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AppointmentDetailsModal } from "@/components/dashboard/seller/appointment-details-modal";
import { CoinDeductionModal } from "@/components/dashboard/seller/coin-deduction-modal";
import { ActivityAssignment, REF_TYPE } from "@/types/activity";


export default function AppointmentsPage() {
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];

  const { data: assignments = [], isLoading } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: "APPOINTMENT_ASSIGNMENT",
  });

  const [selectedAssignment, setSelectedAssignment] = React.useState<ActivityAssignment | null>(null);
  const [deductionModalOpen, setDeductionModalOpen] = React.useState(false);
  const [pendingConfirmation, setPendingConfirmation] = React.useState<{
    appointmentId: string;
    slotId: string;
  } | null>(null);

  const createVisit = useCreateVisitMutation();
  const rejectAppointment = useRejectAppointmentMutation();

  const handleConfirm = (appointmentId: string, slotId: string) => {
    setPendingConfirmation({ appointmentId, slotId });
    setDeductionModalOpen(true);
  };

  const onFinalConfirm = () => {
    if (!pendingConfirmation) return;

    createVisit.mutate({ 
      appointmentId: pendingConfirmation.appointmentId, 
      visitSlotId: pendingConfirmation.slotId 
    }, {
      onSuccess: () => {
        toast.success("Coins deducted and appointment confirmed!");
        setDeductionModalOpen(false);
        setPendingConfirmation(null);
        setSelectedAssignment(null);
      },
      onError: (error) => {
        toast.error("Failed to confirm appointment: " + (error as any).message);
      }
    });
  };

  const handleReject = (appointmentId: string) => {
    rejectAppointment.mutate(appointmentId, {
      onSuccess: () => {
        toast.success("Appointment rejected.");
        setSelectedAssignment(null);
      },
      onError: (error) => {
        toast.error("Failed to reject appointment: " + (error as any).message);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground/60 font-bold italic">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">
            Site Appointments
          </h1>
          <p className="text-foreground/60 font-bold italic mt-1">
            Manage onsite visits and technical consultations.
          </p>
        </div>
      </div>

      {/* Appointment List */}
      <div className="grid gap-6">
        {assignments.length === 0 ? (
          <div className="bg-muted/20 border-2 border-dashed border-muted rounded-4xl p-20 text-center">
            <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground/40 italic">No appointments found</h3>
            <p className="text-sm text-foreground/30 italic">New site visit requests will appear here.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const apt = assignment.appointment;
            if (!apt) return null;

            const firstItem = apt.appointmentLineItems?.[0];
            const details = apt.appointmentDetails?.[0];
            const slot = apt.appointmentSlots?.[0];

            return (
              <Card 
                key={assignment.id} 
                onClick={() => setSelectedAssignment(assignment)}
                className="border-none shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group bg-white rounded-4xl"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Urgency Stripe */}
                    <div className={cn(
                      "w-full md:w-2 h-2 md:h-auto",
                      apt.status === 'PENDING' ? 'bg-rose-500' : 'bg-primary/30'
                    )} />
                    
                    <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex gap-6">
                        <div className="h-20 w-20 rounded-3xl bg-muted/20 flex flex-col items-center justify-center text-foreground/20 shrink-0 group-hover:bg-primary/5 transition-colors">
                          <Calendar size={32} />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-muted px-3 py-1 rounded-full text-foreground/40">
                              APT {apt.id.slice(-8).toUpperCase()}
                            </span>
                            <Badge className={`uppercase tracking-tighter font-black text-[10px] rounded-full px-3 py-1 border-none ${
                              apt.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                              apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {apt.status}
                            </Badge>
                          </div>
                          
                          <h3 className="text-2xl font-black text-foreground italic">
                            {firstItem?.item?.name || "Consultation"} with <span className="text-primary">{apt.createdBy?.name || "Buyer"}</span>
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-bold text-foreground/40 italic">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-primary" />
                              {slot ? format(new Date(slot.fromDateTime), "PPP p") : format(new Date(apt.createdAt), "PPP")}
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin size={16} className="text-primary" />
                              <span className="truncate max-w-[200px]">{details?.address || "Location Hidden"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        {apt.status === 'PENDING' ? (
                          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 font-black text-xs uppercase px-4 py-2 rounded-xl border border-emerald-100 italic">
                              Confirm for 10 Coins
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                              <Button 
                                variant="outline" 
                                onClick={() => handleReject(apt.id)}
                                disabled={rejectAppointment.isPending || createVisit.isPending}
                                className="flex-1 md:flex-none border-rose-200 text-rose-500 hover:bg-rose-50 font-black rounded-2xl px-6 h-14 italic"
                              >
                                {rejectAppointment.isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle size={20} className="mr-2" />
                                )}
                                Reject
                              </Button>
                                <Button 
                                  onClick={() => slot?.id && handleConfirm(apt.id, slot.id)} 
                                  disabled={createVisit.isPending || !slot?.id}
                                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl px-10 h-14 shadow-xl shadow-emerald-100 group/btn"
                                >
                                  {createVisit.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle2 size={20} className="mr-2" />
                                  )}
                                  Confirm
                                </Button>
                            </div>
                          </div>
                        ) : (
                          <div onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                const address = details?.address;
                                if (address) {
                                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                                } else {
                                  toast.error("Address not available.");
                                }
                              }}
                              className="w-full md:w-auto border-border hover:border-primary hover:text-primary font-black rounded-2xl px-10 h-14 group/btn bg-white italic"
                            >
                              View Directions
                              <ChevronRight size={20} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <AppointmentDetailsModal
        assignment={selectedAssignment}
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        onConfirm={handleConfirm}
        onReject={handleReject}
        isConfirming={createVisit.isPending}
        isRejecting={rejectAppointment.isPending}
      />

      <CoinDeductionModal
        isOpen={deductionModalOpen}
        onClose={() => setDeductionModalOpen(false)}
        onConfirm={onFinalConfirm}
        leadType={REF_TYPE.VISIT}
        isProcessing={createVisit.isPending}
      />
    </div>
  );
}

