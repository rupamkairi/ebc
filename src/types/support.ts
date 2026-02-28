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
  senderId: string;
  message: string;
  attachmentIds?: string[];
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
  category?: SupportCategory;
  assignedTo?: {
    id: string;
    name: string;
  };
  conversations?: SupportMessage[];
}

export interface CreateSupportQueryRequest {
  categoryId: string;
  subject: string;
  description: string;
  priority: SUPPORT_QUERY_PRIORITY;
  attachmentIds?: string[];
}

export interface AddSupportMessageRequest {
  message: string;
  attachmentIds?: string[];
}
