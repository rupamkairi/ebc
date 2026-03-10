"use client";

import { EventList } from "@/components/dashboard/seller/events/event-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEntitiesQuery } from "@/queries/entityQueries";
import { toast } from "sonner";

export default function EventsPage() {
  const router = useRouter();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const isApproved = mainEntity?.verificationStatus === "APPROVED";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your webinars, seminars, and recorded sessions in the Conference Hall.
          </p>
        </div>
        <Button
          disabled={!isApproved}
          onClick={() => {
            if (!isApproved) {
              toast.error(
                `Your business must be APPROVED to create events. Current status: ${mainEntity?.verificationStatus || "NOT FOUND"}`
              );
              return;
            }
            router.push("/seller-dashboard/conference-hall/events/create");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <EventList />
    </div>
  );
}
