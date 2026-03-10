"use client";

import { ContentList } from "@/components/dashboard/seller/content/content-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEntitiesQuery } from "@/queries/entityQueries";
import { toast } from "sonner";

export default function ContentPage() {
  const router = useRouter();
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];
  const isApproved = mainEntity?.verificationStatus === "APPROVED";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
          <p className="text-muted-foreground">
            Upload and manage your documents, whitepapers, and media resources.
          </p>
        </div>
        <Button
          disabled={!isApproved}
          onClick={() => {
            if (!isApproved) {
              toast.error(
                `Your business must be APPROVED to create content. Current status: ${mainEntity?.verificationStatus || "NOT FOUND"}`
              );
              return;
            }
            router.push("/seller-dashboard/conference-hall/content/create");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      <ContentList />
    </div>
  );
}
