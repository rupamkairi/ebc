"use client";

import {
  useEnquiriesQuery,
  useAppointmentsQuery,
  useQuotationsQuery,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MessageSquare,
  Calendar,
  FileText,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/containers";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { ActivityDetailModal } from "@/components/dashboard/admin/activities/activity-detail-modal";
import { Button } from "@/components/ui/button";

type ActivityType = "ENQUIRY" | "APPOINTMENT" | "QUOTATION" | "VISIT";

interface UnifiedActivity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  userName: string;
  date: Date;
  status: string;
  link: string;
  raw: any;
}

export default function AdminActivitiesOverviewPage() {
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<"ENQUIRY" | "APPOINTMENT">(
    "ENQUIRY",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: enquiries = [], isLoading: loadingEnquiries } =
    useEnquiriesQuery();
  const { data: appointments = [], isLoading: loadingAppointments } =
    useAppointmentsQuery();
  const { data: quotations = [], isLoading: loadingQuotations } =
    useQuotationsQuery();
  const { data: visits = [], isLoading: loadingVisits } = useVisitsQuery();

  const activities = useMemo(() => {
    const items: UnifiedActivity[] = [];

    enquiries.forEach((enq) =>
      items.push({
        id: enq.id,
        type: "ENQUIRY",
        title: "New Enquiry Posted",
        subtitle: enq.enquiryLineItems[0]?.item?.name || "Enquiry",
        userName: enq.createdBy?.name || "Anonymous",
        date: new Date(enq.createdAt),
        status: enq.status,
        link: "/admin-dashboard/activities/enquiries",
        raw: enq,
      }),
    );

    appointments.forEach((app) =>
      items.push({
        id: app.id,
        type: "APPOINTMENT",
        title: "New Appointment Requested",
        subtitle: app.appointmentLineItems[0]?.item?.name || "Appointment",
        userName: app.createdBy?.name || "Anonymous",
        date: new Date(app.createdAt),
        status: app.status,
        link: "/admin-dashboard/activities/appointments",
        raw: app,
      }),
    );

    quotations.forEach((quo) =>
      items.push({
        id: quo.id,
        type: "QUOTATION",
        title: "Quotation Submitted",
        subtitle: `Rate: ${quo.quotationLineItems[0]?.rate || "N/A"}`,
        userName: quo.createdBy?.name || "Seller",
        date: new Date(quo.createdAt),
        status: quo.status,
        link: "/admin-dashboard/activities/enquiries",
        raw: quo,
      }),
    );

    visits.forEach((vis) =>
      items.push({
        id: vis.id,
        type: "VISIT",
        title: "Visit Response",
        subtitle: vis.status,
        userName: vis.createdBy?.name || "Provider",
        date: new Date(vis.createdAt),
        status: vis.status,
        link: "/admin-dashboard/activities/appointments",
        raw: vis,
      }),
    );

    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [enquiries, appointments, quotations, visits]);

  if (
    loadingEnquiries ||
    loadingAppointments ||
    loadingQuotations ||
    loadingVisits
  ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Container className="py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-primary">
          Activity Overview
        </h1>
        <p className="text-muted-foreground font-medium">
          A real-time chronological feed of all platform activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50/30 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-blue-600  ">
                Enquiries
              </span>
              <span className="text-4xl font-black text-blue-900">
                {enquiries.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/30 border-purple-100">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-purple-600  ">
                Appointments
              </span>
              <span className="text-4xl font-black text-purple-900">
                {appointments.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/30 border-emerald-100">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-emerald-600  ">
                Quotations
              </span>
              <span className="text-4xl font-black text-emerald-900">
                {quotations.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/30 border-amber-100">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-amber-600  ">Visits</span>
              <span className="text-4xl font-black text-amber-900">
                {visits.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 max-w-4xl">
        <h3 className="text-lg font-black text-primary flex items-center gap-2">
          <Clock size={20} className="text-primary/60" />
          Recent Feed
        </h3>

        <div className="relative space-y-0">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

          {activities.map((activity, index) => (
            <div
              key={`${activity.type}-${activity.id}-${index}`}
              className="relative pl-12 pb-8 group"
            >
              <div
                className={cn(
                  "absolute left-3 top-1 size-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110",
                  activity.type === "ENQUIRY" && "bg-blue-500",
                  activity.type === "APPOINTMENT" && "bg-purple-500",
                  activity.type === "QUOTATION" && "bg-emerald-500",
                  activity.type === "VISIT" && "bg-amber-500",
                )}
              >
                {activity.type === "ENQUIRY" && (
                  <MessageSquare size={10} className="text-white" />
                )}
                {activity.type === "APPOINTMENT" && (
                  <Calendar size={10} className="text-white" />
                )}
                {activity.type === "QUOTATION" && (
                  <FileText size={10} className="text-white" />
                )}
                {activity.type === "VISIT" && (
                  <MapPin size={10} className="text-white" />
                )}
              </div>

              <Card className="hover:shadow-md transition-all duration-300 border-primary/5 hover:border-primary/10">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black   text-muted-foreground">
                          {activity.type}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDistanceToNow(activity.date, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-primary leading-tight">
                        {activity.title}
                      </h4>
                      <p className="text-sm font-medium text-primary/60">
                        {activity.userName}{" "}
                        <span className="text-primary/30 mx-1">—</span>{" "}
                        {activity.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge
                        className={cn(
                          "font-black text-[9px]   px-2.5 py-0.5 border-none",
                          activity.type === "ENQUIRY" &&
                            "bg-blue-100 text-blue-700",
                          activity.type === "APPOINTMENT" &&
                            "bg-purple-100 text-purple-700",
                          activity.type === "QUOTATION" &&
                            "bg-emerald-100 text-emerald-700",
                          activity.type === "VISIT" &&
                            "bg-amber-100 text-amber-700",
                        )}
                      >
                        {activity.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-lg bg-slate-50 hover:bg-primary hover:text-white transition-colors group/link"
                        onClick={() => {
                          if (
                            activity.type === "ENQUIRY" ||
                            activity.type === "QUOTATION"
                          ) {
                            setSelectedActivity(
                              activity.type === "ENQUIRY"
                                ? activity.raw
                                : activity.raw.enquiry,
                            );
                            setSelectedType("ENQUIRY");
                          } else {
                            setSelectedActivity(
                              activity.type === "APPOINTMENT"
                                ? activity.raw
                                : activity.raw.appointment,
                            );
                            setSelectedType("APPOINTMENT");
                          }
                          setIsModalOpen(true);
                        }}
                      >
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover/link:translate-x-0.5"
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground font-bold italic">
                No activities recorded yet.
              </p>
            </div>
          )}
        </div>
      </div>

      <ActivityDetailModal
        type={selectedType}
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
        quotations={
          selectedType === "ENQUIRY" && selectedActivity
            ? quotations.filter((q) => q.enquiryId === selectedActivity.id)
            : []
        }
        visit={
          selectedType === "APPOINTMENT" && selectedActivity
            ? visits.find((v) => v.appointmentId === selectedActivity.id)
            : null
        }
      />
    </Container>
  );
}
