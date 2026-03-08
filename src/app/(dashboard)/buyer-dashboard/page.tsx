"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AICalculator } from "@/components/dashboard/buyer/ai-calculator";
import {
  Armchair,
  Bath,
  Bed,
  FileText,
  Info,
  LifeBuoy,
  MessageSquare,
  Video,
  Users,
  CalendarDays,
  Tv,
  CheckCircle2,
  Clock,
  Quote,
  MapPin,
  FileCheck,
  Bell,
} from "lucide-react";
import {
  useEnquiriesQuery,
  useAppointmentsQuery,
  useQuotationsQuery,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { useMemo } from "react";
import {
  RoomCard,
  ActivitySectionCard,
  ActivityStatCard,
  ConferenceHallItem,
  BuyerProfileCard,
} from "@/components/dashboard/buyer/dashboard-components";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { useSessionQuery } from "@/queries/authQueries";

export default function BuyerDashboardPage() {
  const { t } = useLanguage();
  const { data: enquiries } = useEnquiriesQuery({});
  const { data: appointments } = useAppointmentsQuery({});
  const { data: quotations } = useQuotationsQuery({});
  const { data: visits } = useVisitsQuery({});
  const { data: session } = useSessionQuery();

  const stats = useMemo(() => {
    const pendingEnquiries =
      enquiries?.filter((e) => e.status === "PENDING").length || 0;
    const approvedEnquiries =
      enquiries?.filter((e) => e.status === "APPROVED").length || 0;

    const upcomingAppointments =
      appointments?.filter(
        (a) => a.status === "PENDING" || a.status === "APPROVED",
      ).length || 0;
    const pastAppointments =
      appointments?.filter((a) =>
        ["COMPLETED", "CANCELLED", "REJECTED"].includes(a.status),
      ).length || 0;

    const pendingQuotations =
      quotations?.filter((q) => q.status === "PENDING").length || 0;
    const acceptedQuotations =
      quotations?.filter((q) => q.status === "ACCEPTED").length || 0;

    const scheduledVisits =
      visits?.filter((v) => v.status === "PENDING").length || 0;
    const completedVisits =
      visits?.filter((v) => v.status === "COMPLETED").length || 0;

    return {
      pendingEnquiries,
      approvedEnquiries,
      upcomingAppointments,
      pastAppointments,
      pendingQuotations,
      acceptedQuotations,
      scheduledVisits,
      completedVisits,
    };
  }, [enquiries, appointments, quotations, visits]);

  return (
    <AuthGuard allowedRoles={["USER_BUYER_ADMIN"]}>
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* Profile Card */}
        {session?.user && (
          <BuyerProfileCard
            name={session.user.name || "Buyer"}
            role={session.user.role || "Buyer"}
            avatarUrl={session.user.image || undefined}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            {/* Project Pulse - Rooms */}
            <section>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-8 w-1.5 bg-secondary rounded-full" />
                <h2 className="text-xl md:text-2xl font-black text-primary uppercase tracking-wider">
                  {t("project_pulse")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <RoomCard
                  title={t("material_depo")}
                  icon={Armchair}
                  href="/browse?categoryId="
                />
                <RoomCard
                  title={t("technical_cabin")}
                  icon={Bed}
                  href="/browse?categoryId="
                />
                <RoomCard
                  title={t("fabricator_area")}
                  icon={Bath}
                  href="/browse?categoryId="
                />
                <RoomCard
                  title={t("contract_desk")}
                  icon={Tv}
                  href="/browse?categoryId="
                />
              </div>
            </section>

            {/* Operations Center - Activity Stats */}
            <section>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-8 w-1.5 bg-secondary rounded-full" />
                <h2 className="text-xl md:text-2xl font-black text-primary uppercase tracking-wider">
                  {t("operations_center")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActivitySectionCard
                  title={t("my_enquiries")}
                  icon={FileText}
                  footerLink="/buyer-dashboard/enquiries"
                  footerText={t("view_all_enquiries")}
                >
                  <ActivityStatCard
                    label={t("pending_enquiries")}
                    value={stats.pendingEnquiries}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label={t("approved_enquiries")}
                    value={stats.approvedEnquiries}
                    icon={CheckCircle2}
                  />
                </ActivitySectionCard>

                <ActivitySectionCard
                  title={t("my_appointments")}
                  icon={CalendarDays}
                  footerLink="/buyer-dashboard/appointments"
                  footerText={t("view_all_appointments")}
                >
                  <ActivityStatCard
                    label={t("upcoming")}
                    value={stats.upcomingAppointments}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label={t("completed")}
                    value={stats.pastAppointments}
                    icon={CheckCircle2}
                  />
                </ActivitySectionCard>

                <ActivitySectionCard
                  title={t("my_quotations")}
                  icon={Quote}
                  footerLink="/buyer-dashboard/quotations"
                  footerText={t("view_all_quotations")}
                >
                  <ActivityStatCard
                    label={t("pending")}
                    value={stats.pendingQuotations}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label={t("accepted")}
                    value={stats.acceptedQuotations}
                    icon={FileCheck}
                  />
                </ActivitySectionCard>

                <ActivitySectionCard
                  title={t("my_site_visits")}
                  icon={MapPin}
                  footerLink="/buyer-dashboard/visits"
                  footerText={t("view_all_visits")}
                >
                  <ActivityStatCard
                    label={t("scheduled")}
                    value={stats.scheduledVisits}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label={t("completed")}
                    value={stats.completedVisits}
                    icon={CheckCircle2}
                  />
                </ActivitySectionCard>
              </div>
            </section>

            {/* Project Domains - Conference Hall */}
            <section>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-8 w-1.5 bg-secondary rounded-full" />
                <h2 className="text-xl md:text-2xl font-black text-primary uppercase tracking-wider">
                  {t("project_domains")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ConferenceHallItem
                  title={t("info_updates")}
                  icon={Info}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title={t("meetings")}
                  icon={Users}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title={t("forums")}
                  icon={MessageSquare}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title={t("demos")}
                  icon={Video}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title={t("live")}
                  icon={LifeBuoy}
                  href="/buyer-dashboard/conference-hall"
                />
              </div>
            </section>

            {/* Precision Tools - AI Calculator */}
            <section>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="h-8 w-1.5 bg-secondary rounded-full" />
                <h2 className="text-xl md:text-2xl font-black text-primary uppercase tracking-wider">
                  {t("precision_tools")}
                </h2>
              </div>
              <div className="rounded-2xl md:rounded-3xl bg-white p-4 md:p-8 shadow-sm ring-1 ring-muted/50">
                <AICalculator />
              </div>
            </section>
          </div>

          {/* Sidebar Column (Notifications) — hidden on mobile, bell in profile card handles it */}
          <div className="hidden lg:block space-y-8 h-full">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-primary tracking-tight">
                  {t("notifications")}
                </h2>
              </div>
              <NotificationInbox userType="BUYER" />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
