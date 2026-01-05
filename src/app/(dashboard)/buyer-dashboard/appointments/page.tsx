"use client";

import Container from "@/components/containers/containers";
import { useAppointmentsQuery } from "@/queries/activityQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { AppointmentCard } from "@/components/dashboard/buyer/appointment-card";

const filters = ["All", "Upcoming", "Completed", "Cancelled"];

export default function AppointmentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: appointments, isLoading } = useAppointmentsQuery({
    search: search,
  });

  const filteredAppointments = (appointments || []).filter((a) => {
    if (activeFilter === "All") return true;
    return (a.status || "").toUpperCase() === activeFilter.toUpperCase();
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
          <Link href="/appointment/create">
            <Button>Create New Appointment</Button>
          </Link>
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
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground animate-pulse">
                Loading appointments...
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          )}
          {!isLoading && filteredAppointments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 border border-dashed rounded-lg">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
