"use client";

import { useLanguage } from "@/hooks/useLanguage";
import {
  useAppointmentQuery,
  useCreateVisitMutation,
} from "@/queries/activityQueries";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Loader2, Calendar, Clock, MapPin, PackageCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageBackButton } from "@/components/dashboard/seller/activity-shared/page-back-button";
import { CoinDeductionModal } from "@/components/dashboard/seller/coin-deduction-modal";
import { REF_TYPE } from "@/types/activity";
import { toast } from "sonner";
import { format } from "date-fns";

function VisitCreateContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId");
  const slotIdxParam = searchParams.get("slotIdx");

  const { data: appointment, isLoading } = useAppointmentQuery(
    appointmentId || "",
  );
  const { mutate: createVisit, isPending: isCreating } =
    useCreateVisitMutation();
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(
    slotIdxParam ? parseInt(slotIdxParam) : 0,
  );
  const [showCoinModal, setShowCoinModal] = useState(false);

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
        <Button onClick={() => router.back()} variant="outline">
          {t("go_back")}
        </Button>
      </div>
    );
  }

  const selectedSlot = appointment.appointmentSlots?.[selectedSlotIdx];
  const firstItem = appointment.appointmentLineItems?.[0];
  const details = appointment.appointmentDetails?.[0];

  const handleConfirm = () => {
    if (!selectedSlot?.id) {
      toast.error("Please select a time slot.");
      return;
    }
    createVisit(
      { appointmentId: appointment.id, visitSlotId: selectedSlot.id },
      {
        onSuccess: () => {
          toast.success(t("coins_deducted_appointment_confirmed"));
          router.push("/seller-dashboard/visits");
        },
        onError: (err: any) => {
          toast.error(err.message || t("failed_confirm_appointment"));
          setShowCoinModal(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <PageBackButton
          href={`/seller-dashboard/appointments/${appointment.id}`}
        />
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            {t("confirm_visit_title", "Confirm Site Visit")}
          </h1>
          <p className="text-sm text-primary/60 font-medium">
            {t(
              "appointment_confirmation_subtitle",
              "Review appointment details and confirm to schedule a visit.",
            )}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-primary">
              {t("appointment_summary", "Appointment Summary")}
            </h2>
            <span className="px-3 py-1 rounded-full border border-primary/10 text-primary text-[10px] font-black tracking-widest bg-primary/5 uppercase">
              ID: {appointment.id.slice(0, 8)}
            </span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <PackageCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-primary">
                  {firstItem?.item?.name || t("site_visit")}
                </p>
                <p className="text-xs text-primary/60 font-medium mt-0.5">
                  {t("requested_by")}:{" "}
                  <span className="font-bold">
                    {appointment.createdBy?.name || t("anonymous_buyer")}
                  </span>
                </p>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/40" />
                <p className="text-xs text-primary/60 font-medium truncate">
                  {details?.address || t("not_provided")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/40" />
                <p className="text-xs text-primary/60 font-medium">
                  {format(new Date(appointment.createdAt), "PPP")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Slot Selection */}
        <div className="space-y-4">
          <h3 className="font-black text-primary flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            {t("select_preferred_slot", "Confirm Time Slot")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appointment.appointmentSlots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedSlotIdx(index)}
                className={`rounded-xl border-2 p-4 transition-all text-left ${
                  selectedSlotIdx === index
                    ? "border-secondary bg-secondary/5 shadow-sm"
                    : "border-gray-100 bg-white hover:border-primary/20"
                }`}
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
              </button>
            ))}
          </div>
        </div>

        {details?.remarks && (
          <div className="space-y-4 pt-2">
            <h3 className="font-black text-primary flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("additional_remarks")}
            </h3>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
              <p className="text-sm text-gray-600 font-medium italic">
                &quot;{details.remarks}&quot;
              </p>
            </div>
          </div>
        )}

        <Separator />

        <div className="pt-2">
          <Button
            onClick={() => setShowCoinModal(true)}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-black text-sm rounded-xl h-12 shadow-md transition-all active:scale-95"
          >
            {t("confirm_and_pay", "Confirm Visit & Pay Coins")}
          </Button>
          <p className="text-[10px] text-center text-gray-400 font-medium mt-3 px-4">
            {t(
              "coin_deduction_disclaimer",
              "Coins will be deducted from your wallet upon confirmation. This action is non-refundable.",
            )}
          </p>
        </div>
      </div>

      <CoinDeductionModal
        isOpen={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        onConfirm={handleConfirm}
        leadType={REF_TYPE.VISIT}
        isProcessing={isCreating}
      />
    </div>
  );
}

export default function VisitCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VisitCreateContent />
    </Suspense>
  );
}
