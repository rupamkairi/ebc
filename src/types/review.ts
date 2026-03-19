export interface Media {
  id: string;
  url: string;
  type: string;
}

export interface Attachment {
  id: string;
  reviewId?: string;
  mediaId: string;
  media: Media;
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
  attachments?: Attachment[];
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
  isVerified?: boolean;
}
