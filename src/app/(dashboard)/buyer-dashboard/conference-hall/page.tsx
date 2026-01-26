"use client";

import { EventDiscovery } from "@/components/dashboard/buyer/events/event-discovery";

export default function BuyerConferenceHallPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conference Hall</h1>
        <p className="text-muted-foreground">
          Discover exclusive webinars, training sessions, and resources from experts.
        </p>
      </div>

      <EventDiscovery />
    </div>
  );
}
