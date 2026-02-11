"use client";

import {
  useContentsQuery,
  useDeleteContentMutation,
  usePublishContentMutation,
} from "@/queries/conferenceHallQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  MoreVertical,
  Trash2,
  Globe,
  Lock,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

export function ContentList() {
  const { data: entities } = useEntitiesQuery();
  const entity = entities?.[0];

  const { data: contents, isLoading } = useContentsQuery({
    entityId: entity?.id,
  });

  const deleteContent = useDeleteContentMutation();
  const publishContent = usePublishContentMutation();

  const handlePublish = async (id: string) => {
    try {
      await publishContent.mutateAsync(id);
      toast.success("Content published successfully!");
    } catch {
      toast.error("Failed to publish content");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent.mutateAsync(id);
      toast.success("Content deleted successfully");
    } catch {
      toast.error("Failed to delete content");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>No content found</CardTitle>
        <CardDescription>
          You haven&apos;t uploaded any content yet. Share documents,
          whitepapers, or media.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <Card
          key={content.id}
          className="flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-linear-to-b from-card to-muted/20 relative"
        >
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-md"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDelete(content.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-3">
              {content.isPublic ? (
                <Badge
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Globe className="h-3 w-3 mr-1" /> Public
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" /> Draft
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground ml-auto">
                {format(new Date(content.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <CardTitle className="line-clamp-1 text-lg font-bold group-hover:text-primary transition-colors">
              {content.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 h-10 mt-2 text-xs leading-relaxed">
              {content.description || "No description provided."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="bg-muted p-1.5 rounded-md">
                  <FileText className="h-4 w-4" />
                </div>
                <span>{content.attachments?.length || 0} Attachments</span>
              </div>
              {content.targetRegions && content.targetRegions.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground line-clamp-1">
                  <Globe className="h-3 w-3" />
                  <span>
                    Targets:{" "}
                    {content.targetRegions
                      .map((r) =>
                        r.pincode
                          ? r.pincode.pincode ||
                            r.pincode.district ||
                            r.pincode.state
                          : "Area",
                      )
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-4 px-6 pb-6 bg-muted/5 gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" asChild>
              <Link
                href={`/seller-dashboard/conference-hall/content/${content.id}`}
              >
                Edit
              </Link>
            </Button>
            {!content.isPublic && (
              <Button
                className="flex-1 rounded-xl gap-2"
                onClick={() => handlePublish(content.id)}
                disabled={publishContent.isPending}
              >
                {publishContent.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <UploadCloud className="h-3 w-3" />
                )}
                Publish
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
