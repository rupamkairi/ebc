"use client";

import { use, useEffect } from "react";
import Container from "@/components/ui/containers";
import { AdminEditEntityForm } from "@/components/admin/entities/admin-edit-entity-form";
import { useEntityQuery } from "@/queries/entityQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditEntityPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: entity, isLoading, error } = useEntityQuery(id);

  if (isLoading) {
    return (
      <Container className="py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-10 max-w-4xl" />
          <Skeleton className="h-10 max-w-4xl" />
          <Skeleton className="h-10 max-w-4xl" />
        </div>
      </Container>
    );
  }

  if (error || !entity) {
    return (
      <Container className="py-8 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Business Not Found</h2>
          <p className="text-muted-foreground">The business entity you are trying to edit does not exist or an error occurred.</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Business Details</h1>
          <p className="text-muted-foreground">Update profile and contact information for {entity.name}.</p>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <AdminEditEntityForm entity={entity} />
      </div>
    </Container>
  );
}
