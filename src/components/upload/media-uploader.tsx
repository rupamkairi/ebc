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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UploadCloud,
  FileIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface UploadFileItem {
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  id: string;
}

export function MediaUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        progress: 0,
        status: "idle" as const,
        id: Math.random().toString(36).substring(7),
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    const formData = new FormData();
    idleFiles.forEach((f) => {
      formData.append("files", f.file);
    });

    // Update status to uploading for all idle files
    setFiles((prev) =>
      prev.map((f) => (f.status === "idle" ? { ...f, status: "uploading" } : f))
    );

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${apiBaseUrl}/media/upload/multiple`);

        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setOverallProgress(percentComplete);

            // Heuristic: update individual file progress equally
            setFiles((prev) =>
              prev.map((f) =>
                f.status === "uploading"
                  ? { ...f, progress: percentComplete }
                  : f
              )
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            let errorMessage = "Upload failed";
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage = errorResponse.message || errorMessage;
            } catch (e) {
              // Ignore parse error
            }
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "success", progress: 100 }
            : f
        )
      );
      toast.success(`Successfully uploaded ${idleFiles.length} files`);
    } catch (error: unknown) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error", error: errorMessage }
            : f
        )
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UploadCloud className="size-4" />
          <span className="hidden sm:inline">Upload Media</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload files to the media library. Maximum 10 files per batch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 py-10 transition-colors hover:bg-accent",
              isUploading && "pointer-events-none opacity-50"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="rounded-full bg-primary/10 p-4">
                <UploadCloud className="size-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Click to select files</p>
              <p className="text-xs text-muted-foreground">
                Drag and drop or browse files
              </p>
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={onFileChange}
              disabled={isUploading}
            />
          </div>

          {files.length > 0 && (
            <ScrollArea className="h-[200px] rounded-md border p-2">
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-2 rounded-md bg-muted/50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm font-medium">
                          {file.file.name}
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
            </ScrollArea>
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
            disabled={isUploading || !files.some((f) => f.status === "success")}
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
              disabled={isUploading || !files.some((f) => f.status === "idle")}
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
  );
}
