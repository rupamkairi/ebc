"use client";

import { useState } from "react";
import { AlertTriangle, Download, ExternalLink, FileText, ImageIcon, Play, VideoOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ReviewAttachment } from "@/types/review";
import { useLanguage } from "@/hooks/useLanguage";

const formatSize = (size: number) => size >= 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;
const isOfficeDocument = (attachment: ReviewAttachment) => /\.(doc|docx)$/i.test(attachment.originalName || "") || attachment.mimeType === "application/msword" || attachment.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

interface ReviewAttachmentGalleryProps {
  attachments: ReviewAttachment[];
}

export function ReviewAttachmentGallery({ attachments }: ReviewAttachmentGalleryProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<ReviewAttachment | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  const open = (attachment: ReviewAttachment) => {
    setPreviewFailed(false);
    setSelected(attachment);
  };

  return <>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Review attachments">
      {attachments.map((attachment) => <button key={attachment.id} type="button" onClick={() => open(attachment)} className="group relative flex h-20 w-24 items-center justify-center overflow-hidden rounded-xl border bg-muted text-left transition-opacity hover:opacity-80">
        {attachment.category === "image" ? <><ImageIcon className="size-7 text-muted-foreground" /><img src={attachment.url} alt={attachment.originalName || "Review image"} className="absolute h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /></> : attachment.category === "video" ? <><video src={attachment.url} muted preload="metadata" className="h-full w-full object-cover" /><span className="absolute rounded-full bg-black/60 p-2 text-white"><Play className="size-4 fill-current" /></span></> : <div className="flex flex-col items-center gap-1 px-2 text-center"><FileText className="size-6 text-muted-foreground" /><span className="line-clamp-2 text-[9px] font-semibold">{attachment.originalName || "Document"}</span></div>}
        <span className="sr-only">Open {attachment.originalName || attachment.category}</span>
      </button>)}
    </div>

    <Dialog open={!!selected} onOpenChange={(isOpen) => { if (!isOpen) setSelected(null); }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        {selected && <>
          <DialogHeader>
            <DialogTitle className="break-all pr-8">{selected.originalName || `Review ${selected.category}`}</DialogTitle>
            <DialogDescription>{selected.mimeType || selected.category} · {formatSize(selected.size)}</DialogDescription>
          </DialogHeader>

          <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
            {selected.category === "image" && !previewFailed && <img src={selected.url} alt={selected.originalName || "Review attachment"} className="max-h-[65vh] max-w-full object-contain" onError={() => setPreviewFailed(true)} />}
            {selected.category === "video" && !previewFailed && <video key={selected.id} src={selected.url} controls autoPlay className="max-h-[65vh] w-full" onError={() => setPreviewFailed(true)}>Your browser cannot play this video.</video>}
            {selected.category === "document" && selected.mimeType === "application/pdf" && !previewFailed && <iframe src={selected.url} title={selected.originalName || "PDF preview"} className="h-[65vh] w-full" onError={() => setPreviewFailed(true)} />}
            {(previewFailed || (selected.category === "document" && selected.mimeType !== "application/pdf")) && <div className="flex flex-col items-center gap-3 p-8 text-center text-muted-foreground">{selected.category === "video" ? <VideoOff className="size-12" /> : selected.category === "image" ? <ImageIcon className="size-12" /> : <FileText className="size-12" />}<div><p className="font-semibold text-foreground">{t("review_preview_unavailable")}</p><p className="text-sm">{t("review_preview_fallback")}</p></div></div>}
          </div>

          {isOfficeDocument(selected) && <p className="flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{t("review_attachment_warning")}</p>}

          <div className="flex justify-end gap-2">
            <Button asChild variant="outline"><a href={selected.url} target="_blank" rel="noreferrer"><ExternalLink className="size-4" />{t("review_open")}</a></Button>
            <Button asChild><a href={selected.url} download={selected.originalName || undefined}><Download className="size-4" />{selected.category === "video" ? t("review_download_video") : t("review_download")}</a></Button>
          </div>
        </>}
      </DialogContent>
    </Dialog>
  </>;
}
