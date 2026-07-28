"use client";

import { useState } from "react";
import { format } from "date-fns";
import { BookOpen, Building2, Calendar, Download, FileText, MessageSquare } from "lucide-react";
import { useContentsQuery } from "@/queries/conferenceHallQueries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Content } from "@/types/conference-hall";
import { ConferenceHallSearch } from "@/components/dashboard/buyer/conference-hall-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContentDiscoveryProps {
  pincodeId: string;
  onOpenForum: (content: Content) => void;
}

export function ContentDiscovery({ pincodeId, onOpenForum }: ContentDiscoveryProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Content | null>(null);
  const debouncedSearch = useDebouncedValue(search);
  const { data = [], isLoading, isError, refetch } = useContentsQuery({
    discovery: true,
    search: debouncedSearch || undefined,
    targeting: { pincodeId },
  });

  return (
    <div className="space-y-6">
      <ConferenceHallSearch
        value={search}
        onChange={setSearch}
        placeholder="Search contents..."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 p-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Contents could not be loaded.</p>
          <Button variant="outline" onClick={() => refetch()}>Try again</Button>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <BookOpen className="mx-auto mb-3 size-10 opacity-40" />
          <p>{search ? "No contents match your search." : "No contents are available for this location yet."}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((content) => (
            <Card
              key={content.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelected(content)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{content.name}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="size-3.5" />
                  {content.entity?.name || "EBC Publisher"}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{content.description}</p>
                <Button variant="link" className="mt-3 h-auto p-0">View details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selected.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-4 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-4" />
                    {selected.entity?.name || "EBC Publisher"}
                  </span>
                  {selected.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      {format(new Date(selected.publishedAt), "MMM d, yyyy")}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap text-sm leading-7">{selected.description}</p>
              {!!selected.attachments?.length && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Attachments</h3>
                  {selected.attachments.map((attachment) => {
                    const asset = attachment.document || attachment.media;
                    return (
                      <div key={attachment.id} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="flex min-w-0 items-center gap-2 text-sm">
                          <FileText className="size-4 shrink-0" />
                          <span className="truncate">{asset?.name || "Unavailable attachment"}</span>
                        </span>
                        {asset?.url && (
                          <Button asChild size="sm" variant="outline">
                            <a href={asset.url} target="_blank" rel="noreferrer">
                              <Download className="mr-2 size-4" />
                              Open
                            </a>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <DialogFooter>
                <Button
                  onClick={() => {
                    const content = selected;
                    setSelected(null);
                    onOpenForum(content);
                  }}
                >
                  <MessageSquare className="mr-2 size-4" />
                  Go to Forum
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
