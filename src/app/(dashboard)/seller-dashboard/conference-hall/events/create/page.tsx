"use client";

import { EventForm } from "@/components/dashboard/seller/events/event-form";
import { useEntitiesQuery } from "@/queries/entityQueries";
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
