import { useMutation } from "@tanstack/react-query";
import { attachmentService } from "@/services/attachmentService";

export function useUploadMediaMutation() {
  return useMutation({
    mutationFn: (files: File | Blob | (File | Blob)[]) => {
      if (Array.isArray(files)) {
        return attachmentService.media.uploadMultiple(files);
      }
      return attachmentService.media.uploadSingle(files);
    },
  });
}

export function useUploadDocumentMutation() {
  return useMutation({
    mutationFn: (files: File | Blob | (File | Blob)[]) => {
      if (Array.isArray(files)) {
        return attachmentService.document.uploadMultiple(files);
      }
      return attachmentService.document.uploadSingle(files);
    },
  });
}
