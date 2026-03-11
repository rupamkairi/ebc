"use client";

import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";
import { BuyerDetailsForm } from "@/components/dashboard/buyer/shared/buyer-details-form";
import { EnquiryLineItems } from "@/components/dashboard/buyer/enquiry/enquiry-line-items";
import { Button } from "@/components/ui/button";
import { useEnquiryStore } from "@/store/enquiryStore";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useSessionQuery, useSendOtpMutation } from "@/queries/authQueries";
import { BuyerProfileCard } from "@/components/dashboard/buyer/dashboard-components";
import { AddToEnquiryModal } from "@/components/browse/add-to-enquiry-modal";
import { usePrefetchBuyerDetails } from "@/hooks/usePrefetchBuyerDetails";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { Item } from "@/types/catalog";
import { Product } from "@/queries/browse.queries";

export default function CreateEnquiryPage() {
  const router = useRouter();
  const { items, buyerDetails, setBuyerDetails } = useEnquiryStore();
  const { data: session } = useSessionQuery();
  const sendOtp = useSendOtpMutation();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleItemSelect = (item: Item) => {
    // Adapter to match Product interface expected by Modal
    const product: Product = {
      id: item.id,
      title: item.name,
      description: item.description || "",
      price: 0,
      image:
        item.brand?.brandLogo?.url ||
        item.category?.categoryIcon?.url ||
        "https://placehold.co/300x300",
      category: item.category?.name || "Unknown",
      categoryName:
        item.category?.parentCategory?.name ||
        (item.category?.parentCategoryId
          ? "Unknown Parent"
          : item.category?.name || "Unknown"),
      subCategoryName: item.category?.parentCategoryId
        ? item.category?.name
        : undefined,
      categoryId: item.category?.parentCategoryId || item.categoryId,
      subCategoryId: item.category?.parentCategoryId
        ? item.categoryId
        : undefined,
      brand: item.brand?.name || "Unknown",
      rating: 0,
      type: (item.type?.toLowerCase() === "service" ? "service" : "product") as
        | "product"
        | "service",
    };

    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  usePrefetchBuyerDetails(setBuyerDetails, buyerDetails, session?.user);

  const handleNext = async () => {
    // Validate that items exist
    if (items.length === 0) {
      toast.error(t("please_add_item"));
      return;
    }

    // Validate form details
    if (
      !buyerDetails ||
      !buyerDetails.name ||
      !buyerDetails.phoneNumber ||
      !buyerDetails.pincodeDirectoryId ||
      !buyerDetails.address
    ) {
      toast.error(t("please_fill_details"));
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
        router.push("/enquiry/create/otp-verify");
      } catch (error) {
        toast.error(t("failed_send_code"));
        console.error(error);
      }
      return;
    }

    router.push("/enquiry/create/review-submit");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-10 px-4 sm:px-6 lg:px-8 mb-20 animate-in fade-in duration-700">
      {/* Session Profile Card */}
      {session?.user && (
        <BuyerProfileCard
          name={session.user.name}
          role={t("buyer")}
          avatarUrl={session.user.image || undefined}
        />
      )}

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          {t("create_new_enquiry")}
        </h1>
        <p className="text-primary/60 font-medium ml-1">
          {t("fill_details_below")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12">
        {/* Left Column: Items */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-8">
            <ItemSearch type="PRODUCT" onItemSelect={handleItemSelect} />

            {selectedProduct && (
              <AddToEnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
              />
            )}

            {items.length > 0 && (
              <div className="pt-4 border-t border-primary/10">
                <h3 className="text-sm font-bold tracking-widest text-primary/40 uppercase mb-4 ml-1">
                  {t("items_added_to_enquiry", { count: items.length })}
                </h3>
                <EnquiryLineItems />
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Buyer Details Form */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              {t("buyer_details")}
            </h2>
            <BuyerDetailsForm
              defaultValues={buyerDetails}
              onChange={setBuyerDetails}
              showExpectedDate={true}
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
