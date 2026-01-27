export interface Discussion {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventId?: string;
  offerId?: string;
  itemId?: string;
  slug?: string;
}

export interface DiscussionPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  isHidden: boolean;
  isFlagged: boolean;
  flagReason?: string;
  createdById: string;
  discussionId: string;
  createdBy: {
    id: string;
    name: string;
    image?: string;
    role: string;
    staffAt?: {
      name: string;
    };
  };
}

export interface ForumContextResponse {
  discussion: Discussion;
  posts: DiscussionPost[];
}

export interface CreatePostRequest {
  discussionId: string;
  content: string;
}
