"use client";

import { EventDiscovery } from "@/components/dashboard/buyer/events/event-discovery";
import { OfferDiscovery } from "@/components/dashboard/buyer/offers/offer-discovery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Tag, Sofa, MapPin, LogIn } from "lucide-react";
import { ForumSection } from "@/components/shared/forum/forum-section";
import { cn } from "@/lib/utils";
import BuyerDashboardHeader from "@/components/layouts/dashboard/buyer-dashboard-header";
import LayoutProvider from "@/components/layouts/dashboard/layout-provider";
import { useLanguage } from "@/hooks/useLanguage";
import { useSessionQuery } from "@/queries/authQueries";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ConferenceHallContent() {
  const { t } = useLanguage();

  // Lifted Pincode State
  const [manualPincode, setManualPincode] = useState("");
  const [appliedPincode, setAppliedPincode] = useState("");

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(() => {
    return tabParam === "offers" || tabParam === "lounge" || tabParam === "events"
      ? tabParam
      : "events";
  });

  // Sync tab from URL if it changes after mount
  useEffect(() => {
    if (
      tabParam &&
      tabParam !== activeTab &&
      (tabParam === "offers" || tabParam === "lounge" || tabParam === "events")
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const { data: session, isLoading: sessionLoading } = useSessionQuery();
  const hasSession = !!session?.user;
  const sessionPincodeId = session?.user?.pincodeId;

  // Determine effective pincode
  const effectivePincode = sessionPincodeId || appliedPincode;

  const handlePincodeSearch = () => {
    setAppliedPincode(manualPincode.trim());
  };

  return (
    <LayoutProvider>
      <div className="flex min-h-screen flex-col bg-[#F8F9FC] w-full">
        <BuyerDashboardHeader />
        <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-6 sm:py-10 w-full flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto w-full py-6 md:py-12 px-4">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#3D52A0]">
                {t("conference_hall")}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                {t("conference_hall_desc")}
              </p>
            </div>

            {/* Global Pincode Requirement */}
            <div className="w-full flex justify-center mb-8">
              {!hasSession && !appliedPincode ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100 w-full max-w-2xl shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-blue-700 font-medium whitespace-nowrap">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>Enter your pincode to unlock content:</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      placeholder="e.g. 700001"
                      className="h-10 w-full rounded-xl text-sm border-blue-200 bg-white focus-visible:ring-blue-400"
                      value={manualPincode}
                      onChange={(e) =>
                        setManualPincode(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handlePincodeSearch()
                      }
                      maxLength={6}
                    />
                    <Button
                      className="h-10 rounded-xl bg-[#3D52A0] hover:bg-[#2d3f7c] text-white font-semibold shrink-0"
                      onClick={handlePincodeSearch}
                      disabled={manualPincode.trim().length < 4}
                    >
                      Unlock
                    </Button>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-blue-200 mx-2" />
                  <Link
                    href="/auth/login"
                    className="shrink-0 w-full sm:w-auto"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-10 border-blue-200 text-blue-700 hover:bg-blue-100 gap-2 text-sm font-semibold"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full max-w-2xl bg-blue-50 border border-blue-100 rounded-xl px-5 py-3">
                  <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Viewing contents for Pincode:{" "}
                      <strong>
                        {session?.user?.pincode?.pincode ||
                          appliedPincode ||
                          "Your Location"}
                      </strong>
                    </span>
                  </div>
                  {!hasSession && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-700 hover:bg-blue-100 hover:text-blue-800 h-8 text-xs font-semibold"
                      onClick={() => {
                        setManualPincode("");
                        setAppliedPincode("");
                      }}
                    >
                      Change
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Conditionally Render Content Based on Pincode */}
            {effectivePincode ? (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                {/* Custom Styled Tabs Table-like Header */}
                <div className="bg-[#D1D5DB] rounded-t-2xl p-0 overflow-x-auto overflow-y-hidden no-scrollbar border-x border-t border-muted/50">
                  <TabsList className="bg-transparent h-16 min-w-max md:w-full justify-start rounded-none p-0 flex">
                    <TabsTrigger
                      value="events"
                      className={cn(
                        "flex-1 h-full gap-2 md:gap-3 font-bold text-sm md:text-base border-r border-[#9CA3AF] last:border-r-0 whitespace-nowrap px-6 md:px-0",
                        "data-[state=active]:bg-[#3D52A0]! data-[state=active]:text-white! data-[state=active]:md:rounded-tl-2xl",
                        "text-muted-foreground",
                      )}
                    >
                      <GraduationCap className="h-4 w-4 md:h-5 md:w-5" />
                      {t("learning_events")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="offers"
                      className={cn(
                        "flex-1 h-full gap-2 md:gap-3 font-bold text-sm md:text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0 whitespace-nowrap px-6 md:px-0",
                        "data-[state=active]:bg-[#3D52A0]! data-[state=active]:text-white!",
                        "text-muted-foreground",
                      )}
                    >
                      <Tag className="h-4 w-4 md:h-5 md:w-5" />
                      {t("promotions_offers")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="lounge"
                      className={cn(
                        "flex-1 h-full gap-2 md:gap-3 font-bold text-sm md:text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0 whitespace-nowrap px-6 md:px-0",
                        "data-[state=active]:bg-[#3D52A0]! data-[state=active]:text-white! data-[state=active]:md:rounded-tr-2xl",
                        "text-muted-foreground",
                      )}
                    >
                      <Sofa className="h-4 w-4 md:h-5 md:w-5" />
                      {t("community_lounge")}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Content Container with Blue Border */}
                <div className="bg-white border-2 border-[#3D52A0] rounded-b-2xl min-h-[500px] shadow-xl overflow-hidden">
                  <TabsContent
                    value="events"
                    className="m-0 focus-visible:outline-none"
                  >
                    <div className="p-4 md:p-12">
                      <EventDiscovery pincodeId={effectivePincode} isPublic={true} />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="offers"
                    className="m-0 focus-visible:outline-none"
                  >
                    <div className="p-4 md:p-12">
                      <OfferDiscovery pincodeId={effectivePincode} isPublic={true} />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="lounge"
                    className="m-0 focus-visible:outline-none"
                  >
                    <div className="p-4 md:p-12">
                      <div className="max-w-4xl mx-auto">
                        <ForumSection
                          slug="conference-hall-general"
                          pincodeId={effectivePincode}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            ) : null}
          </div>
        </main>
      </div>
    </LayoutProvider>
  );
}

export default function ConferenceHallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FC]" />}>
      <ConferenceHallContent />
    </Suspense>
  );
}
