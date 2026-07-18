"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FileText, ImageIcon, Loader2, RefreshCw, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export type ReviewUploadCategory = "image" | "video" | "document";

export interface UploadedReviewFile {
  id: string;
  category: ReviewUploadCategory;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface PendingFile {
  localId: string;
  file: File;
  category: ReviewUploadCategory;
  previewUrl: string;
  status: "uploading" | "success" | "error";
  uploaded?: UploadedReviewFile;
  error?: string;
}

interface CategoryConfig {
  label: string;
  hint: string;
  accept: string;
  maxCount: number;
  maxSize: number;
}

const CONFIG: Record<ReviewUploadCategory, CategoryConfig> = {
  image: { label: "Images", hint: "JPG, PNG, WebP, GIF, HEIC/HEIF · 5 MB each · up to 5", accept: ".jpg,.jpeg,.png,.webp,.gif,.heic,.heif", maxCount: 5, maxSize: 5 * 1024 * 1024 },
  video: { label: "Video", hint: "MP4, MOV, MKV, WebM, AVI · 30 MB · up to 1", accept: ".mp4,.mov,.mkv,.webm,.avi", maxCount: 1, maxSize: 30 * 1024 * 1024 },
  document: { label: "Document", hint: "PDF, DOC, DOCX · 2 MB · up to 1", accept: ".pdf,.doc,.docx", maxCount: 1, maxSize: 2 * 1024 * 1024 },
};

interface ReviewAttachmentPickerProps {
  onChange: (files: UploadedReviewFile[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ReviewAttachmentPicker({ onChange, onUploadingChange }: ReviewAttachmentPickerProps) {
  const { t } = useLanguage();
  const [items, setItems] = useState<PendingFile[]>([]);
  const inputs = useRef<Record<ReviewUploadCategory, HTMLInputElement | null>>({ image: null, video: null, document: null });

  useEffect(() => {
    onUploadingChange?.(items.some((item) => item.status === "uploading"));
  }, [items, onUploadingChange]);

  const emit = (next: PendingFile[]) => onChange(next.flatMap((item) => item.uploaded ? [item.uploaded] : []));
  const replaceItem = (localId: string, update: (item: PendingFile) => PendingFile) => {
    setItems((current) => {
      const next = current.map((item) => item.localId === localId ? update(item) : item);
      emit(next);
      return next;
    });
  };

  const upload = (item: PendingFile) => {
    replaceItem(item.localId, (current) => ({ ...current, status: "uploading", error: undefined }));
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiBaseUrl}/attachment/review/${item.category}/upload`);
    const token = useAuthStore.getState().token;
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText) as { attachment: UploadedReviewFile };
        replaceItem(item.localId, (current) => ({ ...current, status: "success", uploaded: response.attachment }));
        return;
      }
      let message = "Upload failed";
      try { message = (JSON.parse(xhr.responseText) as { message?: string }).message || message; } catch {}
      replaceItem(item.localId, (current) => ({ ...current, status: "error", error: message }));
    };
    xhr.onerror = () => replaceItem(item.localId, (current) => ({ ...current, status: "error", error: "Network error. Try again." }));
    const formData = new FormData();
    formData.append("file", item.file);
    xhr.send(formData);
  };

  const chooseFiles = (category: ReviewUploadCategory, selected: FileList | null) => {
    if (!selected) return;
    const config = CONFIG[category];
    const used = items.filter((item) => item.category === category).length;
    const files = Array.from(selected).slice(0, Math.max(0, config.maxCount - used));
    const nextItems = files.map((file) => ({ localId: crypto.randomUUID(), file, category, previewUrl: URL.createObjectURL(file), status: file.size <= config.maxSize ? "uploading" as const : "error" as const, error: file.size > config.maxSize ? `${config.label} must be ${Math.round(config.maxSize / 1024 / 1024)} MB or smaller.` : undefined }));
    setItems((current) => [...current, ...nextItems]);
    nextItems.filter((item) => item.status === "uploading").forEach(upload);
    if (inputs.current[category]) inputs.current[category]!.value = "";
  };

  const remove = (localId: string) => {
    setItems((current) => {
      const removed = current.find((item) => item.localId === localId);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      const next = current.filter((item) => item.localId !== localId);
      emit(next);
      return next;
    });
  };

  const count = (category: ReviewUploadCategory) => items.filter((item) => item.category === category).length;

  return <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(CONFIG) as ReviewUploadCategory[]).map((category) => {
        const config = CONFIG[category];
        const Icon = category === "image" ? ImageIcon : category === "video" ? Video : FileText;
        const remaining = config.maxCount - count(category);
        return <div key={category}>
          <input ref={(node) => { inputs.current[category] = node; }} type="file" multiple={category === "image"} accept={config.accept} className="hidden" onChange={(event) => chooseFiles(category, event.target.files)} />
          <Button type="button" variant="outline" className="h-auto w-full justify-start gap-3 rounded-2xl p-3 text-left" disabled={remaining === 0} onClick={() => inputs.current[category]?.click()}>
            <Icon className="size-5 shrink-0" />
            <span className="min-w-0"><span className="block text-sm font-bold">{config.label} ({remaining} left)</span><span className="block whitespace-normal text-[10px] font-normal text-muted-foreground">{config.hint}</span></span>
          </Button>
        </div>;
      })}
    </div>
    {items.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => {
        const category = item.category;
        return <div key={item.localId} className={cn("relative overflow-hidden rounded-2xl border bg-muted/40", item.status === "error" && "border-destructive/50")}>
          <div className="flex h-24 items-center justify-center bg-muted">
            {category === "image" ? <img src={item.previewUrl} alt="Selected review attachment" className="h-full w-full object-cover" /> : category === "video" ? <video src={item.previewUrl} muted className="h-full w-full object-cover" /> : <FileText className="size-9 text-muted-foreground" />}
          </div>
          <div className="space-y-1 p-2"><p className="truncate text-xs font-semibold">{item.file.name}</p>{item.error && <p className="text-[10px] leading-tight text-destructive">{item.error}</p>}</div>
          <div className="absolute right-1 top-1 flex gap-1">
            {item.status === "uploading" && <span className="rounded-full bg-background/90 p-1.5"><Loader2 className="size-3 animate-spin" /></span>}
            {item.status === "error" && item.file.size <= CONFIG[category].maxSize && <button type="button" aria-label="Retry upload" className="rounded-full bg-background/90 p-1.5" onClick={() => upload(item)}><RefreshCw className="size-3" /></button>}
            <button type="button" aria-label="Remove attachment" className="rounded-full bg-background/90 p-1.5" onClick={() => remove(item.localId)}><X className="size-3" /></button>
          </div>
        </div>;
      })}
    </div>}
    {items.some((item) => /\.docx?$/i.test(item.file.name)) && <p className="flex gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="size-4 shrink-0" />{t("review_attachment_warning")}</p>}
  </div>;
}
