import {
  SUPPORT_QUERY_STATUS,
  SUPPORT_QUERY_PRIORITY,
} from "@/constants/enums";

export interface SupportFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  faqs?: SupportFAQ[];
}

export type SupportQueryStatus = SUPPORT_QUERY_STATUS;

export interface SupportMessage {
  id: string;
  queryId: string;
  senderId: string | null;
  isGuest?: boolean;
  message: string;
  attachments?: SupportAttachment[];
  createdAt: string;
}

export interface SupportQuery {
  id: string;
  userId: string;
  categoryId: string;
  subject: string;
  description: string;
  status: SupportQueryStatus;
  priority: SUPPORT_QUERY_PRIORITY;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  archivedById?: string | null;
  category?: SupportCategory;
  assignedTo?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
    phone?: string;
  };
  conversations?: SupportMessage[];
}

export interface CreateSupportQueryRequest {
  categoryId: string;
  subject: string;
  description: string;
  priority: SUPPORT_QUERY_PRIORITY;
  attachments?: SupportAttachmentRef[];
}

export interface AddSupportMessageRequest {
  message?: string;
  attachments?: SupportAttachmentRef[];
}

export interface SupportAttachmentRef {
  mediaId?: string;
  documentId?: string;
}

export interface SupportFile {
  id: string;
  url: string;
  key?: string;
  mimeType?: string;
  sizeBytes?: string;
}

export interface SupportAttachment {
  id: string;
  mediaId?: string | null;
  documentId?: string | null;
  media?: SupportFile | null;
  document?: SupportFile | null;
}
