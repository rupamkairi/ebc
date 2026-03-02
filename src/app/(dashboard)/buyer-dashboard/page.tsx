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
} from "lucide-react";
import {
  useEnquiriesQuery,
  useAppointmentsQuery,
  useQuotationsQuery,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { useMemo } from "react";
import {
  BuyerProfileCard,
  RoomCard,
  ActivitySectionCard,
  ActivityStatCard,
  ConferenceHallItem,
} from "@/components/dashboard/buyer/dashboard-components";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER_ROLE_LABELS } from "@/constants/roles";

export default function BuyerDashboardPage() {
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
      <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto">
        {/* Profile Section */}
        {/* {session?.user && (
          <BuyerProfileCard
            name={session.user.name || "Buyer"}
            role={session.user.role || "Buyer"}
            avatarUrl={session.user.image || undefined}
          />
        )} */}

        {/* Rooms Section */}
        <section>
          <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider mb-6">
            Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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

        {/* Activity Section */}
        <section>
          <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider mb-6">
            Activity
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        {/* Conference Hall & Secondary Profile */}
        <section>
          <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider mb-6">
            Conference Hall
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
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

            {/* Side Profile Info */}
            <div className="rounded-2xl bg-[#3D52A0] p-6 text-white shadow-xl flex flex-col items-center">
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-white/20">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback className="bg-white/10 text-white font-bold text-2xl">
                      {session?.user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-[#3D52A0]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{session?.user?.name}</h3>
                  <p className="text-xs text-white/60 uppercase tracking-widest text-center">
                    {USER_ROLE_LABELS[
                      session?.user?.role as keyof typeof USER_ROLE_LABELS
                    ] ||
                      session?.user?.role ||
                      "Buyer"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Button className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold h-10 text-xs">
                  View Profile
                </Button>
                <Button className="w-full bg-[#FFA500] hover:bg-[#E69500] text-white font-bold h-10 text-xs text-nowrap">
                  Edit Appearance
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Calculator - Moved to bottom as it's a utility */}
        <section className="mt-8">
          <h2 className="text-2xl font-black text-[#3D52A0] uppercase tracking-wider mb-6">
            AI Cost Calculator
          </h2>
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-muted/50">
            <AICalculator />
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
