"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useItemQuery } from "@/queries/catalogQueries";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Tag,
  Layers,
  Barcode,
  Package,
  Wrench,
  Building2,
  ClipboardList,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForumSection } from "@/components/shared/forum";
import { Header } from "@/components/shared/header";
import { FooterSection } from "@/components/landing/footer-section";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import Container from "@/components/ui/containers";
import { useLanguage } from "@/hooks/useLanguage";
import { AddToEnquiryModal } from "@/components/browse/add-to-enquiry-modal";
import { AddToAppointmentModal } from "@/components/browse/add-to-appointment-modal";
import { Product } from "@/queries/browse.queries";
import { UNIT_TYPE_LABELS } from "@/constants/quantities";
import { cn } from "@/lib/utils";

export default function ItemDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: item, isLoading, error } = useItemQuery(id);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const isProduct = item?.type === "PRODUCT";
  const isService = item?.type === "SERVICE";

  // Derive a Product-compatible object from the catalog Item
  const productForModal: Product | null = item
    ? {
        id: item.id,
        title: item.name,
        description: item.description || "",
        image:
          item.brand?.brandLogo?.url ||
          item.category?.categoryIcon?.url ||
          undefined,
        category: item.category?.name || "Uncategorized",
        categoryName:
          item.category?.parentCategory?.name ||
          (item.category?.parentCategoryId
            ? "Unknown Parent"
            : item.category?.name || "Uncategorized"),
        subCategoryName: item.category?.parentCategoryId
          ? item.category?.name
          : undefined,
        categoryId:
          item.category?.parentCategoryId || item.categoryId || undefined,
        subCategoryId: item.category?.parentCategoryId
          ? item.categoryId
          : undefined,
        brand: item.brand?.name || "Generic",
        type: item.type,
        price: undefined,
        rating: undefined,
      }
    : null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">
            {t("loading_item_details")}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-destructive">
          <AlertCircle className="h-10 w-10 mb-2" />
          <p>{t("failed_load_item")}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            {t("retry")}
          </Button>
        </div>
      );
    }

    if (!item || !productForModal) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className="text-xl font-semibold">{t("item_not_found")}</p>
          <Button onClick={() => router.push("/browse")} className="mt-4">
            {t("go_browse")}
          </Button>
        </div>
      );
    }

    // Derived display fields
    const parentCategoryName =
      item.category?.parentCategory?.name || item.category?.name || "—";
    const subCategoryName = item.category?.parentCategoryId
      ? item.category?.name
      : null;
    const brandName = item.brand?.name || null;
    const specName = item.specification?.name || null;
    const specDescription = item.specification?.description || null;
    const unitTypes = item.acceptableUnitTypes ?? [];

    return (
      <div className="space-y-8 pt-6 animate-in fade-in duration-500">
        {/* Back */}
        <Button
          variant="ghost"
          className="pl-0 gap-2 hover:bg-transparent hover:text-primary transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>

        {/* Hero */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div
            className={cn(
              "px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6",
              isProduct
                ? "bg-linear-to-br from-primary/5 via-white to-primary/10"
                : "bg-linear-to-br from-secondary/5 via-white to-secondary/10",
            )}
          >
            {/* Left: Title + badges */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={cn(
                    "uppercase text-[10px] font-black tracking-widest px-3 py-1 rounded-full border-none",
                    isProduct
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary",
                  )}
                >
                  {isProduct ? (
                    <Package className="size-3 mr-1 inline-block" />
                  ) : (
                    <Wrench className="size-3 mr-1 inline-block" />
                  )}
                  {item.type}
                </Badge>
                {subCategoryName && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold tracking-wide uppercase"
                  >
                    {subCategoryName}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
                {item.name}
              </h1>

              {item.description && (
                <p className="text-slate-500 text-sm font-medium max-w-xl leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            {/* Right: CTA */}
            <div className="shrink-0">
              {isProduct ? (
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white font-black rounded-xl px-8 shadow-lg active:scale-95 transition-all gap-2"
                  onClick={() => setIsEnquiryModalOpen(true)}
                >
                  <ClipboardList className="size-5" />
                  Add to Enquiry
                </Button>
              ) : isService ? (
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white font-black rounded-xl px-8 shadow-lg active:scale-95 transition-all gap-2"
                  onClick={() => setIsAppointmentModalOpen(true)}
                >
                  <CalendarClock className="size-5" />
                  Make Appointment
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
            <div className="p-2.5 bg-primary/8 rounded-lg shrink-0">
              <Layers className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Category
              </p>
              <p className="text-sm font-bold text-slate-800">
                {parentCategoryName}
              </p>
              {subCategoryName && (
                <p className="text-xs text-slate-500 mt-0.5">
                  → {subCategoryName}
                </p>
              )}
            </div>
          </div>

          {/* HSN Code */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
            <div className="p-2.5 bg-primary/8 rounded-lg shrink-0">
              <Barcode className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                HSN Code
              </p>
              <p className="text-sm font-bold text-slate-800 font-mono">
                {item.HSNCode || "—"}
              </p>
            </div>
          </div>

          {/* GST */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
            <div className="p-2.5 bg-primary/8 rounded-lg shrink-0">
              <Tag className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                GST
              </p>
              <p className="text-sm font-bold text-slate-800">
                {item.GSTPercentage ?? 0}%
              </p>
            </div>
          </div>

          {/* Brand — only show if present */}
          {brandName && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
              <div className="p-2.5 bg-primary/8 rounded-lg shrink-0">
                <Building2 className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Brand
                </p>
                <p className="text-sm font-bold text-slate-800">{brandName}</p>
              </div>
            </div>
          )}

          {/* Acceptable Unit Types — only for products */}
          {isProduct && unitTypes.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex gap-4 items-start">
              <div className="p-2.5 bg-primary/8 rounded-lg shrink-0">
                <Package className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Unit Types
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {unitTypes.map((u) => (
                    <Badge
                      key={u}
                      variant="secondary"
                      className="text-xs font-bold"
                    >
                      {UNIT_TYPE_LABELS[u] ?? u}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Specification */}
        {(specName || specDescription) && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-black text-primary uppercase tracking-widest mb-3">
              Specification
            </h2>
            {specName && (
              <p className="text-sm font-bold text-slate-700">{specName}</p>
            )}
            {specDescription && (
              <p className="text-sm text-slate-500 mt-1">{specDescription}</p>
            )}
          </div>
        )}

        {/* Forum */}
        <div className="pt-6 border-t border-slate-100">
          <ForumSection itemId={id} />
        </div>

        {/* Modals */}
        <AddToEnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
          product={productForModal}
          onSuccess={() => router.push("/enquiry/create")}
        />
        <AddToAppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          product={productForModal}
          onSuccess={() => router.push("/appointment/create")}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faff]">
      <Header />
      <main className="flex-1 py-10">
        <Container size="lg">{renderContent()}</Container>
      </main>
      <FooterSection />
      <WhatsAppButton />
    </div>
  );
}
