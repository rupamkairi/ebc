"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Enquiry,
  Appointment,
  Quotation,
  Visit,
  EnquiryLineItem,
  AppointmentLineItem,
} from "@/types/activity";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Package,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatUnitType } from "@/constants/quantities";

interface ActivityDetailModalProps {
  activity: Enquiry | Appointment | null;
  type: "ENQUIRY" | "APPOINTMENT";
  isOpen: boolean;
  onClose: () => void;
  quotations?: Quotation[];
  visit?: Visit | null;
}

export function ActivityDetailModal({
  activity,
  type,
  isOpen,
  onClose,
  quotations = [],
  visit,
}: ActivityDetailModalProps) {
  if (!activity) return null;

  const createdBy = activity.createdBy;
  const createdAt = new Date(activity.createdAt);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-3xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-4 bg-slate-50/50 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-black text-primary flex items-center gap-2">
                {type === "ENQUIRY" ? "Enquiry Details" : "Appointment Details"}
                <Badge className="font-mono text-[10px] bg-primary/10 text-primary border-none">
                  #{activity.id.slice(0, 8)}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs font-medium">
                Created on {format(createdAt, "MMMM dd, yyyy 'at' hh:mm a")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-8">
            {/* User Info Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black   text-muted-foreground flex items-center gap-2">
                <User size={14} />
                Buyer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground ">
                    Name
                  </p>
                  <p className="text-sm font-black text-primary">
                    {createdBy?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground ">
                    Phone
                  </p>
                  <p className="text-sm font-bold text-primary flex items-center gap-1">
                    <Phone size={12} className="text-primary/40" />
                    {createdBy?.phone || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground ">
                    Email
                  </p>
                  <p className="text-sm font-bold text-primary flex items-center gap-1">
                    <Mail size={12} className="text-primary/40" />
                    {createdBy?.email || "N/A"}
                  </p>
                </div>
              </div>
            </section>

            {/* Requirement Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black   text-muted-foreground flex items-center gap-2">
                <Package size={14} />
                {type === "ENQUIRY" ? "Requested Items" : "Requested Services"}
              </h3>
              <div className="space-y-3">
                {type === "ENQUIRY"
                  ? (activity as Enquiry).enquiryLineItems.map(
                      (item: EnquiryLineItem, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start p-3 rounded-lg border bg-white shadow-sm"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-primary">
                              {item.item?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.remarks || "No remarks"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-primary">
                              {item.quantity} {formatUnitType(item.unitType)}
                            </p>
                          </div>
                        </div>
                      ),
                    )
                  : (activity as Appointment).appointmentLineItems.map(
                      (item: AppointmentLineItem, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start p-3 rounded-lg border bg-white shadow-sm"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-primary">
                              {item.item?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.remarks || "No remarks"}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
              </div>
            </section>

            {/* Additional Info Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {type === "ENQUIRY" ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-black   text-muted-foreground flex items-center gap-2">
                    <MapPin size={14} />
                    Delivery Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">
                      {(activity as Enquiry).enquiryDetails?.[0]?.address ||
                        "No address provided"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xs font-black   text-muted-foreground flex items-center gap-2">
                    <Calendar size={14} />
                    Preferred Slots
                  </h3>
                  <div className="space-y-2">
                    {(activity as Appointment).appointmentSlots.map(
                      (slot, idx) => (
                        <div
                          key={idx}
                          className="text-sm font-medium text-primary flex items-center gap-2"
                        >
                          <Clock size={12} className="text-primary/40" />
                          {format(
                            new Date(slot.fromDateTime),
                            "MMM dd, yyyy hh:mm a",
                          )}{" "}
                          - {format(new Date(slot.toDateTime), "hh:mm a")}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-black   text-muted-foreground flex items-center gap-2">
                  <MessageSquare size={14} />
                  Additional Remarks
                </h3>
                <p className="text-sm font-medium text-primary italic">
                  {type === "ENQUIRY"
                    ? (activity as Enquiry).enquiryDetails?.[0]?.remarks
                    : (activity as Appointment).appointmentDetails?.[0]
                        ?.remarks || "None"}
                </p>
              </div>
            </section>

            <Separator />

            {/* Responses Section */}
            <section className="space-y-4">
              <h3 className="text-xs font-black   text-muted-foreground flex items-center gap-2">
                {type === "ENQUIRY" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <Clock size={14} />
                )}
                {type === "ENQUIRY"
                  ? "Seller Responses (Quotations)"
                  : "Provider Responses (Visits)"}
              </h3>

              {type === "ENQUIRY" ? (
                <div className="space-y-4">
                  {quotations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
                      <AlertCircle size={24} className="mb-2 opacity-20" />
                      <p className="text-sm font-bold">
                        No quotations received yet.
                      </p>
                    </div>
                  ) : (
                    quotations.map((quo, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border bg-white shadow-sm space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-primary">
                              {quo.createdBy?.name || "Seller"}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[9px] font-black  "
                            >
                              {quo.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(quo.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-2 bg-emerald-50 rounded-lg">
                            <p className="text-[10px] font-black text-emerald-600 ">
                              Rate
                            </p>
                            <p className="font-black text-emerald-700">
                              ₹ {quo.quotationLineItems[0]?.rate || 0}
                            </p>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <p className="text-[10px] font-black text-slate-500 ">
                              Remarks
                            </p>
                            <p className="font-medium text-primary text-xs truncate">
                              {quo.quotationDetails?.[0]?.remarks || "None"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {!visit ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
                      <AlertCircle size={24} className="mb-2 opacity-20" />
                      <p className="text-sm font-bold">
                        No visit scheduled yet.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-primary">
                            {visit.createdBy?.name || "Provider"}
                          </p>
                          <Badge
                            className={cn(
                              "text-[9px] font-black  ",
                              visit.status === "COMPLETED"
                                ? "bg-emerald-500"
                                : "bg-blue-500",
                            )}
                          >
                            {visit.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Scheduled:{" "}
                          {format(
                            new Date(visit.visitSlot?.fromDateTime || ""),
                            "MMM dd, yyyy",
                          )}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-blue-600  ">
                            Time Slot
                          </p>
                          <p className="text-xs font-black text-blue-800">
                            {format(
                              new Date(visit.visitSlot?.fromDateTime || ""),
                              "hh:mm a",
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(visit.visitSlot?.toDateTime || ""),
                              "hh:mm a",
                            )}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-black text-blue-600  ">
                            Type
                          </p>
                          <p className="text-xs font-black text-blue-800">
                            Physical Visit
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
