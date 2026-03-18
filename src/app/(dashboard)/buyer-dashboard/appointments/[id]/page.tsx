"use client";

import { useParams, useRouter } from "next/navigation";
import { TFunction } from "i18next";
import {
  useAppointmentQuery,
  useVisitsQuery,
  useAcceptVisitMutation,
  useCompleteAppointmentMutation,
} from "@/queries/activityQueries";
import {
  ReputationSection,
  ReviewForm,
  ReviewSnapshot,
} from "@/components/shared/reviews";
import { useAppointmentReviewQuery } from "@/queries/reviewQueries";
import { useQueryClient } from "@tanstack/react-query";
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
  Bell,
  PartyPopper,
  Star,
  ExternalLink,
  FileText as FileTextIcon,
  Download,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export default function BuyerAppointmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: appointment, isLoading: loadingAppointment } =
    useAppointmentQuery(id);
  const { data: visits, isLoading: loadingVisits } = useVisitsQuery({
    appointmentId: id,
  });
  const acceptMutation = useAcceptVisitMutation();
  const completeMutation = useCompleteAppointmentMutation();

  const activeVisits =
    visits?.filter((v: import("@/types/activity").Visit) => v.isActive) || [];
  const confirmedVisit = activeVisits[0];
  const isCompleted = appointment?.status === "COMPLETED";

  const providerEntityId =
    confirmedVisit?.createdBy?.staffAtEntityId ||
    confirmedVisit?.createdBy?.createdEntities?.[0]?.id ||
    "";

  // Check if buyer already left a review for this specific appointment
  const existingReview = useAppointmentReviewQuery(
    providerEntityId,
    id as string,
  );
  const hasReviewed = !!existingReview;

  const handleAccept = async (visitId: string) => {
    try {
      await acceptMutation.mutateAsync(visitId);
      toast.success(t("visit_confirmed_msg"));
    } catch (error: unknown) {
      toast.error((error as Error).message || t("visit_confirm_failed_msg"));
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(id);
      toast.success(t("service_completed_new_msg"));
    } catch (error: unknown) {
      toast.error((error as Error).message || t("service_update_failed_msg"));
    }
  };

  if (loadingAppointment || loadingVisits) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xl font-bold">{t("appointment_not_found_text")}</p>
        <Button onClick={() => router.back()}>{t("go_back_btn")}</Button>
      </div>
    );
  }

  const firstItem = appointment.appointmentLineItems?.[0];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/buyer-dashboard/appointments"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_appointments_link")}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="outline"
                className="font-mono text-[10px] tracking-widest bg-muted uppercase"
              >
                ID: {appointment.id.slice(0, 8)}
              </Badge>
              <Badge
                className={cn(
                  "uppercase text-[10px] font-black tracking-widest",
                  appointment.status === "APPROVED"
                    ? "bg-emerald-500"
                    : appointment.status === "COMPLETED"
                      ? "bg-blue-600"
                      : "bg-amber-500",
                )}
              >
                {appointment.status}
              </Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">
              {t("visit_confirmation_title")}
            </h1>
          </div>

          {confirmedVisit && !isCompleted && (
            <div className="flex flex-col items-end gap-2">
              {confirmedVisit.status === "COMPLETED" ? (
                <Button
                  onClick={handleComplete}
                  disabled={completeMutation.isPending}
                  className="h-14 rounded-3xl bg-blue-600 hover:bg-blue-700 font-black gap-2 px-8 shadow-xl shadow-blue-500/20 animate-in zoom-in duration-300"
                >
                  {completeMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  {t("mark_completed_btn")}
                </Button>
              ) : (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 select-none">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    {t(
                      "waiting_service_delivery",
                      "Waiting for service delivery",
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isCompleted && (
        <div className="p-8 rounded-4xl bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="h-20 w-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <PartyPopper className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {t("service_completed_title")}
              </h2>
              <p className="text-muted-foreground font-medium max-w-sm">
                {t("how_was_experience_with")}{" "}
                <b>
                  {confirmedVisit?.createdBy?.staffAt?.name ||
                    confirmedVisit?.createdBy?.createdEntities?.[0]?.name ||
                    confirmedVisit?.createdBy?.name}
                </b>
                ?
              </p>
            </div>
          </div>
          {hasReviewed ? (
            <div className="flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="font-black text-emerald-700 text-sm">
                {t("review_submitted") || "Review Submitted — Thank you!"}
              </span>
            </div>
          ) : confirmedVisit ? (
            <ReviewForm
              entityId={providerEntityId || undefined}
              appointmentId={id as string}
              isVerified={true}
              onSuccess={() => {
                queryClient.invalidateQueries({
                  queryKey: ["entity-reviews", providerEntityId],
                });
              }}
              trigger={
                <Button
                  size="lg"
                  className="h-16 rounded-full px-10 bg-emerald-500 hover:bg-emerald-600 font-black gap-3 text-lg shadow-xl shadow-emerald-500/20 group"
                >
                  <Star className="h-6 w-6 fill-current group-hover:rotate-12 transition-transform" />
                  {t("rate_your_experience")}
                </Button>
              }
            />
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Appointment Info */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t("service_professional_title")}
            </h3>
            <Card className="overflow-hidden border-none shadow-sm bg-muted/30">
              <CardContent className="p-8">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black tracking-tight">
                    {firstItem?.item?.name || t("service_request_title")}
                  </h4>
                  <p className="text-muted-foreground italic">
                    &quot;{firstItem?.remarks || t("no_instructions_text")}
                    &quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator className="opacity-50" />

          <section className="space-y-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t("my_requested_slots", "My Requested Slots")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {appointment.appointmentSlots.map(
                (
                  slot: import("@/types/activity").AppointmentSlot,
                  index: number,
                ) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-white border shadow-sm space-y-2"
                  >
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {t("slot_label", "Slot")} {index + 1}
                    </p>
                    <div>
                      <p className="font-black text-sm">
                        {format(new Date(slot.fromDateTime), "MMM do, yyyy")}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-bold">
                        {format(new Date(slot.fromDateTime), "p")} -{" "}
                        {format(new Date(slot.toDateTime), "p")}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* Visits/Confirmations Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                {t("service_provider_responses_title")}
              </h3>
            </div>

            <div className="space-y-8">
              {!visits || visits.length === 0 ? (
                <div className="p-12 text-center bg-muted/20 border border-dashed rounded-3xl">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground font-medium">
                    {t("waiting_provider_slot")}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {(isCompleted
                    ? confirmedVisit
                      ? [confirmedVisit]
                      : []
                    : visits || []
                  ).map((v: import("@/types/activity").Visit) => (
                    <VisitListItem
                      key={v.id}
                      v={v}
                      t={t}
                      onAccept={handleAccept}
                      isAccepting={acceptMutation.isPending}
                      isAppointmentClosed={isCompleted}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Detailed reputation for the confirmed provider */}
            {isCompleted && confirmedVisit && (
              <div className="mt-16 pt-16 border-t animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <ReputationSection
                  entityId={providerEntityId}
                  entityName={
                    confirmedVisit.createdBy?.staffAt?.name ||
                    confirmedVisit.createdBy?.name
                  }
                />
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Quick Info */}
        <div className="space-y-6">
          <Card className="rounded-4xl border-none shadow-lg shadow-black/5 bg-linear-to-b from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-black tracking-tight">
                {t("visit_location_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {t("address_label_text")}
                  </p>
                  <p className="font-bold text-sm leading-relaxed">
                    {appointment.appointmentDetails?.[0]?.address || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function VisitListItem({
  v,
  t,
  onAccept,
  isAccepting,
  isAppointmentClosed,
}: {
  v: import("@/types/activity").Visit;
  t: TFunction;
  onAccept: (visitId: string) => void;
  isAccepting: boolean;
  isAppointmentClosed: boolean;
}) {
  const providerId =
    v.createdBy?.staffAtEntityId || v.createdBy?.createdEntities?.[0]?.id || "";
  const providerName =
    v.createdBy?.staffAt?.name ||
    v.createdBy?.createdEntities?.[0]?.name ||
    v.createdBy?.name ||
    "";

  const firstItem = v.appointment?.appointmentLineItems?.[0];

  return (
    <Card className="rounded-4xl bg-white border shadow-xl shadow-black/5 relative overflow-hidden group">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black tracking-widest">
            {v.isActive
              ? t("confirmed_visit_label", "Confirmed Visit")
              : t("scheduled_visit_label")}
          </Badge>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary font-black text-xs"
          >
            <Link href={`/buyer-dashboard/visits/${v.id}`}>
              View Details <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                {t("service_by_text")}
              </p>
              <h4 className="text-2xl font-black tracking-tight">
                {providerName}
              </h4>
              <div className="mt-2">
                <ReviewSnapshot
                  entityId={providerId}
                  entityName={providerName}
                  className="scale-90 origin-left"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border">
                <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {t("date_label")}
                  </p>
                  <p className="font-black text-sm">
                    {v.visitSlot
                      ? format(new Date(v.visitSlot.fromDateTime), "PPP")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border">
                <div className="h-10 w-10 rounded-xl bg-white border flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {t("time_slot_label")}
                  </p>
                  <p className="font-black text-sm">
                    {v.visitSlot ? (
                      <>
                        {format(new Date(v.visitSlot.fromDateTime), "p")} -{" "}
                        {format(new Date(v.visitSlot.toDateTime), "p")}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Attachments / Images */}
            {firstItem?.itemListing?.attachments &&
              firstItem.itemListing.attachments.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Service Images & Documents
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {firstItem.itemListing.attachments.map((att: any) => {
                      if (att.media) {
                        return (
                          <a
                            key={att.id}
                            href={att.media.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group/image relative h-12 w-12 rounded-lg overflow-hidden border border-border flex items-center justify-center bg-muted/30"
                          >
                            <img
                              src={att.media.url}
                              alt="Attachment"
                              className="h-full w-full object-cover transition-transform group-hover/image:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                              <ExternalLink className="h-3 w-3 text-white" />
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
                            className="flex items-center gap-2 max-w-[160px] p-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                          >
                            <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                              <FileTextIcon className="h-3 w-3 text-primary" />
                            </div>
                            <div className="truncate flex-1">
                              <p className="text-[10px] font-bold text-primary truncate">
                                {att.document.name || "Document"}
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

          <div className="md:w-64 flex flex-col justify-center shrink-0">
            {v.isActive ? (
              <Button
                className="w-full h-14 rounded-3xl bg-emerald-500 hover:bg-emerald-600 font-black gap-2"
                disabled
              >
                <CheckCircle2 className="h-5 w-5" />
                {t("confirmed_label")}
              </Button>
            ) : (
              <Button
                className="w-full h-14 rounded-3xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                onClick={() => onAccept(v.id)}
                disabled={isAccepting || isAppointmentClosed}
              >
                {isAccepting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t("confirm_schedule_btn")
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border w-full", className)} />;
}
