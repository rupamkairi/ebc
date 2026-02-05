"use client";

import { ContentForm } from "@/components/dashboard/seller/content/content-form";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useContentQuery } from "@/queries/conferenceHallQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: entities, isLoading: isEntityLoading } = useEntitiesQuery();
  const entity = entities?.[0];

  const { data: content, isLoading: isContentLoading } = useContentQuery(id);

  if (isEntityLoading || isContentLoading) {
    return <Skeleton className="h-[600px] w-full rounded-xl" />;
  }

  if (!entity || !content) {
    return <div>Content or Entity not found.</div>;
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Content</h1>
          <p className="text-muted-foreground">
            Update content details and attachments.
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <ContentForm entityId={entity.id} initialData={content} />
      </div>
    </div>
  );
}
