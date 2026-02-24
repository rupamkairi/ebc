"use client";

import { EventDiscovery } from "@/components/dashboard/buyer/events/event-discovery";
import { OfferDiscovery } from "@/components/dashboard/buyer/offers/offer-discovery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Tag, Sofa } from "lucide-react";
import { ForumSection } from "@/components/shared/forum";
import { cn } from "@/lib/utils";
import { BuyerDashboardSidebar } from "@/components/layouts/dashboard/buyer-dashboard-sidebar";
import BuyerDashboardHeader from "@/components/layouts/dashboard/buyer-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";

export default function ConferenceHallPage() {
  return (
    <LayoutProvider>
      <div className="flex min-h-screen flex-col bg-[#F8F9FC] w-full">
        <BuyerDashboardHeader />
        <div className="flex flex-1 w-full flex-row">
          <BuyerDashboardSidebar />
          <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 sm:py-10 w-full flex flex-col">
            <div className="flex-1 max-w-7xl mx-auto w-full py-6 md:py-12 px-4">
              {/* Header Section */}
              <div className="text-center space-y-4 mb-12">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#3D52A0]">
                  Conference Hall
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                  Discover Exclusive webinars, training sessions and professional
                  resources engage with the community with our forums
                </p>
              </div>

              <Tabs defaultValue="events" className="w-full">
                {/* Custom Styled Tabs Table-like Header */}
                <div className="bg-[#D1D5DB] rounded-t-2xl p-0 overflow-hidden border-x border-t border-muted/50">
                  <TabsList className="bg-transparent h-16 w-full justify-start rounded-none p-0 flex">
                    <TabsTrigger
                      value="events"
                      className={cn(
                        "flex-1 h-full gap-3 font-bold text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0",
                        "data-[state=active]:bg-[#3D52A0]! data-[state=active]:text-white! data-[state=active]:rounded-tl-2xl",
                        "text-muted-foreground"
                      )}
                    >
                      <GraduationCap className="h-5 w-5" />
                      Learning Events
                    </TabsTrigger>
                    <TabsTrigger
                      value="offers"
                      className={cn(
                        "flex-1 h-full gap-3 font-bold text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0",
                        "data-[state=active]:bg-[#3D52A0]! data-[state=active]:text-white!",
                        "text-muted-foreground"
                      )}
                    >
                      <Tag className="h-5 w-5" />
                      Promotions and Offers
                    </TabsTrigger>
                    <TabsTrigger
                      value="lounge"
                      className={cn(
                        "flex-1 h-full gap-3 font-bold text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0",
                        "data-[state=active]:bg-[#3D52A0]! data-[state=active]:text-white! data-[state=active]:rounded-tr-2xl",
                        "text-muted-foreground"
                      )}
                    >
                      <Sofa className="h-5 w-5" />
                      Community Lounge
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Content Container with Blue Border */}
                <div className="bg-white border-2 border-[#3D52A0] rounded-b-2xl min-h-[500px] shadow-xl overflow-hidden">
                  <TabsContent value="events" className="m-0 focus-visible:outline-none">
                    <div className="p-4 md:p-12">
                      <EventDiscovery />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="offers" className="m-0 focus-visible:outline-none">
                    <div className="p-4 md:p-12">
                      <OfferDiscovery />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="lounge" className="m-0 focus-visible:outline-none">
                    <div className="p-4 md:p-12">
                      <div className="max-w-4xl mx-auto">
                        <ForumSection slug="conference-hall-general" />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
