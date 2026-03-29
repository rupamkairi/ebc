"use client";

import Container from "@/components/ui/containers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAiKnowledgeSourcesQuery,
  useCreateAiKnowledgeSourcesMutation,
  useDeleteAiKnowledgeSourceMutation,
  useReindexAiKnowledgeSourceMutation,
} from "@/queries/aiKnowledgeQueries";
import { FileUploader, FileUploadResponse } from "@/components/shared/upload/media-uploader";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { AiKnowledgeSource, AiKnowledgeSourceStatus } from "@/types/ai-knowledge";
import {
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

const sampleQuestions = [
  "What cement:sand ratio is recommended for internal plaster in the sample guide?",
  "What is the minimum and preferred curing duration for the RCC slab?",
  "What contingency percentage is suggested in the sample estimate?",
  "According to the sample, what is the estimated project total for the 500 sq ft room?",
  "Which items are explicitly excluded from the estimate?",
];

const statusVariant: Record<
  AiKnowledgeSourceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  QUEUED: "secondary",
  PROCESSING: "outline",
  READY: "default",
  FAILED: "destructive",
};

const getSourceName = (source: AiKnowledgeSource) => {
  if (source.document?.key) return source.document.key.split("/").pop();
  if (source.media?.key) return source.media.key.split("/").pop();
  return source.id;
};

export default function AdminAiCalculatorKnowledgePage() {
  const {
    data: sources = [],
    isLoading,
    refetch,
  } = useAiKnowledgeSourcesQuery();

  const createSourcesMutation = useCreateAiKnowledgeSourcesMutation();
  const reindexMutation = useReindexAiKnowledgeSourceMutation();
  const deleteMutation = useDeleteAiKnowledgeSourceMutation();

  const readyCount = sources.filter((source) => source.status === "READY").length;
  const processingCount = sources.filter(
    (source) => source.status === "PROCESSING" || source.status === "QUEUED",
  ).length;
  const failedCount = sources.filter((source) => source.status === "FAILED").length;

  const handleDocumentUpload = (files: FileUploadResponse[]) => {
    const ids = files.map((file) => file.id);
    if (ids.length === 0) return;

    createSourcesMutation.mutate(
      { documentIds: ids },
      {
        onSuccess: (result) => {
          toast.success(`Queued ${result.sources.length} document source(s) for training.`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to queue document sources.");
        },
      },
    );
  };

  const handleMediaUpload = (files: FileUploadResponse[]) => {
    const ids = files.map((file) => file.id);
    if (ids.length === 0) return;

    createSourcesMutation.mutate(
      { mediaIds: ids },
      {
        onSuccess: (result) => {
          toast.success(`Queued ${result.sources.length} image source(s) for training.`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to queue media sources.");
        },
      },
    );
  };

  const handleReindex = (sourceId: string) => {
    reindexMutation.mutate(sourceId, {
      onSuccess: () => {
        toast.success("Source reindex queued.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to queue reindex.");
      },
    });
  };

  const handleDelete = (sourceId: string) => {
    deleteMutation.mutate(sourceId, {
      onSuccess: () => {
        toast.success("Source removed.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete source.");
      },
    });
  };

  return (
    <Container className="py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">AI Calculator Knowledge</h1>
          <p className="text-muted-foreground">
            Upload construction documents and images to train retrieval knowledge for
            the calculator.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sources</CardDescription>
            <CardTitle>{sources.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ready</CardDescription>
            <CardTitle>{readyCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Queued/Processing</CardDescription>
            <CardTitle>{processingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed</CardDescription>
            <CardTitle>{failedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Knowledge Sources</CardTitle>
          <CardDescription>
            Documents: PDF, DOCX, TXT, MD. Media: images only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <FileUploader
            type="document"
            variant="multiple"
            maxFiles={10}
            label="Upload Documents"
            onUploadSuccess={handleDocumentUpload}
            disabled={createSourcesMutation.isPending}
          />
          <FileUploader
            type="media"
            variant="multiple"
            maxFiles={10}
            label="Upload Images"
            onUploadSuccess={handleMediaUpload}
            disabled={createSourcesMutation.isPending}
          />
          {createSourcesMutation.isPending && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Queueing sources...
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Knowledge Pack</CardTitle>
          <CardDescription>
            Use this sample to quickly validate training and retrieval quality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-3">
            <a
              href="/samples/ai-calculator-knowledge-sample.md"
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              Open sample document
            </a>
            <a
              href="/samples/ai-calculator-sample-questions.txt"
              target="_blank"
              rel="noreferrer"
              className="underline text-primary"
            >
              Open sample questions
            </a>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {sampleQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources</CardTitle>
          <CardDescription>
            Monitor ingestion status and reindex/delete existing sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading sources...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No knowledge sources uploaded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  sources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        {source.documentId ? (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <FileText className="h-3.5 w-3.5" /> Document
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <ImageIcon className="h-3.5 w-3.5" /> Image
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate">{getSourceName(source)}</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-2">
                          <Badge variant={statusVariant[source.status]}>{source.status}</Badge>
                          {source.status === "FAILED" && source.errorMessage && (
                            <span className="inline-flex items-center text-destructive" title={source.errorMessage}>
                              <AlertCircle className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{source.chunkCount}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(source.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReindex(source.id)}
                            disabled={reindexMutation.isPending}
                          >
                            Reindex
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(source.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
