"use client";

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
import { RoomCard, ActivitySectionCard, ActivityStatCard, ConferenceHallItem } from "@/components/dashboard/buyer/dashboard-components";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";

export default function BuyerDashboardPage() {
  const { data: enquiries } = useEnquiriesQuery({});
  const { data: appointments } = useAppointmentsQuery({});
  const { data: quotations } = useQuotationsQuery({});
  const { data: visits } = useVisitsQuery({});

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
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            {/* Project Pulse - Rooms */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-[#FFA500] rounded-full" />
                <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider">
                  Project Pulse
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <RoomCard
                  title="Material Depo"
                  icon={Armchair}
                  href="/browse?categoryId="
                />
                <RoomCard
                  title="Technical Cabin"
                  icon={Bed}
                  href="/browse?categoryId="
                />
                <RoomCard
                  title="Fabricator Area"
                  icon={Bath}
                  href="/browse?categoryId="
                />
                <RoomCard
                  title="Contract Desk"
                  icon={Tv}
                  href="/browse?categoryId="
                />
              </div>
            </section>

            {/* Operations Center - Activity Stats */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-[#FFA500] rounded-full" />
                <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider">
                  Operations Center
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActivitySectionCard
                  title="My Enquiries"
                  icon={FileText}
                  footerLink="/buyer-dashboard/enquiries"
                  footerText="View All Enquiries"
                >
                  <ActivityStatCard
                    label="Pending Enquiries"
                    value={stats.pendingEnquiries}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label="Approved Enquiries"
                    value={stats.approvedEnquiries}
                    icon={CheckCircle2}
                  />
                </ActivitySectionCard>

                <ActivitySectionCard
                  title="My Appointments"
                  icon={CalendarDays}
                  footerLink="/buyer-dashboard/appointments"
                  footerText="View All Appointments"
                >
                  <ActivityStatCard
                    label="Upcoming"
                    value={stats.upcomingAppointments}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label="Completed"
                    value={stats.pastAppointments}
                    icon={CheckCircle2}
                  />
                </ActivitySectionCard>

                <ActivitySectionCard
                  title="My Quotations"
                  icon={Quote}
                  footerLink="/buyer-dashboard/quotations"
                  footerText="View All Quotations"
                >
                  <ActivityStatCard
                    label="Pending"
                    value={stats.pendingQuotations}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label="Accepted"
                    value={stats.acceptedQuotations}
                    icon={FileCheck}
                  />
                </ActivitySectionCard>

                <ActivitySectionCard
                  title="My Site Visits"
                  icon={MapPin}
                  footerLink="/buyer-dashboard/visits"
                  footerText="View All Visits"
                >
                  <ActivityStatCard
                    label="Scheduled"
                    value={stats.scheduledVisits}
                    icon={Clock}
                  />
                  <ActivityStatCard
                    label="Completed"
                    value={stats.completedVisits}
                    icon={CheckCircle2}
                  />
                </ActivitySectionCard>
              </div>
            </section>

            {/* Project Domains - Conference Hall */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-[#FFA500] rounded-full" />
                <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider">
                  Project Domains
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ConferenceHallItem
                  title="Info & Updates"
                  icon={Info}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title="Meetings"
                  icon={Users}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title="Forums"
                  icon={MessageSquare}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title="Demos"
                  icon={Video}
                  href="/buyer-dashboard/conference-hall"
                />
                <ConferenceHallItem
                  title="Live"
                  icon={LifeBuoy}
                  href="/buyer-dashboard/conference-hall"
                />
              </div>
            </section>

            {/* Precision Tools - AI Calculator */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-[#FFA500] rounded-full" />
                <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider">
                  Precision Tools
                </h2>
              </div>
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-muted/50">
                <AICalculator />
              </div>
            </section>
          </div>

          {/* Sidebar Column (Notifications) */}
          <div className="space-y-8 h-full">
            <div className="sticky top-24 pt-4 lg:pt-0">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Bell className="h-5 w-5 text-[#3D52A0]" />
                <h2 className="text-xl font-bold text-[#3D52A0] tracking-tight">
                  Notifications
                </h2>
              </div>
              <NotificationInbox userType="BUYER" hideHeader />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
