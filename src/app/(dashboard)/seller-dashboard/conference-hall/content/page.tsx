"use client";

import { ContentList } from "@/components/dashboard/seller/content/content-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContentPage() {
  const router = useRouter();

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
          onClick={() =>
            router.push("/seller-dashboard/conference-hall/content/create")
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      <ContentList />
    </div>
  );
}
