"use client";

import { EventDiscovery } from "@/components/dashboard/buyer/events/event-discovery";
import { OfferDiscovery } from "@/components/dashboard/buyer/offers/offer-discovery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Tag, Sofa, MapPin } from "lucide-react";
import { ForumSection } from "@/components/shared/forum";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { PincodeSearchAutocomplete } from "@/components/autocompletes/pincode-search-autocomplete";
import { Label } from "@/components/ui/label";

function BuyerConferenceHallContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState(() => {
    return tabParam === "offers" ||
      tabParam === "lounge" ||
      tabParam === "events"
      ? tabParam
      : "events";
  });

  const [pincodeId, setPincodeId] = useState(user?.pincodeId || "");

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

  // Sync pincode from user when it loads initially
  useEffect(() => {
    if (user?.pincodeId && !pincodeId) {
      setPincodeId(user.pincodeId);
    }
  }, [user?.pincodeId, pincodeId]);

  if (!pincodeId && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full py-6 md:py-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-primary">
            {t("conference_hall_title")}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            {t("conference_hall_desc_new")}
          </p>
        </div>

        {/* Pincode Filter */}
        <div className="w-full md:w-80 bg-white p-6 rounded-2xl border-2 border-primary/20 shadow-sm space-y-3">
          <Label className="text-sm font-bold text-primary flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Filter by Location
          </Label>
          <PincodeSearchAutocomplete
            value={pincodeId}
            onValueChange={setPincodeId}
            initialRecord={(user?.pincode?.pincode || "") as string}
            placeholder="Search pincode..."
          />
          <p className="text-[10px] text-muted-foreground italic">
            Showing results for your selected area
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Custom Styled Tabs */}
        <div className="bg-[#D1D5DB] rounded-t-2xl p-0 overflow-x-auto overflow-y-hidden no-scrollbar border-x border-t border-muted/50">
          <TabsList className="bg-transparent h-16 min-w-max md:w-full justify-start rounded-none p-0 flex">
            <TabsTrigger
              value="events"
              className={cn(
                "flex-1 h-full gap-2 md:gap-3 font-bold text-sm md:text-base border-r border-[#9CA3AF] last:border-r-0 whitespace-nowrap px-6 md:px-0",
                "data-[state=active]:bg-primary! data-[state=active]:text-white! data-[state=active]:md:rounded-tl-2xl",
                "text-muted-foreground",
              )}
            >
              <GraduationCap className="h-4 w-4 md:h-5 md:w-5" />
              {t("learning_events_tab_new")}
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className={cn(
                "flex-1 h-full gap-2 md:gap-3 font-bold text-sm md:text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0 whitespace-nowrap px-6 md:px-0",
                "data-[state=active]:bg-primary! data-[state=active]:text-white!",
                "text-muted-foreground",
              )}
            >
              <Tag className="h-4 w-4 md:h-5 md:w-5" />
              {t("promotions_offers_tab_new")}
            </TabsTrigger>
            <TabsTrigger
              value="lounge"
              className={cn(
                "flex-1 h-full gap-2 md:gap-3 font-bold text-sm md:text-base transition-all rounded-none border-r border-[#9CA3AF] last:border-r-0 whitespace-nowrap px-6 md:px-0",
                "data-[state=active]:bg-primary! data-[state=active]:text-white! data-[state=active]:md:rounded-tr-2xl",
                "text-muted-foreground",
              )}
            >
              <Sofa className="h-4 w-4 md:h-5 md:w-5" />
              {t("community_lounge_tab_new")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Container */}
        <div className="bg-white border-2 border-primary rounded-b-2xl min-h-[500px] shadow-xl overflow-hidden">
          <TabsContent
            value="events"
            className="m-0 focus-visible:outline-none"
          >
            <div className="p-4 md:p-12">
              <EventDiscovery pincodeId={pincodeId} />
            </div>
          </TabsContent>
          <TabsContent
            value="offers"
            className="m-0 focus-visible:outline-none"
          >
            <div className="p-4 md:p-12">
              <OfferDiscovery pincodeId={pincodeId} />
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
                  pincodeId={pincodeId}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default function BuyerConferenceHallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FC]" />}>
      <BuyerConferenceHallContent />
    </Suspense>
  );
}
