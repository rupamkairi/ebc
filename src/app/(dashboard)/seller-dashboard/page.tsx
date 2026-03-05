"use client";

import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  FileText,
  Headphones,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Users,
  Wallet,
  Clock,
  XCircle,
  Package,
  Bell,
  Plus,
  Edit2,
  Eye,
  Store,
  ChevronRight,
  CheckCircle2,
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
import { ACTIVITY_TYPE } from "@/constants/enums";

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
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });

  const { data: appointmentAssignments = [] } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.APPOINTMENT_ASSIGNMENT,
  });

  const { data: quotations = [] } = useQuotationsQuery({
    createdById: user?.user?.id,
  });

  const pendingQuotations = quotations.filter(
    (q) => q.status === "PENDING",
  ).length;
  const sentQuotations = quotations.length;

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
                : mainEntity?.verificaitonRemark ||
                  "Your business profile was rejected."}
            </span>
            <Button variant="outline" size="sm" className="ml-4 bg-background">
              {status === "PENDING" ? "View Status" : "Contact Support"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* 1. Active Business */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#1E3A8A]">
              <Bell className="h-5 w-5" /> 
              <h2 className="text-xl font-bold tracking-tight">Active Business</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Catalogue */}
              <Card className="bg-gradient-to-r from-[#173072] to-[#2547a4] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between col-span-1 md:col-span-2 border-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Product Catalogue</h3>
                    <p className="text-sm font-normal text-blue-100">[Manage your listings and prices]</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <Link href="/seller-dashboard/catalog?create=true" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full sm:w-auto bg-white text-[#173072] hover:bg-gray-100 border-0 rounded-lg px-4 h-10 text-sm font-semibold">
                      <Plus className="mr-2 h-4 w-4" /> New Product Listing
                    </Button>
                  </Link>
                  <Link href="/seller-dashboard/catalog" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/20 rounded-lg px-4 h-10 text-sm font-semibold">
                      <Edit2 className="mr-2 h-4 w-4" /> Edit Product Listing
                    </Button>
                  </Link>
                  <Link href="/seller-dashboard/catalog" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-[#EF8A17] hover:bg-[#d87c14] text-white border-0 rounded-lg px-4 h-10 text-sm font-semibold">
                      <Eye className="mr-2 h-4 w-4" /> View Product Listing
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* New Enquirers */}
              <Link href="/seller-dashboard/enquiries" className="h-full block">
                <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border-0 group relative hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-[#173072] to-[#2547a4] text-white py-3 px-4 flex items-center justify-center gap-2 -mt-[25px]">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold text-lg">New Enquirers</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-white min-h-[100px] sm:min-h-[120px]">
                    <span className="text-4xl sm:text-5xl font-bold text-[#173072]">{pendingEnquiryCount}</span>
                    {respondedEnquiryCount > 0 && (
                      <span className="text-[11px] text-muted-foreground font-semibold mt-1">{respondedEnquiryCount} responded</span>
                    )}
                  </div>
                </Card>
              </Link>

              {/* Your Appointments */}
              <Link href="/seller-dashboard/appointments" className="block h-full">
                <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-orange-100 hover:shadow-md transition-shadow">
                  <div className="bg-[#EF8A17] text-white h-[54px] shrink-0 px-4 flex items-center justify-center gap-2 relative -mt-[25px] whitespace-nowrap">
                    <CalendarDays className="h-5 w-5" />
                    <span className="font-semibold text-lg">Your Appointments</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-white">
                    <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">Site Visit Requests</span>
                    <span className="text-3xl sm:text-4xl font-bold text-[#EF8A17]">{appointmentAssignments.length}</span>
                  </div>
                </Card>
              </Link>

              {/* Your Quotations */}
              <Link href="/seller-dashboard/quotations" className="block h-full">
                <Card className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-orange-100 hover:shadow-md transition-shadow">
                  <div className="bg-[#EF8A17] text-white h-[54px] shrink-0 px-4 flex items-center justify-center gap-2 -mt-[25px] whitespace-nowrap">
                    <FileText className="h-5 w-5" />
                    <span className="font-semibold text-lg">Your Quotations</span>
                  </div>
                  <div className="flex-1 flex items-stretch divide-x divide-gray-100">
                    <div className="flex flex-col items-center justify-center flex-1 p-3 sm:p-4 bg-white hover:bg-orange-50/50 transition-colors">
                      <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">Sent</span>
                      <span className="text-3xl sm:text-4xl font-bold text-[#EF8A17]">{sentQuotations}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 p-3 sm:p-4 bg-white hover:bg-orange-50/50 transition-colors">
                      <span className="text-[11px] sm:text-[13px] uppercase tracking-wider text-muted-foreground font-semibold mb-1 sm:mb-2 text-center">Pending</span>
                      <span className="text-3xl sm:text-4xl font-bold text-[#EF8A17]">{pendingQuotations}</span>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Active Leads */}
              <Card className="bg-[#173072] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-4 z-10">
                      <div className="flex items-center gap-2">
                          <div className="bg-white/10 p-2 rounded-lg">
                              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <span className="font-semibold text-base sm:text-lg tracking-tight">Active Leads</span>
                      </div>
                      <span className="text-4xl sm:text-5xl font-bold text-[#EF8A17] drop-shadow-md">{pendingEnquiryCount}</span>
                  </div>
                  {respondedEnquiryCount > 0 && (
                    <div className="z-10 mb-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                      <span className="text-xs font-semibold text-white/80">
                        {respondedEnquiryCount} past {respondedEnquiryCount === 1 ? "enquiry" : "enquiries"} responded
                      </span>
                    </div>
                  )}
                  <Link href="/seller-dashboard/enquiries" className="w-full z-10">
                      <Button className="w-full bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg h-11 text-sm font-semibold shadow-md active:scale-[0.98] transition-all">
                          <ChevronRight className="mr-1 h-4 w-4" /> Open Leads
                      </Button>
                  </Link>
              </Card>
            </div>
          </section>

          {/* 2. Finance */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#1E3A8A]">
              <Users className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">Finance</h2>
            </div>
            <Card className="bg-[#EF8A17] text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between border-0 gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-md shadow-inner">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <div className="flex flex-col items-start sm:items-baseline">
                  <span className="text-sm font-medium text-white/90 tracking-wide uppercase">Coin Balance</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight">{isWalletLoading ? "..." : (wallet?.balance ?? 0).toLocaleString()}</span>
                    <span className="text-base sm:text-lg font-medium text-white/90">Coins</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/seller-dashboard/wallet" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full bg-white text-[#EF8A17] hover:bg-gray-50 border-0 rounded-lg px-6 h-11 font-bold shadow-sm">
                    Add Coins
                  </Button>
                </Link>
                <Link href="/seller-dashboard/wallet" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white/10 rounded-lg px-5 h-11 font-medium flex items-center">
                    Transaction History
                  </Button>
                </Link>
              </div>
            </Card>
          </section>

          {/* 3. Operations */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#1E3A8A]">
              <Settings className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">Operations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-[#173072] mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg"><MapPin className="h-6 w-6" /></div>
                    <h3 className="font-bold text-lg">Service Area Management</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Manage the locations and pincodes where you offer your services or deliver products.</p>
                </div>
                <Link href="/seller-dashboard/service-area">
                  <Button className="w-full sm:w-auto bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg px-6 h-11 font-medium shadow-sm active:scale-95 transition-all">
                    Manage Coverage Pincode
                  </Button>
                </Link>
              </Card>

              <Card className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="mb-6">
                  <div className="flex items-center gap-3 text-[#173072] mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg"><Store className="h-6 w-6" /></div>
                    <h3 className="font-bold text-lg">Store Setting</h3>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">Configure your shop details, policies, and operational hours to optimize your presence.</p>
                </div>
                <Link href="/seller-dashboard/settings">
                  <Button className="w-full sm:w-auto bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg px-6 h-11 font-medium shadow-sm active:scale-95 transition-all">
                    Manage Store Settings
                  </Button>
                </Link>
              </Card>
            </div>
          </section>

          {/* 4. Relations */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-[#1E3A8A]">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">Relations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-b from-[#173072] to-[#0A163B] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Users className="h-6 w-6 text-[#EF8A17]" />
                  <h3 className="font-bold text-lg tracking-wide">Customers</h3>
                </div>
                <Link href="/seller-dashboard/customers" className="w-full relative z-10">
                  <Button className="w-full bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg h-11 shadow-md font-semibold text-[15px]">
                    My Buyers
                  </Button>
                </Link>
              </Card>

              <Card className="bg-gradient-to-b from-[#173072] to-[#0A163B] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Star className="h-6 w-6 text-[#EF8A17]" />
                  <h3 className="font-bold text-lg tracking-wide">Reviews</h3>
                </div>
                <Link href="/seller-dashboard/reviews" className="w-full relative z-10">
                  <Button className="w-full bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg h-11 shadow-md font-semibold text-[15px]">
                    View Feedback
                  </Button>
                </Link>
              </Card>

              <Card className="bg-gradient-to-b from-[#173072] to-[#0A163B] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full border-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Headphones className="w-16 h-16" />
                </div>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Headphones className="h-6 w-6 text-[#EF8A17]" />
                  <h3 className="font-bold text-lg tracking-wide">Technical Support</h3>
                </div>
                <div className="flex flex-col gap-3 relative z-10 w-full">
                  <Link href="/seller-dashboard/support" className="w-full">
                      <Button className="w-full bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg h-11 shadow-md text-sm font-semibold px-4">
                        View HelpDesk
                      </Button>
                  </Link>
                  <Link href="/seller-dashboard/support" className="w-full">
                      <Button className="w-full bg-[#EF8A17] hover:bg-[#d87c14] text-white rounded-lg h-11 shadow-md text-sm font-semibold px-4">
                        View Tickets
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
                Conference Hall
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-[#173072]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1E3A8A]">Offers</h3>
                    <p className="text-xs text-muted-foreground font-medium">Manage offers</p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Link href="/seller-dashboard/conference-hall/offers">
                    <Button variant="outline" className="w-full rounded-xl h-10 font-semibold border-gray-300">Create Offers</Button>
                  </Link>
                </div>
              </Card>
              
              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#173072]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1E3A8A]">Content</h3>
                    <p className="text-xs text-muted-foreground font-medium">Manage content</p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Link href="/seller-dashboard/conference-hall/content">
                    <Button variant="outline" className="w-full rounded-xl h-10 font-semibold border-gray-300">Create Content</Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-[#173072]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1E3A8A]">Events</h3>
                    <p className="text-xs text-muted-foreground font-medium">Manage events</p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Link href="/seller-dashboard/conference-hall/events">
                    <Button variant="outline" className="w-full rounded-xl h-10 font-semibold border-gray-300">Create Events</Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-5 flex flex-col gap-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#173072]" />
                  <div>
                    <h3 className="font-bold text-base text-[#1E3A8A]">Forum</h3>
                    <p className="text-xs text-muted-foreground font-medium">Manage forum</p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Link href="/seller-dashboard/conference-hall/forum">
                    <Button variant="outline" className="w-full rounded-xl h-10 font-semibold border-gray-300">Join Discussion</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </section>
        </div>

        {/* Sidebar Column (Notifications) */}
        <div className="hidden lg:block space-y-8 h-full">
          <div className="sticky top-24 pt-4 lg:pt-0">
             <div className="flex items-center gap-2 mb-4 px-2">
                 <Bell className="h-5 w-5 text-[#173072]" />
                 <h2 className="text-xl font-bold text-[#173072] tracking-tight">Notifications</h2>
             </div>
             <NotificationInbox userType="SELLER" respondedEnquiryIds={respondedEnquiryIds} />
          </div>
        </div>
      </div>
    </div>
  );
}
