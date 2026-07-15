"use client";

import { useRef, useState } from "react";
import { FileText, ImageIcon, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { SupportAttachmentRef, SupportFile } from "@/types/support";
import { toast } from "sonner";

export interface PendingSupportAttachment extends SupportAttachmentRef {
  file: SupportFile;
  type: "image" | "document";
}

export function SupportAttachmentPicker({
  value,
  onChange,
  disabled,
}: {
  value: PendingSupportAttachment[];
  onChange: (value: PendingSupportAttachment[]) => void;
  disabled?: boolean;
}) {
  const imageInput = useRef<HTMLInputElement>(null);
  const documentInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const imageCount = value.filter((item) => item.type === "image").length;
  const hasDocument = value.some((item) => item.type === "document");

  const upload = async (files: File[], type: "image" | "document") => {
    if (!files.length) return;
    setUploading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";
      const formData = new FormData();
      files.forEach((file) => formData.append(type === "image" ? "files" : "file", file));
      const token = useAuthStore.getState().token;
      const response = await fetch(`${apiBase}/support/uploads/${type === "image" ? "images" : "document"}`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Upload failed");
      const uploaded: PendingSupportAttachment[] = type === "image"
        ? body.media.map((file: SupportFile) => ({ mediaId: file.id, file, type }))
        : [{ documentId: body.document.id, file: body.document, type }];
      onChange([...value, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={disabled || uploading || imageCount >= 3} onClick={() => imageInput.current?.click()} title="Attach up to 3 images">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={disabled || uploading || hasDocument} onClick={() => documentInput.current?.click()} title="Attach one document">
          <Paperclip className="h-4 w-4" />
        </Button>
        <span className="text-[10px] text-muted-foreground">{imageCount}/3 images · {hasDocument ? 1 : 0}/1 document</span>
        <input ref={imageInput} type="file" accept="image/*" multiple className="hidden" onChange={(event) => {
          const files = Array.from(event.target.files || []).slice(0, 3 - imageCount);
          void upload(files, "image");
          event.target.value = "";
        }} />
        <input ref={documentInput} type="file" accept=".pdf,.doc,.docx,.txt,.md" className="hidden" onChange={(event) => {
          void upload(Array.from(event.target.files || []).slice(0, 1), "document");
          event.target.value = "";
        }} />
      </div>
      {value.length > 0 && <div className="flex flex-wrap gap-2">
        {value.map((item) => <div key={item.file.id} className="flex max-w-[180px] items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs">
          {item.type === "image" ? <ImageIcon className="h-3 w-3 shrink-0" /> : <FileText className="h-3 w-3 shrink-0" />}
          <span className="truncate">{item.file.key?.split("/").pop() || item.file.id}</span>
          <button type="button" disabled={disabled} onClick={() => onChange(value.filter((candidate) => candidate.file.id !== item.file.id))}><X className="h-3 w-3" /></button>
        </div>)}
      </div>}
    </div>
  );
}
