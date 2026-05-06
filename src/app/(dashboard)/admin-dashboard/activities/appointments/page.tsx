"use client";

import {
  useAppointmentsQuery,
  useVisitsQuery,
} from "@/queries/activityQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, Eye, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/containers";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ActivityDetailModal } from "@/components/dashboard/admin/activities/activity-detail-modal";

export default function AdminAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: appointments = [], isLoading: loadingAppointments } =
    useAppointmentsQuery();
  const { data: allVisits = [], isLoading: loadingVisits } = useVisitsQuery();

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const q = searchQuery.toLowerCase();
      return (
        app.id.toLowerCase().includes(q) ||
        app.createdBy?.name?.toLowerCase().includes(q) ||
        app.appointmentLineItems.some((li) =>
          li.item?.name?.toLowerCase().includes(q),
        )
      );
    });
  }, [appointments, searchQuery]);

  if (loadingAppointments || loadingVisits) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-primary">
          Platform Appointments
        </h1>
        <p className="text-muted-foreground font-medium">
          Monitor all service bookings and provider responses across the
          platform.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-primary/10 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
          <Input
            placeholder="Search by ID, Buyer, or Service..."
            className="pl-10 bg-slate-50/50 border-primary/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>
      </div>

      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold">Appointment ID</TableHead>
              <TableHead className="font-bold">Buyer</TableHead>
              <TableHead className="font-bold">Service</TableHead>
              <TableHead className="font-bold">Visit Status</TableHead>
              <TableHead className="font-bold">Date Created</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => {
                const visit = allVisits.find((v) => v.appointmentId === app.id);
                return (
                  <TableRow
                    key={app.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-primary/70">
                      #{app.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {app.createdBy?.name || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-muted-foreground  ">
                          {app.createdBy?.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {app.appointmentLineItems[0]?.item?.name || "Service"}
                        </span>
                        {app.appointmentLineItems.length > 1 && (
                          <span className="text-[10px] text-primary/40 font-bold ">
                            + {app.appointmentLineItems.length - 1} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {visit ? (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-black text-[9px]   px-2 py-0.5",
                              visit.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-blue-50 text-blue-600 border-blue-200",
                            )}
                          >
                            {visit.status}
                          </Badge>
                          {visit.visitSlot && (
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <Calendar size={10} />
                              {format(
                                new Date(visit.visitSlot.fromDateTime),
                                "MMM dd",
                              )}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold  italic">
                          No visit scheduled
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(app.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-black text-[9px]   px-2 py-0.5",
                          app.status === "PENDING" &&
                            "bg-amber-100 text-amber-700 hover:bg-amber-100",
                          app.status === "APPROVED" &&
                            "bg-sky-100 text-sky-700 hover:bg-sky-100",
                          app.status === "COMPLETED" &&
                            "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                          (app.status === "CANCELLED" ||
                            app.status === "REJECTED") &&
                            "bg-gray-100 text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-black text-[10px]   h-8 px-4 rounded-lg hover:bg-primary hover:text-white transition-all"
                        onClick={() => {
                          setSelectedAppointment(app);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye size={16} className="text-primary/60" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <ActivityDetailModal
        type="APPOINTMENT"
        activity={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        visit={
          selectedAppointment
            ? allVisits.find((v) => v.appointmentId === selectedAppointment.id)
            : null
        }
      />
    </Container>
  );
}
