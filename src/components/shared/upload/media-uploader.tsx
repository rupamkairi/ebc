"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { ImageCropper } from "./image-cropper";

interface UploadFileItem {
  file: File | Blob;
  name: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  id: string;
}

export interface FileUploadResponse {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
}

interface FileUploaderProps {
  onUploadSuccess?: (files: FileUploadResponse[]) => void;
  maxFiles?: number;
  label?: string;
  variant?: "single" | "multiple";
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  showTrigger?: boolean;
  crop?: boolean;
  type?: "media" | "document";
  entityId?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function FileUploader({
  onUploadSuccess,
  maxFiles: propMaxFiles,
  label,
  variant = "single",
  buttonVariant = "outline",
  showTrigger = true,
  crop = variant === "single",
  type = "media",
  entityId,
  disabled = false,
  children,
}: FileUploaderProps) {
  const isSingle = variant === "single";
  const maxFiles = isSingle ? 1 : propMaxFiles || 10;

  const defaultLabel =
    label || (type === "media" ? "Upload Media" : "Upload Document");

  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropping state (only for images)
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).slice(
        0,
        maxFiles - files.length,
      );

      if (selectedFiles.length === 0) {
        toast.error(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      const file = selectedFiles[0];
      if (
        type === "media" &&
        isSingle &&
        crop &&
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          setCropSrc(reader.result as string);
          setIsCropOpen(true);
        };
        reader.readAsDataURL(file);
      } else {
        const newFiles = selectedFiles.map((file) => ({
          file,
          name: file.name,
          progress: 0,
          status: "idle" as const,
          id: Math.random().toString(36).substring(7),
        }));
        setFiles((prev) => [...prev, ...newFiles]);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = (blob: Blob) => {
    const newFile: UploadFileItem = {
      file: blob,
      name: `cropped-${Date.now()}.jpg`,
      progress: 0,
      status: "idle" as const,
      id: Math.random().toString(36).substring(7),
    };
    setFiles([newFile]); // For single, always replace
    setIsCropOpen(false);
    setCropSrc(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const startUpload = async () => {
    const idleFiles = files.filter((f) => f.status === "idle");
    if (idleFiles.length === 0) return;

    setIsUploading(true);
    setOverallProgress(0);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000/api";
    const token = useAuthStore.getState().token;

    // Updated endpoints based on docs
    const basePath =
      type === "media" ? "attachment/media" : "attachment/document";
    const endpoint = isSingle
      ? `${basePath}/upload/single`
      : `${basePath}/upload/multiple`;

    const uploadUrl = new URL(
      `${apiBaseUrl}/${
        endpoint.startsWith("/") ? endpoint.substring(1) : endpoint
      }`,
    );

    if (entityId) {
      uploadUrl.searchParams.append("entityId", entityId);
    }

    const formData = new FormData();
    idleFiles.forEach((f) => {
      formData.append(isSingle ? "file" : "files", f.file, f.name);
    });

    setFiles((prev) =>
      prev.map((f) =>
        f.status === "idle" ? { ...f, status: "uploading" } : f,
      ),
    );

    try {
      const response = (await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl.toString());

        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            setOverallProgress(percentComplete);
            setFiles((prev) =>
              prev.map((f) =>
                f.status === "uploading"
                  ? { ...f, progress: percentComplete }
                  : f,
              ),
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              let data: FileUploadResponse[];
              
              if (type === "document") {
                if (Array.isArray(res.documents)) {
                  data = res.documents.map((d: any) => ({
                    id: d.id,
                    url: d.url,
                    name: d.name || d.key?.split("/").pop() || "Document",
                    mimeType: d.mimeType || "",
                    size: Number(d.sizeBytes) || 0,
                  }));
                } else if (res.document) {
                  data = [{
                    id: res.document.id,
                    url: res.document.url,
                    name: res.document.name || res.document.key?.split("/").pop() || "Document",
                    mimeType: res.document.mimeType || "",
                    size: Number(res.document.sizeBytes) || 0,
                  }];
                } else {
                  data = [];
                }
              } else {
                if (Array.isArray(res.media)) {
                  data = res.media.map((m: any) => ({
                    id: m.id,
                    url: m.url,
                    name: m.name || m.key?.split("/").pop() || "Media",
                    mimeType: m.mimeType || "",
                    size: Number(m.sizeBytes) || 0,
                  }));
                } else if (res.media) {
                  data = [{
                    id: res.media.id,
                    url: res.media.url,
                    name: res.media.name || res.media.key?.split("/").pop() || "Media",
                    mimeType: res.media.mimeType || "",
                    size: Number(res.media.sizeBytes) || 0,
                  }];
                } else {
                  data = [];
                }
              }
              
              resolve(data);
            } catch {
              reject(new Error("Invalid response from server"));
            }
          } else {
            let errorMessage = "Upload failed";
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage =
                errorResponse.message || errorResponse.error || errorMessage;
            } catch {}
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      })) as FileUploadResponse[];

      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "success", progress: 100 }
            : f,
        ),
      );

      toast.success(`Successfully uploaded ${idleFiles.length} file(s)`);

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
      setIsOpen(false);
      setFiles([]); // Clear files on success
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error", error: errorMessage }
            : f,
        ),
      );
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setOverallProgress(0);
    }
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "success"));
  };

  const triggerClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const acceptString =
    type === "media" ? "image/*,video/*" : ".pdf,.doc,.docx,.txt,.md";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children ? (
          <DialogTrigger asChild>{children}</DialogTrigger>
        ) : (
          showTrigger && (
            <DialogTrigger asChild>
              <Button
                variant={buttonVariant}
                size="sm"
                className="gap-2"
                disabled={disabled}
              >
                <UploadCloud className="size-4" />
                <span className="hidden sm:inline">{defaultLabel}</span>
              </Button>
            </DialogTrigger>
          )
        )}
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Upload {type === "media" ? "Media" : "Document"}
            </DialogTitle>
            <DialogDescription>
              {isSingle
                ? `Upload a single ${
                    type === "media" ? "media file" : "document"
                  }.`
                : `Upload multiple files. Maximum ${maxFiles} files per batch.`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 py-10 transition-colors hover:bg-accent",
                (isUploading || (isSingle && files.length > 0)) &&
                  "pointer-events-none opacity-50",
              )}
              onClick={triggerClick}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="rounded-full bg-primary/10 p-4">
                  <UploadCloud className="size-8 text-primary" />
                </div>
                <p className="text-sm font-medium">
                  Click to select {isSingle ? "a file" : "files"}
                </p>
                <p className="text-xs text-muted-foreground text-center px-4">
                  {type === "media"
                    ? "PNG, JPG, GIF or Video files"
                    : "PDF, DOC, DOCX, TXT, or MD files"}
                </p>
              </div>
              <input
                type="file"
                multiple={!isSingle}
                accept={acceptString}
                className="hidden"
                ref={fileInputRef}
                onChange={onFileChange}
                disabled={isUploading || (isSingle && files.length > 0)}
              />
            </div>

            {files.length > 0 && (
              <div className="h-[200px] overflow-y-auto rounded-md border p-2">
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col gap-2 rounded-md bg-muted/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          {type === "media" ? (
                            <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <FileText className="size-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate text-sm font-medium">
                            {file.name}
                          </span>
                        </div>
                        {!isUploading && file.status !== "success" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="size-3" />
                          </Button>
                        )}
                        {file.status === "success" && (
                          <CheckCircle2 className="size-4 text-green-500" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="size-4 text-destructive" />
                        )}
                      </div>
                      {isUploading && file.status === "uploading" && (
                        <Progress value={file.progress} className="h-1" />
                      )}
                      {file.status === "success" && (
                        <Progress value={100} className="h-1" />
                      )}
                      {file.status === "error" && file.error && (
                        <p className="text-[10px] text-destructive">
                          {file.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Total Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-1" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompleted}
              disabled={
                isUploading || !files.some((f) => f.status === "success")
              }
            >
              Clear Completed
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={startUpload}
                disabled={
                  isUploading || !files.some((f) => f.status === "idle")
                }
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Start Upload"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageCropper
        open={isCropOpen}
        onOpenChange={setIsCropOpen}
        imageSrc={cropSrc}
        onCropComplete={onCropComplete}
        aspect={1}
      />
    </>
  );
}

// Alias for backward compatibility
export const MediaUploader = (props: Omit<FileUploaderProps, "type">) => (
  <FileUploader {...props} type="media" />
);
