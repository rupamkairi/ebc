"use client";

import { useEventQuery } from "@/queries/conferenceHallQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Video, 
  Users, 
  FileText, 
  FileVideo, 
  ExternalLink,
  ArrowLeft,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { ForumSection } from "@/components/shared/forum";

export default function BuyerEventDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: event, isLoading } = useEventQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Button onClick={() => router.back()} className="mt-4 rounded-xl">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:px-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="rounded-full bg-background/50 backdrop-blur-sm border-muted shadow-sm hover:translate-x-[-4px] transition-transform">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hall
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant={event.type === "LIVE" ? "default" : "secondary"} className={event.type === "LIVE" ? "bg-red-500 hover:bg-red-600 px-3 py-1" : "px-3 py-1"}>
                {event.type}
              </Badge>
              {event.isRemote && <Badge variant="outline" className="bg-blue-50/50 text-blue-700 border-blue-100 px-3 py-1">Online Session</Badge>}
              {event.isPhysical && <Badge variant="outline" className="bg-green-50/50 text-green-700 border-green-100 px-3 py-1">In-Person</Badge>}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                {event.name}
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {event.description}
              </p>
            </div>
          </div>

          {/* Main Content Area (Videos / Links) */}
          {event.hasJoined ? (
            <div className="space-y-8">
              {event.meetingUrl && event.isRemote && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <Card className="relative bg-card border-none shadow-xl overflow-hidden rounded-2xl">
                    <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-600">
                          <Video className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-2xl text-foreground">Live Virtual Access</h3>
                          <p className="text-muted-foreground mt-1">Your secure link is ready. Join the room below.</p>
                        </div>
                      </div>
                      <Button variant="default" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-xl font-bold text-lg shadow-lg shadow-blue-200" asChild>
                        <a href={event.meetingUrl} target="_blank" rel="noopener noreferrer">
                          Join Google Meet <ExternalLink className="ml-2 h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Media Attachments */}
                <Card className="border-none bg-muted/30 rounded-2xl shadow-inner">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileVideo className="h-5 w-5 text-primary" />
                      </div>
                      Media & Recordings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.attachments?.filter(a => a.mediaId).length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground italic">No media files provided for this session.</p>
                      </div>
                    ) : (
                      event.attachments?.filter(a => a.mediaId).map((attachment) => (
                        <div key={attachment.id} className="group/item flex items-center justify-between p-4 bg-background rounded-xl border border-transparent hover:border-primary/20 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0">
                               <FileVideo className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-bold truncate">
                              {attachment.media?.name || "Video Content"}
                            </span>
                          </div>
                          <Button size="sm" variant="secondary" className="rounded-lg group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors" asChild>
                            <a href={attachment.media?.url} target="_blank" rel="noopener noreferrer">
                              Play
                            </a>
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Document Attachments */}
                <Card className="border-none bg-muted/30 rounded-2xl shadow-inner">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-bold">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      Resources & Docs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.attachments?.filter(a => a.documentId).length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground italic">No downloadable resources yet.</p>
                      </div>
                    ) : (
                      event.attachments?.filter(a => a.documentId).map((attachment) => (
                        <div key={attachment.id} className="group/item flex items-center justify-between p-4 bg-background rounded-xl border border-transparent hover:border-primary/20 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0">
                               <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-bold truncate">
                              {attachment.document?.name || "Resource Guide"}
                            </span>
                          </div>
                          <Button size="sm" variant="secondary" className="rounded-lg group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors" asChild>
                            <a href={attachment.document?.url} target="_blank" rel="noopener noreferrer">
                              Get Doc
                            </a>
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-muted py-24 text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 text-muted-foreground mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Content is Private</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Join this session from the hall to unlock the meeting link, recordings, and resources.
              </p>
              <Button size="lg" className="rounded-2xl" onClick={() => router.push('/buyer-dashboard/conference-hall')}>
                View Joining Options
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="overflow-hidden border-none shadow-xl rounded-2xl bg-linear-to-b from-card to-muted/10">
            <CardHeader className="bg-primary/5 pb-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest text-primary/60">Event Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-6">
                {event.startDate && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <Calendar className="h-5 w-5 shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                      <p className="font-extrabold text-foreground">{format(new Date(event.startDate), "EEEE, do MMMM")}</p>
                    </div>
                  </div>
                )}
                {event.startDate && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <Clock className="h-5 w-5 shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Timing</p>
                      <p className="font-extrabold text-foreground">
                        {format(new Date(event.startDate), "p")} 
                        {event.endDate && ` - ${format(new Date(event.endDate), "p")}`}
                      </p>
                    </div>
                  </div>
                )}
                {event.isPhysical && event.location && (
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <MapPin className="h-5 w-5 shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Venue</p>
                      <p className="font-extrabold text-foreground">{event.location}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-6 border-t border-muted">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-black text-xl">{event._count?.participants || 0}</span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted rounded-full px-3 py-1">Enrolled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-muted/40 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Hosted By</p>
              <div className="flex items-center gap-4">
                 <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                   {event.entity?.name?.charAt(0)}
                 </div>
                 <div>
                   <p className="font-extrabold text-lg text-foreground leading-tight">{event.entity?.name}</p>
                   <div className="flex items-center gap-1.5 mt-0.5">
                     <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Verified Seller</p>
                   </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="pt-16 border-t border-dashed">
        <div className="max-w-4xl">
          <ForumSection eventId={id} />
        </div>
      </div>
    </div>
  );
}
