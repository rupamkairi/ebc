"use client";

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
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useAppointmentQuery,
  useRejectAppointmentMutation,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { BuyerInfoCard } from "@/components/dashboard/seller/activity-shared/buyer-info-card";
import { ActivityActionCard } from "@/components/dashboard/seller/activity-shared/activity-action-card";
import { ActivityTipCard } from "@/components/dashboard/seller/activity-shared/activity-tip-card";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";
import { REF_TYPE } from "@/types/activity";
import { toast } from "sonner";

export default function AppointmentDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: appointment, isLoading } = useAppointmentQuery(id);
  const { data: visits = [] } = useVisitsQuery({ appointmentId: id });
  const { mutate: rejectAppointment, isPending: isRejecting } =
    useRejectAppointmentMutation();

  const [selectedSlotIdx, setSelectedSlotIdx] = useState(0);

  // Check if a visit already exists for this appointment
  const existingVisit = visits.find((v) => v.appointmentId === id);
  const hasActiveVisit = !!existingVisit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">
          {t("appointment_not_found_text")}
        </p>
        <Button asChild variant="outline">
          <Link href="/seller-dashboard/appointments">{t("go_back")}</Link>
        </Button>
      </div>
    );
  }

  const details = appointment.appointmentDetails?.[0];
  const isPending = appointment.status === "PENDING";
  const selectedSlot = appointment.appointmentSlots?.[selectedSlotIdx];

  const handleReject = () => {
    rejectAppointment(id, {
      onSuccess: () => {
        toast.success(t("appointment_rejected"));
        router.push("/seller-dashboard/appointments");
      },
      onError: (err: Error) => {
        toast.error(err.message || t("failed_reject_appointment"));
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-4">
        <PageBackButton href="/seller-dashboard/appointments" />
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            {t("appointment_details")}
          </h1>
          <p className="text-sm text-primary/60 font-medium">
            {isPending
              ? t("manage_onsite_visits")
              : t("appointment_rejected", "Appointment processed")}
          </p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Details ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-3">
                <h2 className="text-xl font-black text-primary">
                  {t("site_visit", "Service Requirements")}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full border-2 border-secondary text-secondary text-xs font-black tracking-wide">
                    ID: {appointment.id.slice(0, 8)}
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-black tracking-wide text-white ${
                      isPending ? "bg-primary" : "bg-green-600"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-xs text-gray-400 font-semibold">
                  {t("submitted_on")}
                </p>
                <p className="text-sm font-black text-primary">
                  {format(new Date(appointment.createdAt), "MMMM do, yyyy")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div className="space-y-3">
              <h3 className="font-black text-primary flex items-center gap-2 text-base">
                <PackageCheck className="h-5 w-5 text-secondary" />
                {t("service_request_title", "Service Requested")}
              </h3>
              <div className="space-y-3">
                {appointment.appointmentLineItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                  >
                    <div className="space-y-0.5">
                      <p className="font-black text-secondary">
                        {item.item?.name || "Service Item"}
                      </p>
                      {item.remarks && (
                        <p className="text-xs italic text-gray-400 mt-1">
                          {item.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Appointment Slots */}
            <div className="space-y-3">
              <h3 className="font-black text-primary flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-primary" />
                {t("preferred_time_slots")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {appointment.appointmentSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={!isPending}
                    onClick={() => setSelectedSlotIdx(index)}
                    className={`rounded-xl border-2 p-4 transition-all text-left ${
                      selectedSlotIdx === index
                        ? "border-secondary bg-secondary/5 shadow-sm"
                        : "border-gray-100 bg-white hover:border-primary/20"
                    } ${!isPending ? "opacity-60 cursor-default" : "cursor-pointer"}`}
                  >
                    <p className="text-xs font-black text-primary/50 uppercase tracking-widest mb-1">
                      Slot {index + 1}
                    </p>
                    <p className="text-sm font-black text-primary">
                      {format(new Date(slot.fromDateTime), "MMM do, yyyy")}
                    </p>
                    <p className="text-xs text-primary/60 font-medium mt-0.5">
                      {format(new Date(slot.fromDateTime), "h:mm a")} –{" "}
                      {format(new Date(slot.toDateTime), "h:mm a")}
                    </p>
                    {slot.remarks && (
                      <p className="text-[10px] text-gray-400 italic mt-2">
                        {slot.remarks}
                      </p>
                    )}
                  </button>
                ))}
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
                  <Calendar className="h-4 w-4" />
                  {t("preferred_date")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {selectedSlot
                    ? format(new Date(selectedSlot.fromDateTime), "dd/MM/yyyy")
                    : t("not_specified")}
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
            buyer={appointment.createdBy}
            isContactRevealed={hasActiveVisit}
          />

          {/* Action Card */}
          {isPending ? (
            <div className="space-y-3">
              <ActivityActionCard
                isPending={true}
                actionLabel={t("confirm_visit_btn", "Confirm Visit")}
                actionHref={`/seller-dashboard/visits/create?appointmentId=${appointment.id}`}
                actionIcon={<Calendar className="h-4 w-4" />}
                actionDescription={t(
                  "manage_onsite_visits",
                  "Confirm this appointment to schedule a visit.",
                )}
                respondedLabel=""
                respondedDescription=""
                backHref="/seller-dashboard/appointments"
                backLabel={t("back_to_appointments_link")}
              />
              <Button
                onClick={handleReject}
                disabled={isRejecting}
                variant="outline"
                className="w-full rounded-xl font-black text-xs text-red-600 border-red-200 hover:bg-red-50 h-10"
              >
                {isRejecting ? "Rejecting..." : t("reject")}
              </Button>
            </div>
          ) : (
            <ActivityActionCard
              isPending={false}
              actionLabel=""
              respondedLabel={
                hasActiveVisit
                  ? t("visit_confirmation_title", "Visit Created")
                  : appointment.status
              }
              respondedDescription={
                hasActiveVisit
                  ? t(
                      "visit_confirmed_msg",
                      "Appointment confirmed and visit created.",
                    )
                  : t("appointment_rejected", "This appointment was processed.")
              }
              backHref="/seller-dashboard/appointments"
              backLabel={t("back_to_appointments_link")}
            />
          )}

          {/* View Visit link */}
          {hasActiveVisit && existingVisit && (
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-xs h-10"
            >
              <Link
                href={`/seller-dashboard/visits/${existingVisit.id}`}
                className="flex items-center justify-center gap-2"
              >
                {t("view_details")} → Visit
              </Link>
            </Button>
          )}

          {/* Tip */}
          <ActivityTipCard
            tipText={t(
              "tip_providing_quick_response",
              "Confirming quickly increases your chances of winning the project by 60%.",
            )}
          />
        </div>
      </div>
    </div>
  );
}
