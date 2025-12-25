import Container from "@/components/containers/containers";
import { DashboardCard } from "@/components/dashboard/seller/dashboard-card";
import { DashboardContainerCard } from "@/components/dashboard/seller/dashboard-container-card";
import { NotificationCard } from "@/components/dashboard/seller/notification-card";
import { ProfileCard } from "@/components/dashboard/seller/profile-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  FileText,
  Megaphone,
  UploadCloud,
  Users,
} from "lucide-react";
import Image from "next/image";

export default function SellerDashboardPage() {
  return (
    <Container>
      <div className="space-y-6">
        <ProfileCard
          user={{ name: "Rupam Kairi", role: "Super Seller", avatarUrl: "" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Dashboard Container - Spans 9 cols */}
          <div className="lg:col-span-9">
            <DashboardContainerCard
              title="Actions"
              className="h-full border-none shadow-none p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Catalog Upload Card - Spans 4 cols */}
                <DashboardCard
                  title="Catalog"
                  subtext="Create & Manage Product & Services"
                  className="md:col-span-4 bg-muted/30"
                  iconComponent={
                    <Image
                      width={64}
                      height={64}
                      src="/images/dashboard/manage-product-services.png"
                      alt="Manage Product & Services"
                      className="h-10 w-10"
                    />
                  }
                  contentComponent={
                    <div className="flex flex-row items-center gap-4 h-full">
                      <div className="relative h-16 w-16 shrink-0 bg-background rounded-md flex items-center justify-center border">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Apna pura product range, specs aur technical sheets
                          upload karein.
                        </p>
                      </div>
                    </div>
                  }
                />

                {/* Enquiry Card - Spans 2 cols, 2 rows */}
                <DashboardCard
                  title="Customer Enquiries"
                  className="md:col-span-2 md:row-span-2 border-primary/20 border-2"
                  iconComponent={<Users className="h-5 w-5 text-primary" />}
                  contentComponent={
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col">
                        <span className="text-4xl font-bold text-primary">
                          15
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          New Leads
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <p>
                          <strong className="text-foreground">
                            Amit Sharma
                          </strong>{" "}
                          - Cement (50 bags)
                        </p>
                        <p>
                          <strong className="text-foreground">
                            Priya Verma
                          </strong>{" "}
                          - Bricks (5000 pcs)
                        </p>
                        <p>
                          <strong className="text-foreground">
                            Amit Sharma
                          </strong>{" "}
                          - Cement (500 bags)
                        </p>
                        <p>
                          <strong className="text-foreground">
                            Priya Verma
                          </strong>{" "}
                          - Bricks (5000 pcs)
                        </p>
                      </div>
                    </div>
                  }
                  footerComponent={
                    <Button
                      className="w-full font-semibold text-md h-11"
                      size="lg"
                    >
                      View Leads & Quote Now
                    </Button>
                  }
                />

                {/* Appointment Card - Spans 2 cols */}
                <DashboardCard
                  title="New Appointment Requests"
                  className="md:col-span-2"
                  iconComponent={<CalendarDays className="h-5 w-5" />}
                  contentComponent={
                    <div className="flex flex-col items-start gap-2 mt-4">
                      <Badge variant="secondary" className="font-normal">
                        1 New Request
                      </Badge>
                    </div>
                  }
                  footerComponent={
                    <div className="flex items-center justify-between w-full pt-2">
                      <span className="text-muted-foreground text-sm">
                        Count
                      </span>
                      <Button variant="outline" size="sm" className="px-6">
                        View
                      </Button>
                    </div>
                  }
                />

                {/* Promotion Card - Spans 2 cols */}
                <DashboardCard
                  title="Promotions (Conference Hall)"
                  className="md:col-span-2 bg-muted/30"
                  iconComponent={
                    <div className="bg-background p-1.5 rounded-md border">
                      <Megaphone className="h-4 w-4" />
                    </div>
                  }
                  contentComponent={
                    <div className="flex flex-row justify-between items-end mt-4">
                      <p className="text-sm text-muted-foreground max-w-[70%] leading-relaxed">
                        Dealer network ke liye offers, announcements...
                      </p>
                      <Megaphone className="h-10 w-10 text-muted-foreground/20 rotate-[-15deg]" />
                    </div>
                  }
                />
              </div>
            </DashboardContainerCard>
          </div>

          {/* Notifications Card - Spans 3 cols */}
          <div className="lg:col-span-3 h-full">
            <NotificationCard className="h-full border-none shadow-none bg-transparent p-0" />
          </div>
        </div>
      </div>
    </Container>
  );
}
