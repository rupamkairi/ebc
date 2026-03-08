"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/store/appointmentStore";
import { AppointmentLineItemWrapper } from "@/components/dashboard/buyer/appointment/appointment-line-item";
import { DateTimeSlotSelect } from "@/components/advanced-forms/date-time-slot-select/date-time-slot-select";
import { BuyerDetailsForm } from "@/components/dashboard/buyer/shared/buyer-details-form";
import { usePrefetchBuyerDetails } from "@/hooks/usePrefetchBuyerDetails";
import { useSessionQuery, useSendOtpMutation } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";
import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";
import { AddToAppointmentModal } from "@/components/browse/add-to-appointment-modal";
import { useState } from "react";
import { Item } from "@/types/catalog";
import { Product } from "@/queries/browse.queries";
import { useLanguage } from "@/hooks/useLanguage";

export default function CreateAppointmentPage() {
  const router = useRouter();
  const {
    item,
    timeSlots,
    buyerDetails,
    addTimeSlot,
    removeTimeSlot,
    setBuyerDetails,
  } = useAppointmentStore();
  const { data: session } = useSessionQuery();
  const sendOtp = useSendOtpMutation();
  const { t } = useLanguage();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemSelect = (selectedItem: Item) => {
    const product: Product = {
      id: selectedItem.id,
      title: selectedItem.name,
      description: selectedItem.description || "",
      price: 0,
      image:
        selectedItem.brand?.brandLogo?.url ||
        selectedItem.category?.categoryIcon?.url ||
        "https://placehold.co/300x300",
      category: selectedItem.category?.name || "Unknown",
      categoryName:
        selectedItem.category?.parentCategory?.name ||
        (selectedItem.category?.parentCategoryId
          ? "Unknown Parent"
          : selectedItem.category?.name || "Unknown"),
      subCategoryName: selectedItem.category?.parentCategoryId
        ? selectedItem.category?.name
        : undefined,
      categoryId:
        selectedItem.category?.parentCategoryId || selectedItem.categoryId,
      subCategoryId: selectedItem.category?.parentCategoryId
        ? selectedItem.categoryId
        : undefined,
      brand: selectedItem.brand?.name || "Unknown",
      rating: 0,
      type: (selectedItem.type?.toLowerCase() === "service"
        ? "service"
        : "product") as "product" | "service",
    };

    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  usePrefetchBuyerDetails(setBuyerDetails, buyerDetails, session?.user);

  const handleNext = async () => {
    // 1. Validate Item
    if (!item) {
      toast.error(t("select_appointment_item"));
      return;
    }

    // 2. Validate Time Slots
    if (timeSlots.length < 3) {
      toast.error(t("provide_time_slots"));
      return;
    }

    // 3. Validate Details (Basic check)
    if (
      !buyerDetails ||
      !buyerDetails.name ||
      !buyerDetails.phoneNumber ||
      !buyerDetails.pincodeDirectoryId
    ) {
      toast.error(t("fill_contact_details"));
      return;
    }

    // If no active session, initiate silent registration/login
    if (!session?.user) {
      try {
        await sendOtp.mutateAsync({
          phone: buyerDetails.phoneNumber,
          name: buyerDetails.name,
          type: "BUYER",
        });
        toast.info(t("verification_code_sent"));
        router.push("/appointment/create/otp-verify");
      } catch (error) {
        toast.error(t("verification_code_failed"));
        console.error(error);
      }
      return;
    }

    router.push("/appointment/create/review-submit");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 px-4 sm:px-6 lg:px-8 mb-20 animate-in fade-in duration-700">
      {/* Session Profile Card */}
      {session?.user && (
        <BuyerProfileCard
          name={session.user.name}
          role={session.user.role || "Buyer"}
          avatarUrl={session.user.image || undefined}
        />
      )}

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          {t("create_new_appointment")}
        </h1>
        <p className="text-primary/60 font-medium ml-1">
          {t("select_item_choose_slots")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12">
        {/* Left Column: Item Selection & Time Slots */}
        <div className="lg:col-span-4 space-y-12">
          {/* Item Selection */}
          <section className="space-y-8">
            {!item && (
              <ItemSearch type="SERVICE" onItemSelect={handleItemSelect} />
            )}

            {selectedProduct && (
              <AddToAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
              />
            )}

            {item && (
              <div className="pt-4 border-t border-primary/10">
                <AppointmentLineItemWrapper />
              </div>
            )}
          </section>

          {/* Time Slots */}
          <section className="space-y-6 pt-4 border-t border-primary/10">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              {t("preferred_time_slots")}
            </h2>
            <DateTimeSlotSelect
              timeSlots={timeSlots}
              onAddSlot={addTimeSlot}
              onRemoveSlot={removeTimeSlot}
            />
          </section>
        </div>

        {/* Right Column: Buyer Details & Action */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              {t("buyer_details")}
            </h2>
            <BuyerDetailsForm
              defaultValues={buyerDetails}
              onChange={setBuyerDetails}
            />
          </section>

          {/* Action Footer */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleNext}
              className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-secondary hover:to-secondary text-white font-bold tracking-tight py-7 rounded-2xl text-lg shadow-[0_20px_50px_rgba(15,40,169,0.3)] transition-all duration-500 hover:scale-105 active:scale-95 group border-none"
            >
              {t("proceed_to_verify")}
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2 duration-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
