export interface ReviewAttachment {
  id: string;
  sourceId?: string;
  url: string;
  category: "image" | "video" | "document";
  originalName?: string;
  mimeType?: string;
  size: number;
  kind?: "IMAGE" | "VIDEO";
}

export interface ReviewUser {
  id: string;
  name: string;
  image?: string;
  phone?: string;
  email?: string;
  staffAtEntityId?: string;
  staffAt?: {
    id: string;
    name: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  title?: string;
  description?: string;
  isVerified: boolean;
  isHidden: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: ReviewUser;
  entityId?: string;
  entity?: {
    id: string;
    name: string;
  };
  itemListingId?: string;
  enquiryId?: string;
  appointmentId?: string;
  attachments?: ReviewAttachment[];
}

export interface ReviewSummary {
  total: number;
  average: number;
  verifiedCount: number;
  distribution: {
    [key: number]: number;
  };
}

export interface CreateReviewRequest {
  entityId?: string;
  itemListingId?: string;
  enquiryId?: string;
  appointmentId?: string;
  rating: number;
  title?: string;
  description?: string;
  attachmentIds?: string[];
  documentIds?: string[];
  isVerified?: boolean;
}
