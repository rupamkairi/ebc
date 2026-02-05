"use client";

import { EventDiscovery } from "@/components/dashboard/buyer/events/event-discovery";
import { OfferDiscovery } from "@/components/dashboard/buyer/offers/offer-discovery";
import { ContentDiscovery } from "@/components/dashboard/buyer/content/content-discovery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Tag, Coffee, FileText } from "lucide-react";
import { ForumSection } from "@/components/shared/forum";

export default function BuyerConferenceHallPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tighter text-foreground">
          Conference Hall
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl">
          Discover exclusive webinars, training sessions, and professional
          resources. Engage with the community through our public forums.
        </p>
      </div>

      <Tabs defaultValue="events" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-full justify-start md:w-auto overflow-x-auto">
          <TabsTrigger
            value="events"
            className="rounded-xl px-8 h-full gap-2 font-black data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all uppercase tracking-tight"
          >
            <Calendar className="h-4 w-4" />
            Learning Events
          </TabsTrigger>
          <TabsTrigger
            value="offers"
            className="rounded-xl px-8 h-full gap-2 font-black data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all uppercase tracking-tight"
          >
            <Tag className="h-4 w-4" />
            Promotions & Offers
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="rounded-xl px-8 h-full gap-2 font-black data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all uppercase tracking-tight"
          >
            <FileText className="h-4 w-4" />
            Resources & Content
          </TabsTrigger>
          <TabsTrigger
            value="lounge"
            className="rounded-xl px-8 h-full gap-2 font-black data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all uppercase tracking-tight"
          >
            <Coffee className="h-4 w-4" />
            Community Lounge
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="events"
          className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <EventDiscovery />
        </TabsContent>
        <TabsContent
          value="offers"
          className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <OfferDiscovery />
        </TabsContent>
        <TabsContent
          value="content"
          className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <ContentDiscovery />
        </TabsContent>
        <TabsContent
          value="lounge"
          className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="bg-white rounded-4xl border border-muted/50 p-10 shadow-2xl shadow-black/5">
            <ForumSection slug="conference-hall-general" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
