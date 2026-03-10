"use client";

import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  FileText,
  Headphones,
  MessageSquare,
  Settings,
  Star,
  Users,
  Wallet,
  Clock,
  XCircle,
  Package,
  Briefcase,
  Bell,
  Plus,
  Edit2,
  Store,
  ChevronRight,
  CheckCircle2,
  Map,
} from "lucide-react";
import Link from "next/link";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { isServiceBusiness, isProductBusiness } from "@/constants/roles";
import { useWalletDetails } from "@/queries/walletQueries";
import {
  useAssignmentsQuery,
  useQuotationsQuery,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { useLanguage } from "@/hooks/useLanguage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ACTIVITY_TYPE } from "@/constants/enums";

export default function SellerDashboardPage() {
  const { t } = useLanguage();
  const { data: user } = useSessionQuery();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const status = mainEntity?.verificationStatus;
  const isService = isServiceBusiness(user?.user?.role);
  const isProduct = isProductBusiness(user?.user?.role);
  const { data: wallet, isLoading: isWalletLoading } = useWalletDetails(
    mainEntity?.id,
  );

  const { data: enquiryAssignments = [] } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });

  const { data: appointmentAssignments = [] } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.APPOINTMENT_ASSIGNMENT,
  });

  // Quotations for Product Sellers
  const { data: quotations = [] } = useQuotationsQuery({
    createdById: user?.user?.id,
  });

  const pendingQuotations = quotations.filter(
    (q) => q.status === "PENDING",
  ).length;
  const sentQuotations = quotations.length;

  // Visits for Service Providers
  const { data: visits = [] } = useVisitsQuery();
  const pendingVisits = visits.filter((v) => v.status === "PENDING").length;
  const totalVisits = visits.length;

  // Split enquiry assignments into pending vs responded
  const pendingEnquiryCount = enquiryAssignments.filter(
    (a) => !a.enquiry?.status || a.enquiry.status === "PENDING",
  ).length;
  const respondedEnquiryCount = enquiryAssignments.filter(
    (a) => a.enquiry?.status && a.enquiry.status !== "PENDING",
  ).length;

  // Build a Set of responded enquiry IDs for the notification inbox badge
  const respondedEnquiryIds = new Set(
    enquiryAssignments
      .filter((a) => a.enquiry?.status && a.enquiry.status !== "PENDING")
      .map((a) => a.enquiry!.id),
  );

  return (
    <div className="flex flex-col gap-8 py-2">
      {status && status !== "APPROVED" && (
        <Alert
          variant={
            status === "REJECTED"
              ? "destructive"
              : status === "PAUSED"
                ? "destructive"
                : "default"
          }
        >
          {status === "PENDING" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {status === "PENDING"
              ? t("verification_pending")
              : status === "PAUSED"
                ? t("verification_paused")
                : t("verification_rejected")}
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {status === "PENDING"
                ? t("complete_info_in_settings")
                : status === "PAUSED"
                  ? t("verification_paused_desc")
                  : mainEntity?.verificaitonRemark || t("verification_rejected_desc")}
            </span>
            <Link href="/seller-dashboard/settings" className="ml-4">
              <Button variant="outline" size="sm" className="bg-background">
                {t("go_to_settings")}
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* 1. Active Business */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Bell className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">
                {t("active_business")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
              {/* Product / Service Catalogue — dynamic based on seller type */}
              <Card className="bg-gradient-to-r from-primary to-primary/80 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between col-span-1 border-0 overflow-hidden">
                <div className="flex flex-col items-center gap-3 mb-4 text-center">
                  <div className="bg-white/10 p-2 rounded-lg w-fit">
                    {isService ? (
                      <Briefcase className="h-6 w-6 text-secondary" />
                    ) : (
                      <Package className="h-6 w-6 text-secondary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {isService ? t("service_catalog") : t("product_catalog")}
                    </h3>
                    <p className="text-xs font-normal text-blue-100">
                      {isService ? t("manage_services") : t("manage_products")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="w-full">
                    <Button
                      variant="secondary"
                      className="w-full bg-white text-primary hover:bg-gray-100 border-0 rounded-lg px-4 h-10 text-sm font-semibold justify-center disabled:opacity-50"
                      disabled={status !== "APPROVED"}
                      asChild={status === "APPROVED"}
                    >
                      {status === "APPROVED" ? (
                        <Link href="/seller-dashboard/catalog?create=true">
                          <Plus className="mr-2 h-4 w-4" />
                          {isService
                            ? t("new_service_listing")
                            : t("new_product_listing")}
                        </Link>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          {isService
                            ? t("new_service_listing")
                            : t("new_product_listing")}
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 text-white hover:bg-white/20 border-0 rounded-lg px-4 h-10 text-sm font-semibold justify-center disabled:opacity-50"
                    disabled={status !== "APPROVED"}
                    asChild={status === "APPROVED"}
                  >
                    {status === "APPROVED" ? (
                      <Link href="/seller-dashboard/catalog">
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isService
                          ? t("edit_service_listing")
                          : t("edit_product_listing")}
                      </Link>
                    ) : (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isService
                          ? t("edit_service_listing")
                          : t("edit_product_listing")}
                      </>
                    )}
                  </Button>
                  {/* <Link
                    href="/seller-dashboard/catalog"
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white border-0 rounded-lg px-4 h-10 text-sm font-semibold">
                      <Eye className="mr-2 h-4 w-4" />
                      {isService
                        ? t("view_service_listing")
                        : t("view_product_listing")}
                    </Button>
                  </Link> */}
                </div>
              </Card>

              {/* New Enquirers (Product Sellers ONLY) */}
              {isProduct && (
                <Link
                  href="/seller-dashboard/enquiries"
                  className="h-full block"
                >
                  <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border-0 group relative hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 flex items-center justify-center gap-2 -mt-[25px]">
                      <Users className="h-5 w-5" />
                      <span className="font-semibold text-lg">
                        {t("new_enquirers")}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-white min-h-[100px] sm:min-h-[120px]">
                      <span className="text-4xl sm:text-5xl font-bold text-primary">
                        {pendingEnquiryCount}
                      </span>
                      {respondedEnquiryCount > 0 && (
                        <span className="text-[11px] text-muted-foreground font-semibold mt-1">
                          {respondedEnquiryCount} {t("responded")}
                        </span>
                      )}
                    </div>
                  </Card>
                </Link>
              )}

              {/* Your Quotations (Product Sellers ONLY) */}
              {isProduct && (
                <Link
                  href="/seller-dashboard/quotations"
                  className="block h-full"
                >
                  <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-orange-100 hover:shadow-md transition-shadow">
                    <div className="bg-secondary text-white h-[54px] shrink-0 px-4 flex items-center justify-center gap-2 -mt-[25px] whitespace-nowrap">
                      <FileText className="h-5 w-5" />
                      <span className="font-semibold text-lg">
                        {t("your_quotations")}
                      </span>
                    </div>
                    <div className="flex-1 flex items-stretch divide-x divide-gray-100">
                      <div className="flex flex-col items-center justify-center flex-1 p-3 sm:p-4 bg-white hover:bg-orange-50/50 transition-colors">
                        <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">
                          {t("sent")}
                        </span>
                        <span className="text-3xl sm:text-4xl font-bold text-secondary">
                          {sentQuotations}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1 p-3 sm:p-4 bg-white hover:bg-orange-50/50 transition-colors">
                        <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">
                          {t("pending")}
                        </span>
                        <span className="text-3xl sm:text-4xl font-bold text-secondary">
                          {pendingQuotations}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Your Appointments (Service Providers ONLY) */}
              {isService && (
                <Link
                  href="/seller-dashboard/appointments"
                  className="block h-full"
                >
                  <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-orange-100 hover:shadow-md transition-shadow">
                    <div className="bg-secondary text-white h-[54px] shrink-0 px-4 flex items-center justify-center gap-2 -mt-[25px] whitespace-nowrap">
                      <CalendarDays className="h-5 w-5" />
                      <span className="font-semibold text-lg">
                        {t("your_appointments")}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"></div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-white">
                      <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">
                        {t("site_visit_requests")}
                      </span>
                      <span className="text-3xl sm:text-4xl font-bold text-secondary">
                        {appointmentAssignments.length}
                      </span>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Your Visits (Service Providers ONLY) */}
              {isService && (
                <Link href="/seller-dashboard/visits" className="block h-full">
                  <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-orange-100 hover:shadow-md transition-shadow">
                    <div className="bg-secondary text-white h-[54px] shrink-0 px-4 flex items-center justify-center gap-2 -mt-[25px] whitespace-nowrap">
                      <Map className="h-5 w-5" />
                      <span className="font-semibold text-lg">
                        {t("your_visits", "Your Visits")}
                      </span>
                    </div>
                    <div className="flex-1 flex items-stretch divide-x divide-gray-100">
                      <div className="flex flex-col items-center justify-center flex-1 p-3 sm:p-4 bg-white hover:bg-orange-50/50 transition-colors">
                        <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">
                          {t("total")}
                        </span>
                        <span className="text-3xl sm:text-4xl font-bold text-secondary">
                          {totalVisits}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center flex-1 p-3 sm:p-4 bg-white hover:bg-orange-50/50 transition-colors">
                        <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">
                          {t("pending")}
                        </span>
                        <span className="text-3xl sm:text-4xl font-bold text-secondary">
                          {pendingVisits}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Active Leads & Customers Combined */}
              <Card className="bg-primary text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                <div className="flex flex-col items-center mb-4 z-10">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg sm:text-2xl tracking-tight leading-snug text-center px-2">
                      {t("active_leads")} & {t("customers")}
                    </span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-bold text-secondary drop-shadow-md mt-2">
                    {isService
                      ? appointmentAssignments.length
                      : pendingEnquiryCount}
                  </span>
                </div>
                {respondedEnquiryCount > 0 && (
                  <div className="z-10 mb-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <span className="text-xs font-semibold text-white/80">
                      {t("past_enquiries_responded", {
                        count: respondedEnquiryCount,
                      })}
                    </span>
                  </div>
                )}
                <Link
                  href="/seller-dashboard/customers"
                  className="w-full z-10"
                >
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 text-sm font-semibold shadow-md active:scale-[0.98] transition-all">
                    <ChevronRight className="mr-1 h-4 w-4" />{" "}
                    {t("view_all_leads_customers")}
                  </Button>
                </Link>
              </Card>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 2. Finance */}
            <section className="h-full">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Wallet className="h-5 w-5" />
                <h2 className="text-xl font-bold tracking-tight">
                  {t("finance")}
                </h2>
              </div>
              <Card className="bg-secondary text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between border-0 gap-6 h-[calc(100%-2.5rem)]">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md shadow-inner">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/90 tracking-wide uppercase">
                      {t("coin_balance")}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight">
                        {isWalletLoading
                          ? "..."
                          : (wallet?.balance ?? 0).toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-white/90">
                        {t("coins")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Link href="/seller-dashboard/wallet" className="w-full">
                    <Button
                      variant="secondary"
                      className="w-full bg-white text-secondary hover:bg-gray-50 border-0 rounded-lg h-11 font-bold shadow-sm"
                    >
                      {t("add_coins")}
                    </Button>
                  </Link>
                  <Link href="/seller-dashboard/wallet" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-white border-white hover:bg-white/10 rounded-lg h-11 font-medium"
                    >
                      {t("transaction_history")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </section>

            {/* 3. Operations */}
            <section className="h-full">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Settings className="h-5 w-5" />
                <h2 className="text-xl font-bold tracking-tight">
                  {t("operations")}
                </h2>
              </div>
              <Card className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between border border-gray-100 hover:border-orange-200 transition-colors h-[calc(100%-2.5rem)]">
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-primary mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Store className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">{t("store_setting")}</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    {t("store_setting_desc")}
                  </p>
                </div>
                <Link href="/seller-dashboard/settings" className="w-full">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 font-medium shadow-sm active:scale-95 transition-all">
                    {t("manage_store_settings")}
                  </Button>
                </Link>
              </Card>
            </section>
          </div>

          {/* 4. Relations */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">
                {t("relations")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-b from-primary to-primary/60 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Users className="h-6 w-6 text-secondary" />
                  <h3 className="font-bold text-lg tracking-wide">
                    {t("customers")}
                  </h3>
                </div>
                <Link
                  href="/seller-dashboard/customers"
                  className="w-full relative z-10"
                >
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 shadow-md font-semibold text-[15px]">
                    {t("my_buyers")}
                  </Button>
                </Link>
              </Card>

              <Card className="bg-gradient-to-b from-primary to-primary/60 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Star className="h-6 w-6 text-secondary" />
                  <h3 className="font-bold text-lg tracking-wide">
                    {t("reviews")}
                  </h3>
                </div>
                <Link
                  href="/seller-dashboard/reviews"
                  className="w-full relative z-10"
                >
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 shadow-md font-semibold text-[15px]">
                    {t("view_feedback")}
                  </Button>
                </Link>
              </Card>

              <Card className="bg-gradient-to-b from-primary to-primary/60 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Headphones className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Headphones className="h-6 w-6 text-secondary" />
                  <h3 className="font-bold text-lg tracking-wide">
                    {t("technical_support")}
                  </h3>
                </div>
                <div className="flex flex-col gap-3 relative z-10 w-full">
                  <Link href="/seller-dashboard/support" className="w-full">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 shadow-md text-sm font-semibold px-4">
                      {t("view_helpdesk")}
                    </Button>
                  </Link>
                  <Link href="/seller-dashboard/support" className="w-full">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-lg h-11 shadow-md text-sm font-semibold px-4">
                      {t("view_tickets")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>

          {/* Conference Hall (Kept as requested) */}
          <section className="mt-8 border-t pt-8">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {t("conference_hall")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-base text-primary">
                      {t("offers")}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("manage_offers")}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-10 font-semibold border-gray-300 disabled:opacity-50"
                    disabled={status !== "APPROVED"}
                    asChild={status === "APPROVED"}
                  >
                    {status === "APPROVED" ? (
                      <Link href="/seller-dashboard/conference-hall/offers">
                        {t("create_offers")}
                      </Link>
                    ) : (
                      <span>{t("create_offers")}</span>
                    )}
                  </Button>
                </div>
              </Card>

              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-base text-primary">
                      {t("content")}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("manage_content")}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-10 font-semibold border-gray-300 disabled:opacity-50"
                    disabled={status !== "APPROVED"}
                    asChild={status === "APPROVED"}
                  >
                    {status === "APPROVED" ? (
                      <Link href="/seller-dashboard/conference-hall/content">
                        {t("create_content")}
                      </Link>
                    ) : (
                      <span>{t("create_content")}</span>
                    )}
                  </Button>
                </div>
              </Card>

              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-base text-primary">
                      {t("events")}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("manage_events")}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-10 font-semibold border-gray-300 disabled:opacity-50"
                    disabled={status !== "APPROVED"}
                    asChild={status === "APPROVED"}
                  >
                    {status === "APPROVED" ? (
                      <Link href="/seller-dashboard/conference-hall/events">
                        {t("create_events")}
                      </Link>
                    ) : (
                      <span>{t("create_events")}</span>
                    )}
                  </Button>
                </div>
              </Card>

              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-base text-primary">
                      {t("forum")}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("manage_forum")}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-10 font-semibold border-gray-300 disabled:opacity-50"
                    disabled={status !== "APPROVED"}
                    asChild={status === "APPROVED"}
                  >
                    {status === "APPROVED" ? (
                      <Link href="/seller-dashboard/conference-hall/forum">
                        {t("join_discussion")}
                      </Link>
                    ) : (
                      <span>{t("join_discussion")}</span>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>

        {/* Sidebar Column (Notifications) */}
        <div className="flex flex-col space-y-8 h-full">
          <div className="sticky top-24 pt-4 lg:pt-0">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-primary tracking-tight">
                {t("notifications")}
              </h2>
            </div>
            <NotificationInbox
              userType="SELLER"
              respondedEnquiryIds={respondedEnquiryIds}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
