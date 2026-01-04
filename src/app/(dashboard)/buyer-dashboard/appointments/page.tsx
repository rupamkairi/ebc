"use client";

import Container from "@/components/containers/containers";
import { useAppointmentsQuery } from "@/queries/activityQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

// Removed hardcoded appointments
// const appointments = [...];

const filters = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: appointments, isLoading } = useAppointmentsQuery({
    search: search,
  });

  const filteredAppointments = (appointments || []).filter((a) => {
    if (activeFilter === "All") return true;
    return a.status === activeFilter;
  });

  return (
    <Container>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              View and manage your scheduled appointments.
            </p>
          </div>
          <Button>Schedule Appointment</Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 text-sm"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="w-full sm:w-[250px] pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            filteredAppointments.map((apt) => (
              <Card key={apt.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {apt.lineItems?.[0]?.item?.name || "Appointment"}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {/* Use slot date or creation date if slot info is missing structure */}
                          {apt.createdAt
                            ? format(new Date(apt.createdAt), "PPP p")
                            : "Date N/A"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        apt.status === "Upcoming"
                          ? "default"
                          : apt.status === "Cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="space-y-1">
                      {/* Location might be inside details.address or lineItems? */}
                      {/* For now, show remarks as location/details */}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{apt.details?.remarks || "No details"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created By:{" "}
                        <span className="font-medium text-foreground">
                          {/* We might not have name, just ID. Skip host for now or use placeholders */}
                          User
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="default" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
