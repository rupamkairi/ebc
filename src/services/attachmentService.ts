import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface AttachmentResponse {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
}

export const attachmentService = {
  media: {
    async uploadSingle(file: File | Blob) {
      const formData = new FormData();
      formData.append("file", file);
      return fetchClient<AttachmentResponse>(
        API_ENDPOINTS.ATTACHMENT.MEDIA.UPLOAD_SINGLE,
        {
          method: "POST",
          body: formData,
        }
      );
    },

    async uploadMultiple(files: (File | Blob)[]) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      return fetchClient<AttachmentResponse[]>(
        API_ENDPOINTS.ATTACHMENT.MEDIA.UPLOAD_MULTIPLE,
        {
          method: "POST",
          body: formData,
        }
      );
    },

    getUrl(id: string) {
      return `${API_ENDPOINTS.ATTACHMENT.MEDIA.GET_URL}/${id}`;
    },
  },

  document: {
    async uploadSingle(file: File | Blob) {
      const formData = new FormData();
      formData.append("file", file);
      return fetchClient<AttachmentResponse>(
        API_ENDPOINTS.ATTACHMENT.DOCUMENT.UPLOAD_SINGLE,
        {
          method: "POST",
          body: formData,
        }
      );
    },

    async uploadMultiple(files: (File | Blob)[]) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      return fetchClient<AttachmentResponse[]>(
        API_ENDPOINTS.ATTACHMENT.DOCUMENT.UPLOAD_MULTIPLE,
        {
          method: "POST",
          body: formData,
        }
      );
    },

    getUrl(id: string) {
      return `${API_ENDPOINTS.ATTACHMENT.DOCUMENT.GET_URL}/${id}`;
    },
  },
};
