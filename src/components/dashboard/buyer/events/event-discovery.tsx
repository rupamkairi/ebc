"use client";

import { useEventsQuery, useJoinEventMutation } from "@/queries/conferenceHallQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useSessionQuery } from "@/queries/authQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Video, 
  Search, 
  Users,
  Sparkles,
  Unlock,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export function EventDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState<"FUTURE" | "PAST" | "ALL">("FUTURE");

  const { data: session } = useSessionQuery();
  const { data: entities } = useEntitiesQuery();
  const entity = entities?.[0]; // Context entity if available

  const { data: events, isLoading } = useEventsQuery({
    isPublic: true,
    search: searchTerm,
    timeframe: timeframe,
    targeting: session?.user?.pincodeId ? {
      pincodeId: session.user.pincodeId,
    } : undefined,
  });

  const joinEvent = useJoinEventMutation();

  const handleJoin = async (id: string) => {
    try {
      await joinEvent.mutateAsync({ id, entityId: entity?.id });
      toast.success("Successfully joined the event!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to join event";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as "FUTURE" | "PAST" | "ALL")} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full bg-muted/50 p-1 h-11">
            <TabsTrigger 
              value="FUTURE" 
              className="data-[state=active]:bg-[#3D52A0] data-[state=active]:text-white transition-all font-bold"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger 
              value="PAST" 
              className="data-[state=active]:bg-[#3D52A0] data-[state=active]:text-white transition-all font-bold"
            >
              Recorded
            </TabsTrigger>
            <TabsTrigger 
              value="ALL" 
              className="data-[state=active]:bg-[#3D52A0] data-[state=active]:text-white transition-all font-bold"
            >
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 md:py-20 animate-in fade-in duration-700 px-4">
          <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-lg aspect-video mb-6 md:mb-8">
            <Image 
              src="/images/conference-hall/conference-hall-empty.png" 
              alt="No events available"
              fill
              className="object-contain rounded-3xl"
            />
          </div>
          <p className="text-[#9CA3AF] text-base md:text-lg font-medium text-center max-w-md italic px-4">
            Hmm... Seems quiet down here, Conference videos will appear down here once they are created
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col group hover:shadow-2xl transition-all duration-500 border-none bg-linear-to-b from-card to-muted/30 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={event.type === "LIVE" ? "default" : "outline"} className={event.type === "LIVE" ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-muted/50"}>
                    {event.type}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Users className="h-3 w-3" />
                    {event._count?.participants || 0}
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors text-xl font-bold leading-tight line-clamp-2">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-xs leading-relaxed">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-3 text-sm">
                   {event.startDate && (
                     <div className="flex items-start gap-2.5">
                       <div className="bg-primary/10 p-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                       </div>
                       <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Event Date</p>
                        <p className="font-semibold text-foreground leading-none mt-0.5">{format(new Date(event.startDate), "PPP p")}</p>
                       </div>
                     </div>
                   )}
                   <div className="flex gap-4">
                    {event.isPhysical && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.isRemote && (
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        <Video className="h-3.5 w-3.5" />
                        <span>Online Meet</span>
                      </div>
                    )}
                   </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-6 px-6 bg-linear-to-t from-muted/50 to-transparent flex flex-col gap-4">
                {event.hasJoined ? (
                  <Button variant="default" className="w-full h-11 gap-2 rounded-xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200" asChild>
                    <a href={`/buyer-dashboard/conference-hall/events/${event.id}`}>
                      <Unlock className="h-4 w-4" />
                      Access Event Area
                    </a>
                  </Button>
                ) : (
                  <Button 
                    className="w-full h-11 gap-2 rounded-xl shadow-lg shadow-primary/20" 
                    onClick={() => handleJoin(event.id)}
                    disabled={joinEvent.isPending}
                  >
                    {joinEvent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Register for Free
                  </Button>
                )}
                <div className="w-full flex justify-center border-t border-muted pt-3">
                   <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                     By <span className="font-bold text-foreground">{event.entity?.name}</span>
                   </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
