"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useItemQuery } from "@/queries/catalogQueries";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ForumSection } from "@/components/shared/forum";

export default function ItemDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data: item, isLoading, error } = useItemQuery(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-destructive">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>Failed to load item details.</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!item) {
    return <div className="p-8 text-center">Item not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="pl-0 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-muted-foreground font-mono text-sm">ID: {item.id}</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Raw Details</h2>
        <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-md text-xs sm:text-sm overflow-auto max-h-[600px]">
          {JSON.stringify(item, null, 2)}
        </pre>
      </div>

      <div className="pt-10 border-t">
        <ForumSection itemId={id} />
      </div>
    </div>
  );
}
