"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Loader2,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { useCreateOfferMutation } from "@/queries/catalogQueries";
import { toast } from "sonner";
import { useState } from "react";

const offerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(0),
  publishedAt: z.date(),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  mediaIds: z.array(z.string()),
  documentIds: z.array(z.string()),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  listingId: string;
  entityId: string;
  onSuccess?: () => void;
}

export function OfferForm({ listingId, entityId, onSuccess }: OfferFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const createOfferMutation = useCreateOfferMutation();

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: "",
      description: "",
      publishedAt: new Date(),
      isActive: true,
      isPublic: false,
      mediaIds: [],
      documentIds: [],
    },
  });

  const onSubmit = (values: OfferFormValues) => {
    // Combine media and documents into attachments as simple mapping for now
    // The backend expects `attachments` as string[]? Based on catalog.ts types I added:
    // CreateOfferRequest: attachments?: string[];
    // So I should combine them.
    const attachments = [
      ...(values.mediaIds || []),
      ...(values.documentIds || []),
    ];

    createOfferMutation.mutate(
      {
        itemListingId: listingId,
        entityId: entityId,
        name: values.name,
        description: values.description,
        publishedAt: (values.publishedAt || new Date()).toISOString(),
        isActive: !!values.isActive,
        isPublic: !!values.isPublic,
        attachments: attachments.length > 0 ? attachments : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Offer created successfully");
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create offer");
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Sale" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the offer..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Publish Date</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-8">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm w-full">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Enable or disable this offer immediately.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm w-full">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Public</FormLabel>
                  <FormDescription>
                    Make this offer visible to everyone.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Attachments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mediaIds"
              render={({ field }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <FormLabel>Media</FormLabel>
                    <FileUploader
                      type="media"
                      variant="multiple"
                      entityId={entityId}
                      onUploadSuccess={(newFiles: FileUploadResponse[]) => {
                        const newIds = newFiles.map((f) => f.id);
                        field.onChange([...(field.value || []), ...newIds]);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    {!field.value || field.value.length === 0 ? (
                      <div className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
                        <ImageIcon className="size-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          No media uploaded.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {field.value.map((id, index) => (
                          <div
                            key={id}
                            className="flex items-center justify-between p-2 border rounded-md bg-card"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <ImageIcon className="size-4 shrink-0 text-primary" />
                              <span className="text-xs truncate">
                                Media {index + 1} ({id})
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-6 text-destructive"
                              onClick={() =>
                                field.onChange(
                                  field.value?.filter((i) => i !== id),
                                )
                              }
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="documentIds"
              render={({ field }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <FormLabel>Documents</FormLabel>
                    <FileUploader
                      type="document"
                      variant="multiple"
                      entityId={entityId}
                      onUploadSuccess={(newFiles: FileUploadResponse[]) => {
                        const newIds = newFiles.map((f) => f.id);
                        field.onChange([...(field.value || []), ...newIds]);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    {!field.value || field.value.length === 0 ? (
                      <div className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
                        <FileText className="size-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          No documents uploaded.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {field.value.map((id, index) => (
                          <div
                            key={id}
                            className="flex items-center justify-between p-2 border rounded-md bg-card"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="size-4 shrink-0 text-primary" />
                              <span className="text-xs truncate">
                                Document {index + 1} ({id})
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-6 text-destructive"
                              onClick={() =>
                                field.onChange(
                                  field.value?.filter((i) => i !== id),
                                )
                              }
                            >
                              <X className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </div>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={createOfferMutation.isPending}>
          {createOfferMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Offer
        </Button>
      </form>
    </Form>
  );
}
