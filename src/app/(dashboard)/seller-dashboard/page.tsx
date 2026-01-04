import Container from "@/components/containers/containers";
import { DashboardCard } from "@/components/dashboard/seller/dashboard-card";
import { DashboardContainerCard } from "@/components/dashboard/seller/dashboard-container-card";
import { NotificationCard } from "@/components/dashboard/seller/notification-card";
import { ProfileCard } from "@/components/dashboard/seller/profile-card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  FileText,
  Megaphone,
  Users,
  Wallet,
  Receipt,
  MessageSquare,
  FileSearch,
  MapPin,
  Star,
  Headphones,
  Settings,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { BottomNav } from "./bottom-nav";
import { DashboardHeader } from "./dashboard-header";

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader/>
      <Container>
        <div className="flex flex-col gap-8 py-8">
          {/* Top Profile Section */}
          <ProfileCard
            user={{ name: "Rajesh Kumar", role: "Super Seller", avatarUrl: "" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* 1. Core Actions & High Urgency */}
              <DashboardContainerCard title="Active Business" className="border-none shadow-sm bg-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <Link href="/seller-dashboard/catalog" className="md:col-span-4 group">
                    <DashboardCard
                      title="Product Catalog"
                      subtext="Manage your listings & prices"
                      className="bg-primary/5 border-primary/10 group-hover:border-primary/30 transition-all cursor-pointer h-full"
                      iconComponent={<FileText className="text-primary" />}
                      contentComponent={
                        <p className="text-sm text-foreground/60 italic mt-2 leading-relaxed">
                          Apna pura product range, specs aur technical sheets upload karein.
                        </p>
                      }
                    />
                  </Link>

                  <Link href="/seller-dashboard/enquiries" className="md:col-span-2 md:row-span-2 group">
                    <DashboardCard
                      title="New Enquiries"
                      className="border-blue-500/20 border-2 group-hover:border-blue-500/40 transition-all cursor-pointer h-full"
                      iconComponent={<Users className="h-5 w-5 text-blue-500" />}
                      contentComponent={
                        <div className="flex flex-col gap-6 mt-4">
                          <div className="flex flex-col">
                            <span className="text-5xl font-black text-blue-600 tracking-tighter italic">15</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Active Leads</span>
                          </div>
                          <div className="space-y-2">
                             <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[60%]" />
                             </div>
                             <p className="text-[10px] font-bold text-blue-600 italic">4 leads expiring soon!</p>
                          </div>
                        </div>
                      }
                      footerComponent={
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl mt-4">
                          Open Leads
                        </Button>
                      }
                    />
                  </Link>

                  <Link href="/seller-dashboard/appointments" className="md:col-span-2 group">
                    <DashboardCard
                      title="Appointments"
                      className="group-hover:bg-muted/50 transition-all cursor-pointer"
                      iconComponent={<CalendarDays size={20} className="text-foreground/40" />}
                      contentComponent={
                        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-foreground/40 italic">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          1 Site Visit Request
                        </div>
                      }
                    />
                  </Link>

                  <Link href="/seller-dashboard/quotations" className="md:col-span-2 group">
                    <DashboardCard
                      title="Quotations"
                      className="group-hover:bg-muted/50 transition-all cursor-pointer"
                      iconComponent={<FileSearch size={20} className="text-foreground/40" />}
                      contentComponent={
                        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-foreground/40 italic">
                           8 Sent · 3 Pending
                        </div>
                      }
                    />
                  </Link>
                </div>
              </DashboardContainerCard>

              {/* 2. Financials & Operations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Financial Manager */}
                <DashboardContainerCard title="Finances" className="border-none shadow-sm bg-white p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <Link href="/seller-dashboard/wallet" className="group">
                      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 group-hover:border-emerald-300 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                             <Wallet size={28} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/40">Wallet Balance</p>
                            <h4 className="text-2xl font-black text-emerald-900 leading-tight tracking-tight italic">₹12,450.00</h4>
                          </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                           <TrendingUp size={18} />
                        </div>
                      </div>
                    </Link>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/seller-dashboard/invoices" className="group">
                        <DashboardCard 
                          title="Invoices" 
                          subtext="Billing History"
                          iconComponent={<Receipt className="text-foreground/30" />}
                          className="group-hover:bg-muted/30 transition-all cursor-pointer h-full" 
                        />
                      </Link>
                      <Link href="/seller-dashboard/locations" className="group">
                        <DashboardCard 
                          title="Delivery Area" 
                          subtext="Pincode Setup"
                          iconComponent={<MapPin className="text-foreground/30" />}
                          className="group-hover:bg-muted/30 transition-all cursor-pointer h-full" 
                        />
                      </Link>
                    </div>
                  </div>
                </DashboardContainerCard>

                {/* Relationship & Support */}
                <DashboardContainerCard title="Relations" className="border-none shadow-sm bg-white p-6">
                   <div className="grid grid-cols-2 gap-4 h-full">
                      <Link href="/seller-dashboard/customers" className="group">
                        <DashboardCard 
                          title="Customers" 
                          subtext="My Buyers"
                          iconComponent={<Users className="text-foreground/30" />}
                          className="group-hover:bg-muted/30 transition-all cursor-pointer h-full" 
                        />
                      </Link>
                      <Link href="/seller-dashboard/messages" className="group">
                        <DashboardCard 
                          title="Messages" 
                          subtext="Direct Chat"
                          iconComponent={<MessageSquare className="text-foreground/30" />}
                          className="group-hover:bg-muted/30 transition-all cursor-pointer h-full" 
                        />
                      </Link>
                      <Link href="/seller-dashboard/reviews" className="group">
                        <DashboardCard 
                          title="Reviews" 
                          subtext="Feedback"
                          iconComponent={<Star className="text-foreground/30" />}
                          className="group-hover:bg-muted/30 transition-all cursor-pointer h-full" 
                        />
                      </Link>
                      <Link href="/seller-dashboard/support" className="group">
                        <DashboardCard 
                          title="Support" 
                          subtext="Help Desk"
                          iconComponent={<Headphones className="text-foreground/30" />}
                          className="group-hover:bg-muted/30 transition-all cursor-pointer h-full" 
                        />
                      </Link>
                   </div>
                </DashboardContainerCard>
              </div>

              {/* 3. Global Settings Shortcut */}
              <Link href="/seller-dashboard/settings" className="block group">
                <div className="p-6 rounded-3xl bg-white border border-border group-hover:border-primary transition-all flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-foreground/40">
                         <Settings size={20} />
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest text-foreground/60 italic">Store Preferences & Configuration</span>
                   </div>
                   <ArrowUpRight size={20} className="text-foreground/20 group-hover:text-primary transition-colors" />
                </div>
              </Link>

            </div>

            {/* Sidebar / Secondary Info */}
            <div className="lg:col-span-3 space-y-8">
              <NotificationCard className="h-full border-none shadow-none bg-transparent p-0" />
              
              <div className="p-8 rounded-4xl bg-indigo-600 text-white space-y-6 relative overflow-hidden">
                 <Megaphone className="absolute -top-4 -right-4 h-24 w-24 text-white/10 rotate-15" />
                 <div className="relative z-10">
                    <h3 className="text-xl font-black italic mb-2">Conference Hall</h3>
                    <p className="text-xs font-medium text-white/70 leading-relaxed mb-6">
                      Advertise your latest products directly to verified dealer networks and get higher visibility.
                    </p>
                    <Button className="w-full bg-white text-indigo-600 font-black h-12 rounded-xl hover:bg-white/90">
                      Broadcast Now
                    </Button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <BottomNav />
    </div>
  );
}

