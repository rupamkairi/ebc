"use client";

import {
  useOffersQuery,
  useDeleteOfferMutation,
} from "@/queries/conferenceHallQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Globe, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { OfferPublishDialog } from "./offer-publish-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Offer } from "@/types/conference-hall";

export function OfferList() {
  const router = useRouter();
  const { data: offers, isLoading } = useOffersQuery();
  const deleteMutation = useDeleteOfferMutation();

  const [publishOfferId, setPublishOfferId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleDelete = (id: string) => {
    // Basic confirmation before delete
    if (confirm("Are you sure you want to delete this offer?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Offer deleted successfully"),
        onError: (err: Error) => toast.error(err.message || "Failed to delete"),
      });
    }
  };

  const getStatusBadge = (offer: Offer) => {
    const detail = offer.offerDetails?.[0];
    const isPublished = !!detail?.publishedAt;

    if (!offer.isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (isPublished)
      return <Badge className="bg-green-500 text-white">Published</Badge>;
    return <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Valid To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No offers found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              offers?.map((offer) => {
                const detail = offer.offerDetails?.[0];
                const isPublished = !!detail?.publishedAt;

                return (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span>{offer.name}</span>
                        {offer.targetRegions && offer.targetRegions.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
                            <Globe className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {offer.targetRegions
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
                        <span className="text-xs text-muted-foreground truncate max-w-[200px] font-normal italic">
                          {offer.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(offer)}</TableCell>
                    <TableCell>
                      {detail?.startDate
                        ? format(new Date(detail.startDate), "PP")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {detail?.endDate
                        ? format(new Date(detail.endDate), "PP")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!isPublished && offer.isActive && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Publish"
                            onClick={() => setPublishOfferId(offer.id)}
                          >
                            <Globe className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          onClick={() =>
                            router.push(
                              `/seller-dashboard/conference-hall/offers/create?offerId=${offer.id}`,
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          className="text-destructive"
                          onClick={() => handleDelete(offer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <OfferPublishDialog
        open={!!publishOfferId}
        onOpenChange={(open) => !open && setPublishOfferId(null)}
        offerId={publishOfferId}
      />
    </>
  );
}
