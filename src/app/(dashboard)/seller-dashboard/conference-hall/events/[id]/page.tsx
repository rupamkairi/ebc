"use client";

import { useEventQuery } from "@/queries/conferenceHallQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Video, 
  Users, 
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventForm } from "@/components/dashboard/seller/events/event-form";
import { ForumSection } from "@/components/shared/forum";

export default function SellerEventDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: event, isLoading } = useEventQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats Column */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-primary text-primary-foreground">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Participants</CardTitle>
               <div className="text-4xl font-bold flex items-center gap-2">
                 <Users className="h-8 w-8" />
                 {event._count?.participants || 0}
               </div>
             </CardHeader>
           </Card>


           <Card className="bg-muted/50">
             <CardContent className="pt-6 text-sm">
                <p className="font-semibold mb-2">Event Status</p>
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <span>Type</span>
                     <Badge variant="outline">{event.type}</Badge>
                   </div>
                   <div className="flex justify-between items-center">
                     <span>Visibility</span>
                     <Badge variant="outline">{event.isPublic ? "Public" : "Private"}</Badge>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="edit">Edit Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <Label>Schedule Details</Label>
                        <div className="text-sm space-y-2">
                           {event.startDate && (
                             <div className="flex items-center gap-2">
                               <Calendar className="h-4 w-4 text-primary" />
                               <span>{format(new Date(event.startDate), "PPP p")}</span>
                             </div>
                           )}
                           {event.isPhysical && (
                             <div className="flex items-center gap-2">
                               <MapPin className="h-4 w-4 text-primary" />
                               <span>{event.location}</span>
                             </div>
                           )}
                        </div>
                     </div>
                     <div className="space-y-3">
                        <Label>Meeting Information</Label>
                        {event.isRemote ? (
                          <div className="p-3 border rounded-md bg-blue-50 text-xs text-blue-700 space-y-2">
                             <div className="flex items-center gap-2 font-bold">
                               <Video className="h-4 w-4" />
                               Active Meeting Link
                             </div>
                             <p className="truncate">{event.meetingUrl || "Generating..."}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No remote access for this event.</p>
                        )}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions">
               <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-black/5">
                 <CardContent className="pt-10">
                   <ForumSection eventId={id} />
                 </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="edit">
               <EventForm initialData={event} entityId={event.entityId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2 ${className}`}>{children}</p>;
}
