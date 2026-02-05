"use client";

import { DashboardCard } from "@/components/dashboard/seller/dashboard-card";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  FileText,
  Headphones,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Clock,
  XCircle,
  FileSearch,
} from "lucide-react";
import Link from "next/link";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useWalletDetails } from "@/queries/walletQueries";
import {
  useAssignmentsQuery,
  useQuotationsQuery,
} from "@/queries/activityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReviewSummary } from "@/components/shared/reviews";

export default function SellerDashboardPage() {
  const { data: user } = useSessionQuery();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const status = mainEntity?.verificationStatus;
  const { data: wallet, isLoading: isWalletLoading } = useWalletDetails(
    mainEntity?.id,
  );

  const { data: enquiryAssignments = [] } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: "ENQUIRY_ASSIGNMENT",
  });

  const { data: appointmentAssignments = [] } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: "APPOINTMENT_ASSIGNMENT",
  });

  const { data: quotations = [] } = useQuotationsQuery({
    createdById: user?.user?.id,
  });

  const pendingQuotations = quotations.filter(
    (q) => q.status === "PENDING",
  ).length;
  const sentQuotations = quotations.length;

  return (
    <div className="flex flex-col gap-8 py-6">
      {status && status !== "APPROVED" && (
        <Alert variant={status === "REJECTED" ? "destructive" : "default"}>
          {status === "PENDING" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {status === "PENDING"
              ? "Verification Pending"
              : "Verification Rejected"}
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {status === "PENDING"
                ? "Our team is reviewing your business profile. Some features may be restricted."
                : mainEntity.verificaitonRemark ||
                  "Your business profile was rejected."}
            </span>
            <Button variant="outline" size="sm" className="ml-4 bg-background">
              {status === "PENDING" ? "View Status" : "Contact Support"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 1. Core Business Functions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/seller-dashboard/catalog" className="h-full">
            <DashboardCard
              title="Product Catalog"
              subtext="Manage listings & prices"
              iconComponent={<FileText className="h-5 w-5" />}
              className="h-full hover:bg-muted/50 transition-colors"
            />
          </Link>

          <Link href="/seller-dashboard/enquiries" className="h-full">
            <DashboardCard
              title="New Enquiries"
              subtext="Active leads"
              iconComponent={<Users className="h-5 w-5" />}
              contentComponent={
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span className="font-bold">
                      {enquiryAssignments.length}
                    </span>
                  </div>
                </div>
              }
              className="h-full hover:bg-muted/50 transition-colors"
              footerComponent={
                <Button variant="outline" className="w-full mt-auto">
                  View Leads
                </Button>
              }
            />
          </Link>

          <Link href="/seller-dashboard/appointments" className="h-full">
            <DashboardCard
              title="Appointments"
              subtext="Site visits"
              iconComponent={<CalendarDays className="h-5 w-5" />}
              contentComponent={
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Requests</span>
                    <span className="font-bold">
                      {appointmentAssignments.length}
                    </span>
                  </div>
                </div>
              }
              className="h-full hover:bg-muted/50 transition-colors"
              footerComponent={
                <Button variant="outline" className="w-full mt-auto">
                  View Visits
                </Button>
              }
            />
          </Link>

          <Link href="/seller-dashboard/quotations" className="h-full">
            <DashboardCard
              title="Quotations"
              subtext="Sent & Pending"
              iconComponent={<FileSearch className="h-5 w-5" />}
              contentComponent={
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Sent</span>
                    <span className="font-bold">{sentQuotations}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-bold">{pendingQuotations}</span>
                  </div>
                </div>
              }
              className="h-full hover:bg-muted/50 transition-colors"
              footerComponent={
                <Button variant="outline" className="w-full mt-auto">
                  View Quotes
                </Button>
              }
            />
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Trust Score Breakdown */}
          {mainEntity?.id && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Trust Score
                </h2>
                <Link
                  href="/seller-dashboard/reviews"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Manage Reviews
                </Link>
              </div>
              <ReviewSummary entityId={mainEntity.id} />
            </section>
          )}

          {/* 2. Finances */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Finances
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DashboardCard
                title="Wallet Balance"
                subtext="Available coins"
                iconComponent={<Wallet className="h-5 w-5" />}
                contentComponent={
                  <div className="mt-4">
                    <div className="text-2xl font-bold">
                      {isWalletLoading
                        ? "..."
                        : (wallet?.balance ?? 0).toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        Coins
                      </span>
                    </div>
                  </div>
                }
                footerComponent={
                  <div className="flex gap-2 w-full">
                    <Link href="/seller-dashboard/wallet" className="flex-1">
                      <Button className="w-full">
                        <TrendingUp className="mr-2 h-4 w-4" /> Add Coins
                      </Button>
                    </Link>
                  </div>
                }
              />
              <Link href="/seller-dashboard/wallet">
                <DashboardCard
                  title="Transactions"
                  subtext="View history"
                  iconComponent={<FileText className="h-5 w-5" />}
                  className="h-full hover:bg-muted/50 transition-colors"
                />
              </Link>
            </div>
          </section>

          {/* 3. Operations & Relations */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Manage</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/seller-dashboard/service-area">
                <DashboardCard
                  title="Service Area"
                  subtext="Coverage"
                  iconComponent={<MapPin className="h-5 w-5" />}
                  className="h-full hover:bg-muted/50 transition-colors"
                />
              </Link>
              <Link href="/seller-dashboard/settings">
                <DashboardCard
                  title="Settings"
                  subtext="Preferences"
                  iconComponent={<Settings className="h-5 w-5" />}
                  className="h-full hover:bg-muted/50 transition-colors"
                />
              </Link>
              <Link href="/seller-dashboard/customers">
                <DashboardCard
                  title="Customers"
                  subtext="My Buyers"
                  iconComponent={<Users className="h-5 w-5" />}
                  className="h-full hover:bg-muted/50 transition-colors"
                />
              </Link>
              <Link href="/seller-dashboard/reviews">
                <DashboardCard
                  title="Reviews"
                  subtext="Feedback"
                  iconComponent={<Star className="h-5 w-5" />}
                  className="h-full hover:bg-muted/50 transition-colors"
                />
              </Link>
              <Link href="/seller-dashboard/support">
                <DashboardCard
                  title="Support"
                  subtext="Help Desk"
                  iconComponent={<Headphones className="h-5 w-5" />}
                  className="h-full hover:bg-muted/50 transition-colors"
                />
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <NotificationInbox userType="SELLER" />
        </div>
      </div>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Conference Hall
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Offers"
            subtext="Manage offers"
            iconComponent={<MessageSquare className="h-5 w-5" />}
            footerComponent={
              <Link href="/seller-dashboard/conference-hall/offers">
                <Button className="w-full" variant="outline">
                  Create Offers
                </Button>
              </Link>
            }
          />
          <DashboardCard
            title="Content"
            subtext="Manage content"
            iconComponent={<MessageSquare className="h-5 w-5" />}
            footerComponent={
              <Link href="/seller-dashboard/conference-hall/content">
                <Button className="w-full" variant="outline">
                  Create Content
                </Button>
              </Link>
            }
          />
          <DashboardCard
            title="Events"
            subtext="Manage events"
            iconComponent={<MessageSquare className="h-5 w-5" />}
            footerComponent={
              <Link href="/seller-dashboard/conference-hall/events">
                <Button className="w-full" variant="outline">
                  Create Events
                </Button>
              </Link>
            }
          />
          <DashboardCard
            title="Forum"
            subtext="Manage forum"
            iconComponent={<MessageSquare className="h-5 w-5" />}
            footerComponent={
              <Link href="/seller-dashboard/conference-hall/forum">
                <Button className="w-full" variant="outline">
                  Join Discussion
                </Button>
              </Link>
            }
          />
        </div>
      </section>
    </div>
  );
}
