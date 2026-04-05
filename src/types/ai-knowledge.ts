export type AiKnowledgeSourceStatus =
  | "QUEUED"
  | "PROCESSING"
  | "READY"
  | "FAILED";

export interface AiKnowledgeSource {
  id: string;
  status: AiKnowledgeSourceStatus;
  errorMessage?: string | null;
  chunkCount: number;
  rawTextChars: number;
  createdAt: string;
  updatedAt: string;
  documentId?: string | null;
  mediaId?: string | null;
  document?: {
    id: string;
    key?: string | null;
    mimeType?: string | null;
    url: string;
  } | null;
  media?: {
    id: string;
    key?: string | null;
    mimeType?: string | null;
    url: string;
  } | null;
}

export interface CreateAiKnowledgeSourcesRequest {
  documentIds?: string[];
  mediaIds?: string[];
  titlePrefix?: string;
}

export interface CreateAiKnowledgeSourcesResponse {
  sources: Array<{
    id: string;
    status: AiKnowledgeSourceStatus;
  }>;
}

export interface ReindexAiKnowledgeSourceResponse {
  source: {
    id: string;
    status: AiKnowledgeSourceStatus;
  };
}

export interface DeleteAiKnowledgeSourceResponse {
  id: string;
  deleted: boolean;
}
