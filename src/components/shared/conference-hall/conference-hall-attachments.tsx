"use client";

import { useState } from "react";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { Button } from "@/components/ui/button";
import {
  ConferenceHallAsset,
  ConferenceHallAttachment,
} from "@/types/conference-hall";
import { ExternalLink, FileText, ImageIcon, Video, X } from "lucide-react";

export type ConferenceHallAttachmentReference = {
  mediaId?: string;
  documentId?: string;
};

export function attachmentReferencesFrom(
  attachments?: ConferenceHallAttachment[],
): ConferenceHallAttachmentReference[] {
  return (attachments || []).reduce<ConferenceHallAttachmentReference[]>(
    (references, attachment) => {
      if (attachment.mediaId) references.push({ mediaId: attachment.mediaId });
      else if (attachment.documentId)
        references.push({ documentId: attachment.documentId });
      return references;
    },
    [],
  );
}

type DisplayAsset = ConferenceHallAsset & { referenceKey: string };

interface ConferenceHallAttachmentEditorProps {
  attachments?: ConferenceHallAttachment[];
  references: ConferenceHallAttachmentReference[];
  onChange: (references: ConferenceHallAttachmentReference[]) => void;
  entityId: string;
  disabled?: boolean;
  mediaLabel?: string;
  documentLabel?: string;
}

export function ConferenceHallAttachmentEditor({
  attachments,
  references,
  onChange,
  entityId,
  disabled = false,
  mediaLabel = "Media / Video",
  documentLabel = "Document / File",
}: ConferenceHallAttachmentEditorProps) {
  const [uploadedAssets, setUploadedAssets] = useState<DisplayAsset[]>([]);
  const existingAssets: DisplayAsset[] = (attachments || []).flatMap(
    (attachment) => {
      const asset = attachment.media || attachment.document;
      const referenceKey = attachment.mediaId
        ? `media:${attachment.mediaId}`
        : attachment.documentId
          ? `document:${attachment.documentId}`
          : "";
      return asset && referenceKey ? [{ ...asset, referenceKey }] : [];
    },
  );
  const assets = new Map(
    [...existingAssets, ...uploadedAssets].map((asset) => [
      asset.referenceKey,
      asset,
    ]),
  );

  const addUploaded = (
    type: "media" | "document",
    files: FileUploadResponse[],
  ) => {
    const newReferences = files.map((file) =>
      type === "media" ? { mediaId: file.id } : { documentId: file.id },
    );
    setUploadedAssets((current) => [
      ...current,
      ...files.map((file) => ({
        id: file.id,
        name: file.name,
        originalName: file.name,
        url: file.url,
        mimeType: file.mimeType,
        sizeBytes: String(file.size),
        referenceKey: `${type}:${file.id}`,
      })),
    ]);
    onChange([...references, ...newReferences]);
  };

  return (
    <div className="space-y-4">
      {!disabled && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">{mediaLabel}</p>
            <FileUploader
              type="media"
              variant="multiple"
              entityId={entityId}
              onUploadSuccess={(files) => addUploaded("media", files)}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{documentLabel}</p>
            <FileUploader
              type="document"
              variant="multiple"
              entityId={entityId}
              onUploadSuccess={(files) => addUploaded("document", files)}
            />
          </div>
        </div>
      )}

      {references.length ? (
        <div className="space-y-3">
          {references.map((reference) => {
            const referenceKey = reference.mediaId
              ? `media:${reference.mediaId}`
              : `document:${reference.documentId}`;
            const asset = assets.get(referenceKey);
            return (
              <ConferenceHallAttachmentItem
                key={referenceKey}
                asset={asset}
                removable={!disabled}
                onRemove={() =>
                  onChange(
                    references.filter((item) => {
                      const key = item.mediaId
                        ? `media:${item.mediaId}`
                        : `document:${item.documentId}`;
                      return key !== referenceKey;
                    }),
                  )
                }
              />
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
          No attachments added.
        </p>
      )}
    </div>
  );
}

export function ConferenceHallAttachmentItem({
  asset,
  removable = false,
  onRemove,
}: {
  asset?: ConferenceHallAsset;
  removable?: boolean;
  onRemove?: () => void;
}) {
  const isImage =
    asset?.kind === "IMAGE" || asset?.mimeType?.startsWith("image/");
  const isVideo =
    asset?.kind === "VIDEO" || asset?.mimeType?.startsWith("video/");
  const Icon = isImage ? ImageIcon : isVideo ? Video : FileText;

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {asset?.name || "Unavailable attachment"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {asset?.mimeType || "File information unavailable"}
          </p>
        </div>
        {asset?.url && (
          <Button asChild type="button" variant="outline" size="sm">
            <a href={asset.url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 size-3.5" /> Open
            </a>
          </Button>
        )}
        {removable && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${asset?.name || "attachment"}`}
            onClick={onRemove}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
