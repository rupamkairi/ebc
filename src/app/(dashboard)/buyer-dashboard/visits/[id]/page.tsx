"use client";

import { useParams, useRouter } from "next/navigation";
import { TFunction } from "i18next";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  User,
  Package,
  ExternalLink,
  FileText as FileTextIcon,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ReviewSnapshot } from "@/components/shared/reviews";
import { useVisitQuery, useAppointmentQuery } from "@/queries/activityQueries";
import { Visit } from "@/types/activity";
import { Separator } from "@/components/ui/separator";

export default function BuyerVisitDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const { data: visit, isLoading: isVisitLoading } = useVisitQuery(id);
  const { data: appointment, isLoading: isAptLoading } = useAppointmentQuery(
    visit?.appointmentId || "",
  );

  const isLoading = isVisitLoading || isAptLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!visit || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl font-bold">Visit not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const details = appointment.appointmentDetails?.[0];
  const firstItem = appointment.appointmentLineItems?.[0];
  const isCompleted = visit.status === "COMPLETED";
  const isConfirmed = visit.isActive || visit.status === "SCHEDULED";

  const providerName =
    visit.createdBy?.staffAt?.name ||
    visit.createdBy?.createdEntities?.[0]?.name ||
    visit.createdBy?.name ||
    "Service Provider";
  const providerEntityId =
    visit.createdBy?.staffAtEntityId ||
    visit.createdBy?.createdEntities?.[0]?.id ||
    "";

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-10 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation and Title */}
      <div className="flex flex-col gap-4">
        <Link
          href="/buyer-dashboard/visits"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Visits
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest bg-muted uppercase"
              >
                VIS#{visit.id.slice(-8).toUpperCase()}
              </Badge>
              <Badge
                className={cn(
                  "uppercase text-[10px] font-black tracking-widest",
                  isCompleted
                    ? "bg-blue-600"
                    : isConfirmed
                      ? "bg-emerald-500"
                      : "bg-amber-500",
                )}
              >
                {visit.status}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-primary">
              Visit Details
            </h1>
            <p className="text-muted-foreground font-medium">
              Confirmed with{" "}
              <span className="text-foreground font-bold">{providerName}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Confirmed Schedule Summary */}
          {visit.visitSlot && (
            <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-emerald-50 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Confirmed Service Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 border border-emerald-100">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest">
                        Date
                      </p>
                      <p className="font-black text-sm text-emerald-900">
                        {format(new Date(visit.visitSlot.fromDateTime), "PPP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 border border-emerald-100">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest">
                        Time Slot
                      </p>
                      <p className="font-black text-sm text-emerald-900">
                        {format(new Date(visit.visitSlot.fromDateTime), "p")} -{" "}
                        {format(new Date(visit.visitSlot.toDateTime), "p")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Items */}
          <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Service Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-dashed">
                {appointment.appointmentLineItems?.map((li) => (
                  <div
                    key={li.id}
                    className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 group hover:bg-muted/10 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-primary">
                            {li.item?.name}
                          </h4>
                        </div>
                      </div>
                      {li.remarks && (
                        <div className="ml-13 p-3 rounded-xl bg-amber-50 text-[11px] font-medium text-amber-800 border border-amber-200/50">
                          <b>Note:</b> {li.remarks}
                        </div>
                      )}

                      {/* Attachments / Images */}
                      {li.itemListing?.attachments &&
                        li.itemListing.attachments.length > 0 && (
                          <div className="ml-13 mt-4 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                              Attached Media & Documents
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {li.itemListing.attachments.map((att: any) => {
                                if (att.media) {
                                  return (
                                    <a
                                      key={att.id}
                                      href={att.media.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="group/image relative h-16 w-16 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-muted/30"
                                    >
                                      <img
                                        src={att.media.url}
                                        alt="Attachment"
                                        className="h-full w-full object-cover transition-transform group-hover/image:scale-110"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                        <ExternalLink className="h-4 w-4 text-white" />
                                      </div>
                                    </a>
                                  );
                                }
                                if (att.document) {
                                  return (
                                    <a
                                      key={att.id}
                                      href={att.document.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 max-w-[200px] p-2 pr-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                                    >
                                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileTextIcon className="h-4 w-4 text-primary" />
                                      </div>
                                      <div className="truncate flex-1">
                                        <p
                                          className="text-xs font-bold text-primary truncate"
                                          title={
                                            att.document.name || "Document"
                                          }
                                        >
                                          {att.document.name || "Document"}
                                        </p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">
                                          {att.document.mimeType?.split(
                                            "/",
                                          )[1] || "FILE"}
                                        </p>
                                      </div>
                                      <Download className="h-3 w-3 text-muted-foreground shrink-0" />
                                    </a>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location & Details */}
          {details && (
            <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Visit Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="font-bold text-sm leading-relaxed">
                      {details.address || "N/A"}
                    </p>
                  </div>
                </div>

                {details.remarks && (
                  <div className="flex items-start gap-3 pt-4 border-t">
                    <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Remarks
                      </p>
                      <p className="text-sm font-medium leading-relaxed italic">
                        {details.remarks}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Service Provider Info */}
          <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Service Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  {(providerName || "S").charAt(0)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-primary">
                    {providerName}
                  </h4>
                  <ReviewSnapshot
                    entityId={providerEntityId}
                    entityName={providerName}
                    className="justify-center"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Visit ID
                </p>
                <p className="font-mono text-xs bg-muted/50 p-2 rounded-lg">
                  {visit.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Linked Appointment */}
          <Card className="rounded-3xl border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                Linked Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    ID
                  </span>
                  <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded">
                    {appointment.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <p className="font-black text-sm">
                  {firstItem?.item?.name || "Service Visit"}
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full h-12 rounded-xl font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Link href={`/buyer-dashboard/appointments/${appointment.id}`}>
                  View Appointment
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Directions */}
          {details?.address && (
            <Button
              asChild
              variant="outline"
              className="w-full h-12 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
