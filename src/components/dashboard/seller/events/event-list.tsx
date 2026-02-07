"use client";

import { useEventsQuery, useDeleteEventMutation } from "@/queries/conferenceHallQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
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
  MoreVertical, 
  Trash2, 
  Users
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function EventList() {
  const { data: entities } = useEntitiesQuery();
  const entity = entities?.[0];

  const { data: events, isLoading } = useEventsQuery({
    entityId: entity?.id,
  });

  const deleteEvent = useDeleteEventMutation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>No events found</CardTitle>
        <CardDescription>
          You haven&apos;t created any events yet. Host a live session or share a recorded one.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-linear-to-b from-card to-muted/20 relative">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteEvent.mutate(event.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={event.type === "LIVE" ? "default" : "secondary"} className="rounded-md">
                {event.type}
              </Badge>
              <Badge 
                variant={
                  event.verificationStatus === "APPROVED" ? "outline" : 
                  event.verificationStatus === "REJECTED" ? "destructive" : 
                  "secondary"
                } 
                className="uppercase text-[10px]"
              >
                {event.verificationStatus}
              </Badge>
              {event.isRemote && <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-200/50 text-[10px]">Remote</Badge>}
              {event.isPhysical && <Badge variant="outline" className="bg-green-50/50 text-green-700 border-green-200/50 text-[10px]">Physical</Badge>}
            </div>
            <CardTitle className="line-clamp-1 text-lg font-bold group-hover:text-primary transition-colors">{event.name}</CardTitle>
            <CardDescription className="line-clamp-2 h-10 mt-2 text-xs leading-relaxed">
              {event.description || "No description provided."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="space-y-3 text-[13px] text-muted-foreground">
              {event.startDate && (
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground/80">{format(new Date(event.startDate), "PPP p")}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {event.isPhysical && event.location && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.isRemote && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    <Video className="h-3 w-3" />
                    <span>Meeting Link Active</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-muted/50 mt-auto">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">
                     {event._count?.participants || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Joined</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 px-6 pb-6 bg-muted/5">
            <Button variant="outline" className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300" asChild>
              <a href={`/seller-dashboard/conference-hall/events/${event.id}`}>
                Manage Event & Stats
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
