"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Calendar,
  Loader2,
  MapPin,
  MessageSquare,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
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
        <Loader2 className="h-8 w-8 animate-spin text-[#3D52A0]" />
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
  const isPending = visit.status === "PENDING";
  const isAccepted =
    visit.status === "ACCEPTED" || visit.status === "SCHEDULED";
  const isCompleted = visit.status === "COMPLETED";

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
          <h1 className="text-2xl font-black text-[#1e2b6b] tracking-tight">
            {t("visit_details_title", "Visit Details")}
          </h1>
          <p className="text-sm text-[#3D52A0]/60 font-medium">
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-3">
                <h2 className="text-xl font-black text-[#1e2b6b]">
                  {t("visit_details_title", "Visit Details")}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full border-2 border-[#FFA500] text-[#FFA500] text-xs font-black tracking-wide">
                    ID: {visit.id.slice(0, 8)}
                  </span>
                  <span
                    className={cn(
                      "px-4 py-1 rounded-full text-xs font-black tracking-wide text-white",
                      isCompleted ? "bg-green-600" : "bg-[#3D52A0]",
                    )}
                  >
                    {visit.status}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-xs text-gray-400 font-semibold">
                  {t("submitted_on", "Created On")}
                </p>
                <p className="text-sm font-black text-[#1e2b6b]">
                  {format(new Date(visit.createdAt), "MMMM do, yyyy")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Linked Appointment */}
            <div className="space-y-3">
              <h3 className="font-black text-[#1e2b6b] flex items-center gap-2 text-base">
                <PackageCheck className="h-5 w-5 text-[#FFA500]" />
                {t("linked_appointment_info", "Linked Appointment")}
              </h3>
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#3D52A0]/40 uppercase tracking-widest">
                    ID: {appointment.id.slice(0, 8)}
                  </span>
                  <Link
                    href={`/seller-dashboard/appointments/${appointment.id}`}
                    className="text-xs font-black text-[#FFA500] hover:underline"
                  >
                    {t("view_details", "View Appointment")} →
                  </Link>
                </div>
                <p className="font-black text-[#1e2b6b]">
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
                <h4 className="text-sm font-black text-[#FFA500] flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t("visit_location_title", "Visit Location")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {details?.address || t("not_specified")}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-[#3D52A0] flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("scheduled_visit_label", "Scheduled Date")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {format(new Date(visit.createdAt), "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            {/* Additional remarks */}
            {details?.remarks && (
              <div className="space-y-2">
                <h4 className="text-sm font-black text-[#3D52A0] flex items-center gap-2">
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
                actionLabel={t("accept_visit_btn", "Accept Visit")}
                onAction={handleAccept}
                actionIcon={<CheckCircle2 className="h-4 w-4" />}
                actionDescription={t(
                  "waiting_provider_confirm",
                  "Confirm you're ready for this visit.",
                )}
                respondedLabel=""
                respondedDescription=""
                backHref="/seller-dashboard/visits"
                backLabel={t("back_to_visits", "Back to Visits")}
                isProcessing={isAccepting}
              />
            )}

            {(isPending || isAccepted) && (
              <ActivityActionCard
                isPending={true}
                actionLabel={t("complete_visit_btn", "Mark as Completed")}
                onAction={handleComplete}
                actionIcon={<PackageCheck className="h-4 w-4" />}
                actionDescription={t(
                  "mark_as_completed_btn",
                  "Mark this visit as finished after the onsite consultation.",
                )}
                respondedLabel=""
                respondedDescription=""
                backHref="/seller-dashboard/visits"
                backLabel={t("back_to_visits")}
                isProcessing={isCompleting}
              />
            )}

            {isCompleted && (
              <ActivityActionCard
                isPending={false}
                actionLabel=""
                respondedLabel={t("service_completed_title", "Visit Completed")}
                respondedDescription={t(
                  "service_completed_msg",
                  "This site visit has been successfully completed.",
                )}
                backHref="/seller-dashboard/visits"
                backLabel={t("back_to_visits")}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl font-black text-xs h-10 border-[#3D52A0]/20 text-[#3D52A0]"
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
