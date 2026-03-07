"use client";

import {
  useEventsQuery,
  useJoinEventMutation,
} from "@/queries/conferenceHallQueries";
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
  Unlock,
  Loader2,
  Sparkles,
  Building2,
  ExternalLink,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConferenceHallEvent } from "@/types/conference-hall";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EventDiscoveryProps {
  pincodeId: string;
  isPublic?: boolean;
}

export function EventDiscovery({
  pincodeId,
  isPublic = true,
}: EventDiscoveryProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState<"FUTURE" | "PAST" | "ALL">("ALL");
  const [selectedEvent, setSelectedEvent] =
    useState<ConferenceHallEvent | null>(null);

  const { data: session } = useSessionQuery();
  const { data: entities } = useEntitiesQuery();
  const entity = entities?.[0]; // Context entity if available

  // Fetch all public active events for this pincode
  const { data: events, isLoading } = useEventsQuery({
    search: searchTerm,
    isPublic: true,
    isActive: true,
    targeting: { pincodeId },
  });

  const joinEvent = useJoinEventMutation();

  // Filter events based on timeframe and publication status on frontend for better reliability
  const filteredEvents =
    events?.filter((event) => {
      // Must be active and (public OR have a publication date)
      if (!event.isActive) return false;
      if (!event.isPublic && !event.publishedAt) return false;

      // Timeframe filtering
      if (timeframe === "FUTURE") {
        return (
          event.type === "LIVE" &&
          event.startDate &&
          new Date(event.startDate) > new Date()
        );
      }
      if (timeframe === "PAST") {
        return event.type === "RECORDED";
      }
      return true;
    }) || [];

  const handleJoin = async (id: string) => {
    if (!session) {
      toast.info("Please sign up to register for events");
      router.push("/auth/register?type=buyer");
      return;
    }

    try {
      await joinEvent.mutateAsync({ id, entityId: entity?.id });
      toast.success("Successfully joined the event!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to join event";
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
        <Tabs
          value={timeframe}
          onValueChange={(v) => setTimeframe(v as "FUTURE" | "PAST" | "ALL")}
          className="w-full md:w-auto"
        >
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
              className="data-[state=active]:bg-[#3D52A0] data-[state=active]:text-white transition-all font-semibold"
            >
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {!filteredEvents || filteredEvents.length === 0 ? (
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
            Hmm... Seems quiet down here, Conference videos will appear down
            here once they are created
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col group hover:shadow-2xl transition-all duration-500 border-none bg-linear-to-b from-card to-muted/30 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={event.type === "LIVE" ? "default" : "outline"}
                    className={
                      event.type === "LIVE"
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-muted/50"
                    }
                  >
                    {event.type}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4" />
                    {event._count?.participants || 0}
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors text-xl font-bold leading-tight line-clamp-2">
                  {event.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2 text-xs leading-relaxed">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-3 text-sm">
                  {event.startDate && (
                    <div className="flex items-start gap-2.5">
                      <div className="bg-primary/10 p-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          Event Date
                        </p>
                        <p className="font-semibold text-foreground leading-none mt-0.5">
                          {format(new Date(event.startDate), "PPP p")}
                        </p>
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
                  <Button
                    variant="default"
                    className="w-full h-11 gap-2 rounded-xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Unlock className="h-4 w-4" />
                    Access Event Area
                  </Button>
                ) : (
                  <Button
                    className="w-full h-11 gap-2 rounded-xl shadow-lg shadow-primary/20"
                    onClick={() => handleJoin(event.id)}
                    disabled={joinEvent.isPending}
                  >
                    {joinEvent.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Register for Free
                  </Button>
                )}
                <div className="w-full flex justify-center border-t border-muted pt-3">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    By{" "}
                    <span className="font-bold text-foreground">
                      {event.entity?.name}
                    </span>
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          {selectedEvent && (
            <div className="flex flex-col">
              {/* Header Banner */}
              <div
                className={cn(
                  "p-8 text-white relative overflow-hidden",
                  selectedEvent.type === "LIVE" ? "bg-red-600" : "bg-[#3D52A0]",
                )}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-32 w-32" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md px-3 py-1 text-xs font-bold">
                    {selectedEvent.type}
                  </Badge>
                  {selectedEvent.isRemote && (
                    <Badge className="bg-blue-400/30 text-white border-white/30 backdrop-blur-md px-3 py-1 text-xs font-bold">
                      Online
                    </Badge>
                  )}
                  {selectedEvent.isPhysical && (
                    <Badge className="bg-green-400/30 text-white border-white/30 backdrop-blur-md px-3 py-1 text-xs font-bold">
                      Physical
                    </Badge>
                  )}
                </div>

                <DialogHeader className="text-left space-y-2 relative z-10">
                  <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    {selectedEvent.name}
                  </DialogTitle>
                </DialogHeader>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8 bg-linear-to-b from-white to-slate-50">
                {/* Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#3D52A0]">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      About this event
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <DialogDescription className="text-base text-slate-600 leading-relaxed font-medium">
                    {selectedEvent.description ||
                      "No description provided for this event."}
                  </DialogDescription>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Time Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors group">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Date & Time
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedEvent.startDate
                          ? format(new Date(selectedEvent.startDate), "PPP p")
                          : "TBD"}
                      </p>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors group">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {selectedEvent.isRemote
                          ? "Meeting Link"
                          : "Venue Location"}
                      </p>
                      <p className="text-sm font-bold text-slate-700 line-clamp-2 break-all">
                        {selectedEvent.isRemote
                          ? selectedEvent.meetingUrl ||
                            selectedEvent.location ||
                            "Join via URL"
                          : selectedEvent.location || "Venue TBD"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attachments Section if any */}
                {selectedEvent.attachments &&
                  selectedEvent.attachments.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Resources & Materials
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedEvent.attachments.map((att) => (
                          <a
                            key={att.id}
                            href={att.media?.url || att.document?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/30 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                <Video className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                              </div>
                              <span className="text-sm font-bold text-slate-600">
                                {att.media?.name ||
                                  att.document?.name ||
                                  "Attachment"}
                              </span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Footer Section */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 text-center md:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Hosted by
                      </p>
                      <p className="text-sm font-black text-[#173072] uppercase">
                        {selectedEvent.entity?.name}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.isRemote && selectedEvent.meetingUrl ? (
                    <Button
                      className="rounded-2xl h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-black gap-2 shadow-lg shadow-red-100 w-full md:w-auto"
                      asChild
                    >
                      <a
                        href={selectedEvent.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting Now
                        <ExternalLink size={18} />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2xl h-12 px-8 bg-[#FFA500] hover:bg-[#E69500] text-white font-black gap-2 shadow-lg shadow-amber-200 w-full md:w-auto"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Ok
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
