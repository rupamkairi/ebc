"use client";

import { useContentsQuery } from "@/queries/conferenceHallQueries";
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
import { FileText, Download, Search, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

export function ContentDiscovery() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: contents, isLoading } = useContentsQuery({
    isPublic: true,
    isActive: true,
    search: debouncedSearch,
  });

  const handleOpenAsset = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search whitepapers, documents, and resources..."
          className="pl-10 h-12 bg-white rounded-xl shadow-xs border-muted/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
        </div>
      ) : !contents || contents.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed rounded-3xl bg-muted/10">
          <div className="rounded-full bg-white p-4 mb-4 shadow-sm">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>No content found</CardTitle>
          <CardDescription>
            We couldn&apos;t find any resources matching your search.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <Card
              key={content.id}
              className="group flex flex-col h-full overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none bg-white rounded-3xl shadow-sm ring-1 ring-black/5"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <Badge
                    variant="secondary"
                    className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                  >
                    Resource
                  </Badge>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {format(new Date(content.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {content.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {content.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {content.attachments?.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-muted/50 text-sm"
                    >
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        {attachment.media ? (
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {attachment.media?.name ||
                            attachment.document?.name ||
                            "Attachment"}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {attachment.media ? "Media" : "Document"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm"
                        onClick={() =>
                          handleOpenAsset(
                            attachment.media?.url || attachment.document?.url,
                          )
                        }
                      >
                        <Download className="h-4 w-4 mb-[2px]" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
