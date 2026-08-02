"use client";

import { format } from "date-fns";
import { Calendar, Building2, Globe, MapPin, Video } from "lucide-react";
import {
  ConferenceHallEvent,
  Content,
  Offer,
} from "@/types/conference-hall";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConferenceHallAttachmentItem } from "./conference-hall-attachments";
import { formatConferenceHallRegion } from "@/lib/conference-hall-region-label";

type DetailDialogProps<T> = {
  item: T | null;
  onOpenChange: (open: boolean) => void;
};

function Attachments({
  attachments,
}: {
  attachments?: Array<{
    id: string;
    media?: Parameters<typeof ConferenceHallAttachmentItem>[0]["asset"] | null;
    document?: Parameters<typeof ConferenceHallAttachmentItem>[0]["asset"] | null;
  }>;
}) {
  if (!attachments?.length) return null;
  return (
    <section className="space-y-3">
      <h3 className="font-semibold">Attachments</h3>
      {attachments.map((attachment) => (
        <ConferenceHallAttachmentItem
          key={attachment.id}
          asset={attachment.media || attachment.document || undefined}
        />
      ))}
    </section>
  );
}

function Regions({ regions }: { regions?: ConferenceHallEvent["targetRegions"] }) {
  if (!regions?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {regions.map((region, index) => (
        <Badge key={`${formatConferenceHallRegion(region)}-${index}`} variant="secondary">
          <Globe className="mr-1 size-3" />
          {formatConferenceHallRegion(region)}
        </Badge>
      ))}
    </div>
  );
}

export function EventDetailDialog({
  item,
  onOpenChange,
}: DetailDialogProps<ConferenceHallEvent>) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {item && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge>{item.type}</Badge>
                {item.verificationStatus && <Badge variant="outline">{item.verificationStatus}</Badge>}
              </div>
              <DialogTitle className="text-2xl">{item.name}</DialogTitle>
              <DialogDescription>{item.entity?.name || "EBC Event"}</DialogDescription>
            </DialogHeader>
            <p className="whitespace-pre-wrap text-sm leading-7">{item.description || "No description provided."}</p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              {item.startDate && <span className="flex items-center gap-2"><Calendar className="size-4" />{format(new Date(item.startDate), "PPP p")}</span>}
              {item.isPhysical && <span className="flex items-center gap-2"><MapPin className="size-4" />{item.location || "Venue TBD"}</span>}
              {item.isRemote && <span className="flex items-center gap-2"><Video className="size-4" />Remote event</span>}
            </div>
            <Regions regions={item.targetRegions} />
            <Attachments attachments={item.attachments} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ContentDetailDialog({ item, onOpenChange }: DetailDialogProps<Content>) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {item && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">{item.name}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1"><Building2 className="size-4" />{item.entity?.name || "EBC Publisher"}</span>
                {item.publishedAt && <span className="flex items-center gap-1"><Calendar className="size-4" />{format(new Date(item.publishedAt), "PP")}</span>}
              </DialogDescription>
            </DialogHeader>
            <p className="whitespace-pre-wrap text-sm leading-7">{item.description}</p>
            <Regions regions={item.targetRegions} />
            <Attachments attachments={item.attachments} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function OfferDetailDialog({ item, onOpenChange }: DetailDialogProps<Offer>) {
  const detail = item?.offerDetails?.[0];
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {item && (
          <div className="space-y-6">
            <DialogHeader>
              <Badge className="mb-2 w-fit">Promotion</Badge>
              <DialogTitle className="text-2xl">{item.name}</DialogTitle>
              <DialogDescription>{item.entity?.name || "EBC Seller"}</DialogDescription>
            </DialogHeader>
            <p className="whitespace-pre-wrap text-sm leading-7">{item.description}</p>
            {detail?.startDate && (
              <p className="flex items-center gap-2 text-sm"><Calendar className="size-4" />Valid {format(new Date(detail.startDate), "PP")} – {detail.endDate ? format(new Date(detail.endDate), "PP") : "Ongoing"}</p>
            )}
            <Regions regions={item.targetRegions} />
            <Attachments attachments={detail?.attachments} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
