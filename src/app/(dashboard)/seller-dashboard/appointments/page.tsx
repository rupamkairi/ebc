"use client";

import { AppointmentCard } from "@/components/dashboard/seller/appointments/appointment-card";

const appointments = [
  {
    id: "APT-001",
    customer: "Amit Sharma",
    type: "Site Survey",
    date: "Tomorrow, 11:00 AM",
    location: "Scheme 54, Indore",
    status: "Pending",
    urgency: "High",
  },
  {
    id: "APT-002",
    customer: "Priya Verma",
    type: "Material Consultation",
    date: "26 Dec 2025, 02:30 PM",
    location: "Vijay Nagar, Indore",
    status: "Confirmed",
    urgency: "Normal",
  },
  {
    id: "APT-003",
    customer: "Rahul Gupta",
    type: "Final Measurement",
    date: "24 Dec 2025, 10:00 AM",
    location: "Aranya Nagar, Indore",
    status: "Completed",
    urgency: "Normal",
  },
];

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">
            Site Appointments
          </h1>
          <p className="text-foreground/60 font-bold italic mt-1">
            Manage onsite visits and technical consultations.
          </p>
        </div>
      </div>

      {/* Appointment List */}
      <div className="grid gap-6">
        {appointments.map((apt) => (
          <AppointmentCard key={apt.id} {...apt} />
        ))}
      </div>
    </div>
  );
}
