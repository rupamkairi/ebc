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

export type SupportQueryStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

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
  attachmentIds?: string[];
}

export interface AddSupportMessageRequest {
  message: string;
  attachmentIds?: string[];
}
