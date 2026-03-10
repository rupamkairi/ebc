"use client";

import { EventForm } from "@/components/dashboard/seller/events/event-form";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateEventPage() {
  const { data: entities, isLoading } = useEntitiesQuery();
  const entity = entities?.[0];

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-bold">No Business Entity Found</h1>
        <p className="text-muted-foreground">Please set up your business profile first.</p>
      </div>
    );
  }

  if (entity.verificationStatus !== "APPROVED") {
    return (
      <div className="container mx-auto py-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Business Not Approved</h1>
        <p className="text-muted-foreground">
          Your business must be APPROVED to host events. Current status: {entity.verificationStatus}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => window.history.back()}>Go Back</Button>
          <Button variant="outline" asChild>
            <Link href="/seller-dashboard/settings">Check Status</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground">
          Host a live session or share recorded information with the EBC community.
        </p>
      </div>

      <EventForm entityId={entity.id} />
    </div>
  );
}
