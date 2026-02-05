"use client";

import { ContentForm } from "@/components/dashboard/seller/content/content-form";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateContentPage() {
  const router = useRouter();
  const { data: entities, isLoading } = useEntitiesQuery();
  const entity = entities?.[0];

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  if (!entity) {
    return <div>Entity not found. Please create an entity first.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Content</h1>
          <p className="text-muted-foreground">
            Share your knowledge resources with the community.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <ContentForm entityId={entity.id} />
      </div>
    </div>
  );
}
