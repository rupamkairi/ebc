"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Loader2,
  MapPin,
  MessageSquare,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useVisitQuery,
  useAppointmentQuery,
  useCompleteVisitMutation,
  useAcceptVisitMutation,
} from "@/queries/activityQueries";
import { BuyerInfoCard } from "@/components/dashboard/seller/activity-shared/buyer-info-card";
import { ActivityActionCard } from "@/components/dashboard/seller/activity-shared/activity-action-card";
import { ActivityTipCard } from "@/components/dashboard/seller/activity-shared/activity-tip-card";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";
import { toast } from "sonner";

export default function VisitDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: visit, isLoading: isVisitLoading } = useVisitQuery(id);
  const { data: appointment, isLoading: isAptLoading } = useAppointmentQuery(
    visit?.appointmentId || "",
  );

  const { mutate: completeVisit, isPending: isCompleting } =
    useCompleteVisitMutation();
  const { mutate: acceptVisit, isPending: isAccepting } =
    useAcceptVisitMutation();

  const isLoading = isVisitLoading || isAptLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!visit || !appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">
          {t("visit_not_found", "Visit not found")}
        </p>
        <Button asChild variant="outline">
          <Link href="/seller-dashboard/visits">{t("go_back")}</Link>
        </Button>
      </div>
    );
  }

  const details = appointment.appointmentDetails?.[0];
  const firstItem = appointment.appointmentLineItems?.[0];
  
  // NOTE: isActive means they've paid the lead cost and responded.
  // isAccepted means the buyer has picked them as one of the 3 visits.
  const isPaidResponse = visit.isActive;
  const isAcceptedByBuyer = visit.isAccepted || visit.status === "ACCEPTED";
  const isCompleted = visit.status === "COMPLETED";
  const isPending = !isPaidResponse && visit.status === "PENDING";
  const isAppointmentCompleted = appointment?.status === "COMPLETED";

  const handleComplete = () => {
    completeVisit(id, {
      onSuccess: () => {
        toast.success(
          t("service_completed_msg", "Service marked as completed!"),
        );
        router.push("/seller-dashboard/visits");
      },
      onError: (err: Error) => {
        toast.error(
          err.message ||
            t("failed_update_status_msg", "Failed to update status"),
        );
      },
    });
  };

  const handleAccept = () => {
    acceptVisit(id, {
      onSuccess: () => {
        toast.success(
          t("visit_confirmed_success_msg", "Visit accepted successfully!"),
        );
      },
      onError: (err: Error) => {
        toast.error(
          err.message ||
            t("failed_confirm_visit_msg", "Failed to accept visit"),
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-4">
        <PageBackButton href="/seller-dashboard/visits" />
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            {t("visit_details_title", "Visit Details")}
          </h1>
          <p className="text-sm text-primary/60 font-medium">
            {t(
              "manage_confirmed_visits",
              "Manage your scheduled onsite visits and consultations",
            )}
          </p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Requirements ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Confirmed Schedule Summary - ONLY show if buyer has accepted! */}
          {visit.visitSlot && isAcceptedByBuyer && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {t("confirmed_visit_details", "Confirmed Service Schedule")}
                </h3>
                <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase tracking-widest px-3">
                  {visit.status === "COMPLETED" ? t("completed_status", "Completed") : t("active_status", "Confirmed")}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 border border-emerald-100">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest">
                      {t("date_label")}
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
                      {t("time_slot_label")}
                    </p>
                    <p className="font-black text-sm text-emerald-900">
                      {format(new Date(visit.visitSlot.fromDateTime), "p")} -{" "}
                      {format(new Date(visit.visitSlot.toDateTime), "p")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If Paid Response but NOT yet accepted by buyer, show status card */}
          {visit.visitSlot && isPaidResponse && !isAcceptedByBuyer && !isCompleted && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-black">
                <Clock className="h-4 w-4" />
                {t("awaiting_acceptance_title", "Response Sent - Awaiting Buyer Selection")}
              </div>
              <p className="text-sm text-amber-700 font-medium">
                {t("awaiting_acceptance_msg", "You've successfully responded with a proposed schedule. The buyer can accept up to 3 service providers for this appointment. You'll be notified if you're selected.")}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-3">
                <h2 className="text-xl font-black text-primary">
                  {t("visit_details_title", "Visit Details")}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full border-2 border-secondary text-secondary text-xs font-black tracking-wide">
                    ID: {visit.id.slice(0, 8)}
                  </span>
                  <span
                    className={cn(
                      "px-4 py-1 rounded-full text-xs font-black tracking-wide text-white",
                      isAppointmentCompleted ? "bg-blue-600" : isCompleted ? "bg-green-600" : isAcceptedByBuyer ? "bg-emerald-600" : "bg-primary",
                    )}
                  >
                    {isAppointmentCompleted
                        ? t("closed_by_buyer_label", "Closed by Buyer")
                        : isCompleted 
                            ? t("completed_label") 
                            : isAcceptedByBuyer 
                                ? t("confirmed_label") 
                                : isPaidResponse 
                                    ? t("response_sent_badge", "Response Sent") 
                                    : t("pending_label")
                    }
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-xs text-gray-400 font-semibold">
                  {t("submitted_on", "Created On")}
                </p>
                <p className="text-sm font-black text-primary">
                  {format(new Date(visit.createdAt), "MMMM do, yyyy")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Linked Appointment */}
            <div className="space-y-3">
              <h3 className="font-black text-primary flex items-center gap-2 text-base">
                <PackageCheck className="h-5 w-5 text-secondary" />
                {t("linked_appointment_info", "Linked Appointment")}
              </h3>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary/40 uppercase tracking-widest">
                    ID: {appointment.id.slice(0, 8)}
                  </span>
                  <Link
                    href={`/seller-dashboard/appointments/${appointment.id}`}
                    className="text-xs font-black text-secondary hover:underline"
                  >
                    {t("view_details", "View Appointment")} →
                  </Link>
                </div>
                <p className="font-black text-primary">
                  {firstItem?.item?.name || t("site_visit")}
                </p>
                {firstItem?.remarks && (
                  <p className="text-xs italic text-gray-400">
                    {firstItem.remarks}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Location + Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-secondary flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t("visit_location_title", "Visit Location")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {details?.address || t("not_specified")}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-primary flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {isAcceptedByBuyer 
                    ? t("confirmed_visit_label", "Confirmed Slot")
                    : t("proposed_slot_label", "Proposed Slot")
                  }
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {visit.visitSlot ? (
                    <>
                      {format(new Date(visit.visitSlot.fromDateTime), "PPP")}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(visit.visitSlot.fromDateTime), "p")} - {format(new Date(visit.visitSlot.toDateTime), "p")}
                      </span>
                    </>
                  ) : (
                    format(new Date(visit.createdAt), "dd/MM/yyyy")
                  )}
                </p>
              </div>
            </div>

            {/* Additional remarks */}
            {details?.remarks && (
              <div className="space-y-2">
                <h4 className="text-sm font-black text-primary flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t("additional_remarks")}
                </h4>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-sm text-gray-600">{details.remarks}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="space-y-4">
          {/* Buyer Info */}
          <BuyerInfoCard
            buyer={visit.createdBy}
            isContactRevealed={true} // visit exists = paid = lead revealed
          />

          {/* Action Card */}
          <div className="space-y-3">
            {isPending && (
              <ActivityActionCard
                isPending={true}
                actionLabel={t("pay_and_respond_btn", "Pay and Respond")}
                onAction={handleAccept}
                actionIcon={<CheckCircle2 className="h-4 w-4" />}
                actionDescription={t(
                  "pay_lead_cost_to_respond",
                  "Pay the lead cost to provide your availability to the buyer.",
                )}
                respondedLabel=""
                respondedDescription=""
                backHref="/seller-dashboard/visits"
                backLabel={t("back_to_visits", "Back to Visits")}
                isProcessing={isAccepting}
              />
            )}

            {isPaidResponse && !isAcceptedByBuyer && !isCompleted && (
              <div className="p-5 bg-white rounded-2xl border border-dashed border-primary/20 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                  <Clock className={cn("h-6 w-6 text-primary/40", !isAppointmentCompleted && "animate-pulse")} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-primary uppercase tracking-tight">
                    {isAppointmentCompleted ? t("closed_by_buyer", "Closed by Buyer") : t("waiting_for_buyer", "Awaiting Buyer")}
                  </p>
                  <p className="text-[10px] text-primary/60 font-bold leading-relaxed px-2">
                    {isAppointmentCompleted 
                      ? t("closed_by_buyer_msg_unpicked", "The buyer has completed this appointment with another provider. This request is now closed.")
                      : t("buyer_selection_pending", "Your response is with the buyer. You will be able to complete this service once they officially accept your visit.")}
                  </p>
                </div>
                <Button asChild variant="secondary" className="w-full rounded-xl font-black h-10 text-[10px] uppercase tracking-widest">
                    <Link href="/seller-dashboard/visits">{t("back_to_list", "Back to List")}</Link>
                </Button>
              </div>
            )}

            {isAcceptedByBuyer && !isCompleted && (
              <ActivityActionCard
                isPending={!isAppointmentCompleted}
                actionLabel={isAppointmentCompleted ? "" : t("complete_visit_btn", "Mark as Completed")}
                onAction={isAppointmentCompleted ? () => {} : handleComplete}
                actionIcon={isAppointmentCompleted ? <PackageCheck className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
                actionDescription={isAppointmentCompleted 
                  ? t("closed_by_buyer_msg", "The buyer has marked the entire appointment as complete. This visit is now closed.")
                  : t("mark_as_completed_btn", "Mark this visit as finished after the onsite consultation.")}
                respondedLabel={isAppointmentCompleted ? t("closed_by_buyer", "Closed by Buyer") : ""}
                respondedDescription={isAppointmentCompleted ? t("closed_by_buyer_msg", "The buyer has marked the entire appointment as complete. This visit is now closed.") : ""}
                backHref="/seller-dashboard/visits"
                backLabel={t("back_to_visits", "Back to Visits")}
                isProcessing={isCompleting}
                variant={isAppointmentCompleted ? "gray" : "green"}
              />
            )}

            {isCompleted && (
              <ActivityActionCard
                isPending={false}
                actionLabel=""
                respondedLabel={t("service_completed_title", "Visit Completed!")}
                respondedDescription={t(
                  "service_completed_msg",
                  "The site visit or consultation has been successfully finished.",
                )}
                backHref="/seller-dashboard/visits"
                backLabel={t("back_to_visits", "Back to Visits")}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl font-black text-xs h-10 border-primary/20 text-primary"
            >
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details?.address || "")}`}
                target="_blank"
                className="flex items-center justify-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {t("view_directions", "View Directions")}
              </Link>
            </Button>
          </div>

          {/* Tip */}
          <ActivityTipCard
            tipText={t(
              "tip_providing_quick_response",
              "Completing visits quickly helps build trust and leads to higher ratings from buyers.",
            )}
          />
        </div>
      </div>
    </div>
  );
}
