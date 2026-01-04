import Container from "@/components/containers/containers";
import { AICalculator } from "@/components/dashboard/buyer/ai-calculator";
import { DashboardCard } from "@/components/dashboard/seller/dashboard-card";
import { DashboardContainerCard } from "@/components/dashboard/seller/dashboard-container-card";
import { Button } from "@/components/ui/button";
import {
  Armchair,
  Bath,
  Bed,
  CalendarDays,
  FileText,
  Info,
  LifeBuoy,
  MessageSquare,
  Settings,
  Tv,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import {
  useEnquiriesQuery,
  useAppointmentsQuery,
} from "@/queries/activityQueries";
import { useMemo } from "react";

export default function BuyerDashboardPage() {
  const { data: enquiries } = useEnquiriesQuery({});
  const { data: appointments } = useAppointmentsQuery({});

  const stats = useMemo(() => {
    const pendingEnquiries =
      enquiries?.filter((e) => e.status === "Pending").length || 0;
    const approvedEnquiries =
      enquiries?.filter((e) => e.status === "Approved").length || 0;

    // Appointments
    const upcomingAppointments =
      appointments?.filter((a) => a.status === "Upcoming").length || 0;
    const pastAppointments =
      appointments?.filter((a) => ["Completed", "Cancelled"].includes(a.status))
        .length || 0;

    return {
      pendingEnquiries,
      approvedEnquiries,
      upcomingAppointments,
      pastAppointments,
    };
  }, [enquiries, appointments]);

  return (
    <Container>
      <div className="flex flex-col gap-8 py-6">
        {/* 1. Rooms Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Rooms</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Living Room",
                icon: <Armchair className="h-6 w-6" />,
                href: "/browse?category=living-room",
              },
              {
                title: "Bedroom",
                icon: <Bed className="h-6 w-6" />,
                href: "/browse?category=bedroom",
              },
              {
                title: "Bathroom",
                icon: <Bath className="h-6 w-6" />,
                href: "/browse?category=bathroom",
              },
              {
                title: "Entertainment",
                icon: <Tv className="h-6 w-6" />,
                href: "/browse?category=entertainment",
              },
            ].map((room) => (
              <Link key={room.title} href={room.href} className="block h-full">
                <DashboardCard
                  title={room.title}
                  iconComponent={room.icon}
                  className="h-full hover:bg-muted/50 transition-colors cursor-pointer"
                  subtext="Browse items"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* 2. Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Activity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              title="My Enquiries"
              subtext="Track your product enquiries"
              iconComponent={<FileText className="h-5 w-5 text-primary" />}
              contentComponent={
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-bold">{stats.pendingEnquiries}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Approved</span>
                    <span className="font-bold">{stats.approvedEnquiries}</span>
                  </div>
                </div>
              }
              footerComponent={
                <Link href="/buyer-dashboard/enquiries" className="w-full">
                  <Button className="w-full" variant="outline">
                    View Enquiries
                  </Button>
                </Link>
              }
            />
            <DashboardCard
              title="Appointments"
              subtext="Manage your scheduled visits"
              iconComponent={<CalendarDays className="h-5 w-5 text-primary" />}
              contentComponent={
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Upcoming</span>
                    <span className="font-bold">
                      {stats.upcomingAppointments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Past</span>
                    <span className="font-bold">{stats.pastAppointments}</span>
                  </div>
                </div>
              }
              footerComponent={
                <Link href="/buyer-dashboard/appointments" className="w-full">
                  <Button className="w-full" variant="outline">
                    View Appointments
                  </Button>
                </Link>
              }
            />
          </div>
        </section>

        {/* 3. Conference Hall & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Conference Hall
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Info",
                  icon: <Info className="h-5 w-5" />,
                  metric: "Updates",
                },
                {
                  title: "Meetings",
                  icon: <Users className="h-5 w-5" />,
                  metric: "2 Scheduled",
                },
                {
                  title: "Forum",
                  icon: <MessageSquare className="h-5 w-5" />,
                  metric: "5 New",
                },
                {
                  title: "Demos",
                  icon: <Video className="h-5 w-5" />,
                  metric: "Available",
                },
                {
                  title: "Live",
                  icon: <LifeBuoy className="h-5 w-5" />,
                  metric: "On Air",
                },
              ].map((item) => (
                <DashboardCard
                  key={item.title}
                  title={item.title}
                  iconComponent={item.icon}
                  subtext={item.metric}
                  className="h-full"
                />
              ))}
            </div>
          </section>

          <section className="md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Settings
              </h2>
            </div>
            <DashboardCard
              title="Profile Settings"
              subtext="Manage your account"
              iconComponent={<Settings className="h-5 w-5" />}
              contentComponent={
                <p className="text-sm text-muted-foreground mt-2">
                  Update your personal details, company info, and members.
                </p>
              }
              footerComponent={
                <Link href="/buyer-dashboard/settings" className="w-full">
                  <Button className="w-full">Manage Settings</Button>
                </Link>
              }
              className="h-full"
            />
          </section>
        </div>

        {/* 4. AI Calculator */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              AI Calculator
            </h2>
          </div>
          <DashboardContainerCard className="border shadow-sm p-0">
            <div className="p-6">
              <AICalculator />
            </div>
          </DashboardContainerCard>
        </section>
      </div>
    </Container>
  );
}
