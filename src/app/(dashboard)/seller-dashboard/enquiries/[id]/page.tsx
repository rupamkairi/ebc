"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { activityService } from "@/services/activityService";
import { Enquiry } from "@/types/activity";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  User,
} from "lucide-react";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useQuotationsQuery } from "@/queries/activityQueries";

export default function EnquiryDetailsPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch seller entity to identify current seller
  const { data: entities } = useEntitiesQuery();
  const sellerEntityId = entities?.[0]?.id;

  // Fetch quotations related to this enquiry
  const { data: quotations } = useQuotationsQuery({ enquiryId: id });

  // Check if there's an active quotation from this seller for this enquiry
  const isActiveQuotation = quotations?.some(
    (q) => q.enquiryId === id && q.isActive,
  );

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        setLoading(true);
        const data = await activityService.getEnquiry(id);
        setEnquiry(data);
      } catch (error) {
        console.error("Error fetching enquiry:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEnquiry();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3D52A0]" />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">{t("enquiry_not_found")}</p>
        <Button asChild variant="outline">
          <Link href="/seller-dashboard/enquiries">
            {t("back_to_enquiries")}
          </Link>
        </Button>
      </div>
    );
  }

  const details = enquiry.enquiryDetails?.[0];
  const isPending = enquiry.status === "PENDING";

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button
          asChild
          size="icon"
          className="h-10 w-10 rounded-xl bg-[#FFA500] hover:bg-[#e69500] text-white border-0 shadow-md shrink-0"
        >
          <Link href="/seller-dashboard/enquiries">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black text-[#1e2b6b] tracking-tight">
            {t("active_enquiries")}
          </h1>
          <p className="text-sm text-[#3D52A0]/60 font-medium">
            {isPending
              ? t("manage_respond_enquiries_buyer")
              : t("already_responded_enquiry")}
          </p>
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Requirements ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-3">
                <h2 className="text-xl font-black text-[#1e2b6b]">
                  {t("buyer_requirements")}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full border-2 border-[#FFA500] text-[#FFA500] text-xs font-black tracking-wide">
                    ID: {enquiry.id.slice(0, 8)}
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-black tracking-wide text-white ${
                      isPending ? "bg-[#3D52A0]" : "bg-green-600"
                    }`}
                  >
                    {enquiry.status}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-xs text-gray-400 font-semibold">
                  {t("submitted_on")}
                </p>
                <p className="text-sm font-black text-[#1e2b6b]">
                  {format(new Date(enquiry.createdAt), "MMMM do, yyyy")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <h3 className="font-black text-[#1e2b6b] flex items-center gap-2 text-base">
                <PackageCheck className="h-5 w-5 text-[#FFA500]" />
                {t("products_requested")}
              </h3>
              <div className="space-y-3">
                {enquiry.enquiryLineItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="font-black text-[#FFA500]">
                          {item.item?.name || "Unknown Item"}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                          {item.quantity}{" "}
                          {UNIT_TYPE_LABELS[item.unitType as UnitType]}
                        </p>
                        {item.remarks && (
                          <p className="text-xs italic text-gray-400 mt-1">
                            {item.remarks}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {details?.expectedDate && (
                          <span className="px-3 py-1 rounded-full bg-[#3D52A0] text-white text-[10px] font-black tracking-wide whitespace-nowrap">
                            Deliver Within 7 days
                          </span>
                        )}
                        {item.flexibleWithBrands && (
                          <span className="px-3 py-1 rounded-full bg-[#FFA500] text-white text-[10px] font-black tracking-wide whitespace-nowrap">
                            Flexible with brands
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Delivery info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-[#FFA500] flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t("delivery_location")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {details?.address || t("not_specified")}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-[#3D52A0] flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t("expected_delivery_date")}
                </h4>
                <p className="text-sm text-gray-500 font-medium pl-6">
                  {details?.expectedDate
                    ? `${t("not_specified")} / ${format(new Date(details.expectedDate), "dd/MM/yyyy")}`
                    : t("not_specified")}
                </p>
              </div>
            </div>

            {/* Additional remarks */}
            <div className="space-y-2">
              <h4 className="text-sm font-black text-[#3D52A0] flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("additional_remarks")}
              </h4>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 min-h-[60px]">
                {details?.remarks ? (
                  <p className="text-sm text-gray-600">{details.remarks}</p>
                ) : (
                  <p className="text-sm text-gray-300 italic">
                    {t("write_something")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Sidebar ────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Buyer Info — orange card */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "linear-gradient(135deg, #FFA500 0%, #e69500 100%)",
            }}
          >
            <h3 className="text-white font-black text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              {t("buyer_information")}
            </h3>
            <div className="space-y-2.5">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm">
                    {enquiry.createdBy?.name?.[0]?.toUpperCase() || "B"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-none">
                    {enquiry.createdBy?.name || t("anonymous_buyer")}
                  </p>
                  <p className="text-white/60 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
                    Buyer Seller
                  </p>
                </div>
              </div>
              {/* Phone */}
              {enquiry.createdBy?.phone && (
                <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="h-3 w-3 text-white" />
                  </div>
                  {isActiveQuotation
                    ? enquiry.createdBy.phone
                    : "+91 ••••• •••••"}
                </div>
              )}
              {/* Email */}
              {enquiry.createdBy?.email && (
                <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Mail className="h-3 w-3 text-white" />
                  </div>
                  {isActiveQuotation
                    ? enquiry.createdBy.email
                    : "••••••••@••••.com"}
                </div>
              )}
            </div>
          </div>

          {/* Submit Quotation / Responded — dark blue card */}
          {isPending ? (
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: "linear-gradient(145deg, #3D52A0 0%, #2a3a7c 100%)",
              }}
            >
              <div>
                <h3 className="text-white font-black text-lg">
                  {t("submit_quotation")}
                </h3>
                <p className="text-white/60 text-xs font-medium mt-1">
                  {t("ready_fulfil_requirement_send_price")}
                </p>
              </div>
              <Button
                asChild
                className="w-full bg-[#FFA500] hover:bg-[#e69500] active:scale-95 text-white font-black text-sm rounded-xl h-11 border-0 shadow-md transition-all"
              >
                <Link
                  href={`/seller-dashboard/quotations/create?enquiryId=${enquiry.id}`}
                  className="flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {t("submit_quotation")}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl p-5 space-y-4 bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <PackageCheck className="h-6 w-6 text-green-600 shrink-0" />
                <div>
                  <h3 className="text-green-800 font-black text-base leading-tight">
                    {t("quotation_submitted")}
                  </h3>
                  <p className="text-green-700/70 text-xs font-medium mt-0.5">
                    {t("already_responded_enquiry")}
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl font-black text-xs"
              >
                <Link href="/seller-dashboard/enquiries">
                  {t("back_to_enquiries")}
                </Link>
              </Button>
            </div>
          )}

          {/* Tip — dark blue card */}
          <div
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{
              background: "linear-gradient(145deg, #3D52A0 0%, #2a3a7c 100%)",
            }}
          >
            <AlertCircle className="h-4 w-4 text-[#FFA500] shrink-0 mt-0.5" />
            <p className="text-xs text-white/80 leading-relaxed">
              <span className="text-white font-black">Tip : </span>
              {t("tip_providing_quick_response")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
