"use client";

import { useState } from "react";
import { Star, Send, Loader2, X, Plus, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReviewMutation } from "@/queries/reviewQueries";
import { MediaUploader } from "@/components/shared/upload/media-uploader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Media {
  id: string;
  url: string;
}

interface ReviewFormProps {
  entityId?: string;
  itemListingId?: string;
  enquiryId?: string;
  appointmentId?: string;
  isVerified?: boolean;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ReviewForm({ entityId, itemListingId, enquiryId, appointmentId, isVerified, onSuccess, trigger }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
  const [uploadedMedias, setUploadedMedias] = useState<Media[]>([]);

  const createMutation = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      await createMutation.mutateAsync({
        entityId,
        itemListingId,
        enquiryId,
        appointmentId,
        rating,
        title,
        description,
        attachmentIds,
        isVerified: !!(isVerified || enquiryId || appointmentId)
      });
      
      toast.success("Review submitted! Thank you for your feedback.");
      setIsOpen(false);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      toast.error(message);
    }
  };

  const resetForm = () => {
    setRating(5);
    setTitle("");
    setDescription("");
    setAttachmentIds([]);
    setUploadedMedias([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="rounded-2xl gap-2 font-bold hover:bg-primary/5 hover:border-primary/50 transition-all">
            <Plus className="h-4 w-4" />
            Write a Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-4xl border-none shadow-2xl">
        <div className="bg-linear-to-b from-primary/10 to-background p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight">Post your Feedback</DialogTitle>
            <p className="text-muted-foreground text-sm">Help others by sharing your experience with this seller.</p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-white/50 border rounded-3xl shadow-sm">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Rate your experience</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-transform active:scale-95"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "h-10 w-10 transition-colors",
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted/20"
                      )}
                    />
                  </button>
                ))}
              </div>
              <span className="mt-4 text-sm font-bold text-primary capitalize">
                {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Disappointing"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-muted-foreground">Title (Optional)</label>
                <Input
                  placeholder="Summarize your experience..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-2xl border-none bg-white shadow-sm h-12 px-6"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-muted-foreground">Detailed Feedback</label>
                <Textarea
                  placeholder="What did you like or dislike? Your feedback helps the community grow."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-3xl border-none bg-white shadow-sm min-h-[120px] p-6 resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-muted-foreground">Photos / Videos</label>
              <div className="flex flex-wrap gap-2 px-1">
                {uploadedMedias.map((media, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded-2xl overflow-hidden border group shadow-sm">
                    <img 
                      src={media.url} 
                      alt={`Review attachment ${idx + 1}`}
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setUploadedMedias(prev => prev.filter((_, i) => i !== idx));
                        setAttachmentIds(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {uploadedMedias.length < 5 && (
                  <MediaUploader
                    variant="multiple"
                    onUploadSuccess={(attachments) => {
                      const newIds = attachments.map((a) => a.id);
                      setAttachmentIds(prev => [...prev, ...newIds]);
                      setUploadedMedias(prev => [...prev, ...attachments.map((a) => ({ id: a.id, url: a.url }))]);
                    }}
                  >
                    <button type="button" className="h-20 w-20 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/10 transition-colors">
                      <Camera className="h-5 w-5" />
                      <span className="text-[10px] font-black">ADD</span>
                    </button>
                  </MediaUploader>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-3xl text-base font-black tracking-tight" 
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              Submit Experience
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
