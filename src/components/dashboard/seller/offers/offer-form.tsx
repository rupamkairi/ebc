"use client";

import { UnifiedRegionSelector } from "@/components/shared/region/unified-region-selector";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useBrandsQuery,
  useCategoriesQuery,
  useItemListingsQuery,
  useItemsQuery,
  useSpecificationsQuery,
} from "@/queries/catalogQueries";
import {
  useCreateOfferMutation,
  useOfferQuery,
  useUpdateOfferMutation,
} from "@/queries/conferenceHallQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useLeadPricing } from "@/queries/pricingQueries";
import {
  Brand,
  Category,
  Item,
  ItemListing,
  Specification,
} from "@/types/catalog";
import {
  CreateOfferRequest,
  Offer,
  VERIFICATION_STATUS,
} from "@/types/conference-hall";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  CalendarIcon,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";

// Generic MultiSelect Component
function MultiSelectCombobox({
  options,
  selectedIds,
  onToggle,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  isLoading = false,
  onSearchChange,
  className,
}: {
  options: { id: string; label: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  onSearchChange?: (search: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : placeholder}
          </span>
          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : emptyMessage}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.label}
                  onSelect={() => {
                    onToggle(option.id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIds.includes(option.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const offerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  mediaIds: z.array(z.string()),
  documentIds: z.array(z.string()),
  relations: z.array(
    z.object({
      relationType: z.enum([
        "CATEGORY",
        "BRAND",
        "SPECIFICATION",
        "ITEM",
        "ITEM_LISTING",
      ]),
      relationId: z.string(),
    }),
  ),
  pincodeIds: z.any().optional(),
  targetRegions: z.array(
    z.object({
      scopeType: z
        .enum(["PAN_INDIA", "STATE", "DISTRICT", "PINCODE"])
        .optional(),
      pincodeId: z.string(),
      state: z.string().optional(),
      district: z.string().optional(),
    }),
  ),
});

type OfferFormValues = z.infer<typeof offerSchema>;

type OfferHydrationIssue = {
  field: keyof OfferFormValues | "root";
  message: string;
};

const OFFER_RELATION_TYPES = new Set([
  "CATEGORY",
  "BRAND",
  "SPECIFICATION",
  "ITEM",
  "ITEM_LISTING",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function toIssueMessage(field: string, reason: string) {
  return `${field}: ${reason}`;
}

function normalizeOfferForForm(offer: Offer): {
  values: OfferFormValues;
  issues: OfferHydrationIssue[];
} {
  const issues: OfferHydrationIssue[] = [];
  const detail = Array.isArray(offer.offerDetails) ? offer.offerDetails[0] : null;

  const name = asString(offer.name);
  if (!name || name.length < 2) {
    issues.push({
      field: "name",
      message: "Offer name is missing or invalid.",
    });
  }

  const startDate = asDate(detail?.startDate);
  if (!startDate) {
    issues.push({
      field: "startDate",
      message: "Start date is missing or invalid.",
    });
  }

  const endDate = asDate(detail?.endDate);
  if (!endDate) {
    issues.push({
      field: "endDate",
      message: "End date is missing or invalid.",
    });
  }

  if (startDate && endDate && endDate < startDate) {
    issues.push({
      field: "endDate",
      message: "End date must be on or after the start date.",
    });
  }

  const isActive = asBoolean(offer.isActive);
  if (isActive === null) {
    issues.push({
      field: "isActive",
      message: "Active status is missing or invalid.",
    });
  }

  const isPublic = asBoolean(detail?.isPublic);
  if (isPublic === null) {
    issues.push({
      field: "isPublic",
      message: "Public visibility is missing or invalid.",
    });
  }

  const mediaIds: string[] = [];
  const documentIds: string[] = [];
  const attachments = Array.isArray(detail?.attachments) ? detail?.attachments : null;

  if (attachments === null && detail?.attachments !== undefined) {
    issues.push({
      field: "mediaIds",
      message: "Attachments were returned in an unexpected shape.",
    });
  }

  attachments?.forEach((attachment, index) => {
    if (!isRecord(attachment)) {
      issues.push({
        field: "mediaIds",
        message: `Attachment ${index + 1} is invalid and was skipped.`,
      });
      return;
    }

    const mediaId = asString(attachment.mediaId);
    const documentId = asString(attachment.documentId);

    if (mediaId) {
      if (!mediaIds.includes(mediaId)) mediaIds.push(mediaId);
    } else if (attachment.mediaId !== undefined && attachment.mediaId !== null) {
      issues.push({
        field: "mediaIds",
        message: `Attachment ${index + 1} has an invalid media reference.`,
      });
    }

    if (documentId) {
      if (!documentIds.includes(documentId)) documentIds.push(documentId);
    } else if (attachment.documentId !== undefined && attachment.documentId !== null) {
      issues.push({
        field: "documentIds",
        message: `Attachment ${index + 1} has an invalid document reference.`,
      });
    }
  });

  const relations: OfferFormValues["relations"] = [];
  const rawRelations = Array.isArray(offer.offerRelations)
    ? offer.offerRelations
    : null;
  if (rawRelations === null && offer.offerRelations !== undefined) {
    issues.push({
      field: "relations",
      message: "Offer relations were returned in an unexpected shape.",
    });
  }

  rawRelations?.forEach((relation, index) => {
    if (!isRecord(relation)) {
      issues.push({
        field: "relations",
        message: `Relation ${index + 1} is invalid and was skipped.`,
      });
      return;
    }

    const relationType = asString(relation.relationType);
    let relationId = asString(relation.relationId);
    let resolvedType = relationType as OfferFormValues["relations"][number]["relationType"] | null;

    if (!resolvedType) {
      if (asString(relation.categoryId)) {
        resolvedType = "CATEGORY";
        relationId = asString(relation.categoryId);
      } else if (asString(relation.brandId)) {
        resolvedType = "BRAND";
        relationId = asString(relation.brandId);
      } else if (asString(relation.specificationId)) {
        resolvedType = "SPECIFICATION";
        relationId = asString(relation.specificationId);
      } else if (asString(relation.itemId)) {
        resolvedType = "ITEM";
        relationId = asString(relation.itemId);
      } else if (asString(relation.itemListingId)) {
        resolvedType = "ITEM_LISTING";
        relationId = asString(relation.itemListingId);
      }
    }

    if (!resolvedType || !OFFER_RELATION_TYPES.has(resolvedType)) {
      issues.push({
        field: "relations",
        message: `Relation ${index + 1} has an invalid type and was skipped.`,
      });
      return;
    }

    if (!relationId) {
      issues.push({
        field: "relations",
        message: `Relation ${index + 1} is missing its target id and was skipped.`,
      });
      return;
    }

    relations.push({
      relationType: resolvedType,
      relationId,
    });
  });

  const targetRegions: OfferFormValues["targetRegions"] = [];
  const rawTargetRegions = Array.isArray(offer.targetRegions)
    ? offer.targetRegions
    : Array.isArray(offer.targetRegion)
      ? offer.targetRegion
      : null;

  if (rawTargetRegions === null && offer.targetRegions !== undefined) {
    issues.push({
      field: "targetRegions",
      message: "Target regions were returned in an unexpected shape.",
    });
  }

  rawTargetRegions?.forEach((region, index) => {
    if (!isRecord(region)) {
      issues.push({
        field: "targetRegions",
        message: `Target region ${index + 1} is invalid and was skipped.`,
      });
      return;
    }

    const pincodeId = asString(region.pincodeId);
    if (!pincodeId) {
      issues.push({
        field: "targetRegions",
        message: `Target region ${index + 1} is missing a pincode reference.`,
      });
      return;
    }

    targetRegions.push({
      scopeType:
        asString(region.scopeType) &&
        ["PAN_INDIA", "STATE", "DISTRICT", "PINCODE"].includes(
          asString(region.scopeType) as string,
        )
          ? (asString(region.scopeType) as
              | "PAN_INDIA"
              | "STATE"
              | "DISTRICT"
              | "PINCODE")
          : undefined,
      pincodeId,
      state: asString(region.state) || undefined,
      district: asString(region.district) || undefined,
    });
  });

  return {
    values: {
      name: name || "",
      description: asString(offer.description) || "",
      startDate: startDate || new Date(),
      endDate:
        endDate ||
        new Date(
          (startDate || new Date()).getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
      isActive: isActive ?? true,
      isPublic: isPublic ?? false,
      mediaIds,
      documentIds,
      relations,
      pincodeIds: [],
      targetRegions,
    },
    issues,
  };
}

interface OfferFormProps {
  offerId?: string | null;
  entityId?: string; // If creating for specific entity, otherwise might be inferred from auth
}

export function OfferForm({ offerId, entityId }: OfferFormProps) {
  const router = useRouter();
  const isEdit = !!offerId;

  const {
    data: existingOffer,
    isLoading: isLoadingOffer,
    error: offerError,
  } = useOfferQuery(
    offerId || "",
  );

  const { data: entities } = useEntitiesQuery();
  const activeEntityId = entityId || entities?.[0]?.id;

  const isPublished = !!existingOffer?.offerDetails?.[0]?.publishedAt;
  const isReadOnly =
    isPublished ||
    existingOffer?.verificationStatus === VERIFICATION_STATUS.APPROVED;

  const createMutation = useCreateOfferMutation();
  const updateMutation = useUpdateOfferMutation();
  const offerHydration = useMemo(() => {
    if (isLoadingOffer) {
      return { loadBanner: null as string | null, issues: [], values: null };
    }

    if (!existingOffer) {
      return {
        loadBanner: isEdit
          ? offerError instanceof Error
            ? offerError.message
            : "Could not load this offer. Showing a blank form so you can continue."
          : null,
        issues: [],
        values: null,
      };
    }

    const normalized = normalizeOfferForForm(existingOffer);
    return {
      loadBanner: null as string | null,
      issues: normalized.issues,
      values: normalized.values,
    };
  }, [existingOffer, isEdit, isLoadingOffer, offerError]);

  const { data: pricingData, isLoading: isLoadingPricing } =
    useLeadPricing("OFFER");
  const publishingFee = pricingData?.cost ?? 0;

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      isActive: true,
      isPublic: false,
      mediaIds: [],
      documentIds: [],
      relations: [],
      pincodeIds: [],
      targetRegions: [],
    },
  });

  useEffect(() => {
    if (isLoadingOffer) return;

    form.clearErrors();
    if (!offerHydration.values) {
      return;
    }

    form.reset(offerHydration.values);

    offerHydration.issues.forEach((issue) => {
      if (issue.field === "root") return;
      form.setError(issue.field, { type: "server", message: issue.message });
    });
  }, [existingOffer, form, isLoadingOffer, offerHydration]);

  const { data: categories } = useCategoriesQuery();
  const { data: brands } = useBrandsQuery();
  const { data: specifications } = useSpecificationsQuery();
  const { data: items } = useItemsQuery();
  const { data: listings } = useItemListingsQuery();
  // regions handled via pincode search ideally, but for now assuming list or manual entry

  const [selectedRelationType, setSelectedRelationType] = useState<
    "CATEGORY" | "BRAND" | "SPECIFICATION" | "ITEM" | "ITEM_LISTING"
  >("CATEGORY");

  const toggleRelation = (id: string) => {
    const current = form.getValues("relations");
    const exists = current.find(
      (r) => r.relationType === selectedRelationType && r.relationId === id,
    );

    if (exists) {
      form.setValue(
        "relations",
        current.filter(
          (r) =>
            !(r.relationType === selectedRelationType && r.relationId === id),
        ),
      );
    } else {
      form.setValue("relations", [
        ...current,
        { relationType: selectedRelationType, relationId: id },
      ]);
    }
  };

  const handleRemoveRelation = (index: number) => {
    const current = form.getValues("relations");
    form.setValue(
      "relations",
      current.filter((_, i) => i !== index),
    );
  };

  const getRelationName = (type: string, id: string) => {
    if (!id) return "Unknown";

    // First try to find label in current cached offer details (objects from backend)
    const existing = existingOffer?.offerRelations?.find(
      (r) =>
        r.relationId === id ||
        r.categoryId === id ||
        r.brandId === id ||
        r.specificationId === id ||
        r.itemId === id ||
        r.itemListingId === id,
    );

    if (existing) {
      if (existing.category) return existing.category.name;
      if (existing.brand) return existing.brand.name;
      if (existing.specification) return existing.specification.name;
      if (existing.item) return existing.item.name;
      if (existing.itemListing)
        return existing.itemListing.item?.name || existing.itemListingId;
    }

    switch (type) {
      case "CATEGORY":
        return categories?.find((c: Category) => c.id === id)?.name || id;
      case "BRAND":
        return brands?.find((b: Brand) => b.id === id)?.name || id;
      case "SPECIFICATION":
        return (
          specifications?.find((s: Specification) => s.id === id)?.name || id
        );
      case "ITEM":
        return items?.find((i: Item) => i.id === id)?.name || id;
      case "ITEM_LISTING":
        return (
          listings?.find((l: ItemListing) => l.id === id)?.item?.name || id
        );
      default:
        return id;
    }
  };

  const onSubmit = (values: OfferFormValues) => {
    const payload: CreateOfferRequest = {
      entityId: activeEntityId || "temp-entity-id",
      name: values.name,
      description: values.description,
      isActive: values.isActive,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      categoryIds: values.relations
        .filter((r) => r.relationType === "CATEGORY")
        .map((r) => r.relationId),
      brandIds: values.relations
        .filter((r) => r.relationType === "BRAND")
        .map((r) => r.relationId),
      specificationIds: values.relations
        .filter((r) => r.relationType === "SPECIFICATION")
        .map((r) => r.relationId),
      itemIds: values.relations
        .filter((r) => r.relationType === "ITEM")
        .map((r) => r.relationId),
      itemListingIds: values.relations
        .filter((r) => r.relationType === "ITEM_LISTING")
        .map((r) => r.relationId),
      targetRegions: values.targetRegions.map((r) => ({
        scopeType: r.scopeType || "PINCODE",
        pincodeId: r.pincodeId,
        state: r.state || undefined,
        district: r.district || undefined,
      })),
      attachmentIds: [
        ...values.mediaIds.map((id) => ({ mediaId: id })),
        ...values.documentIds.map((id) => ({ documentId: id })),
      ],
    };

    if (isEdit && offerId) {
      updateMutation.mutate(
        { id: offerId, data: payload },
        {
          onSuccess: () => {
            toast.success("Offer updated");
            router.push("/seller-dashboard/conference-hall/offers");
          },
          onError: (err: Error) =>
            toast.error(err.message || "Failed to update"),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Offer created");
          router.push("/seller-dashboard/conference-hall/offers");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to create"),
      });
    }
  };

  if (isLoadingOffer) return <div>Loading...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {existingOffer?.verificationStatus && (
          <Alert
            variant={
              existingOffer.verificationStatus === VERIFICATION_STATUS.REJECTED
                ? "destructive"
                : "default"
            }
            className={
              existingOffer.verificationStatus === VERIFICATION_STATUS.APPROVED
                ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                : ""
            }
          >
            {existingOffer.verificationStatus ===
            VERIFICATION_STATUS.APPROVED ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle className="mb-1 flex items-center gap-2">
              Verification Status:
              <Badge variant="outline" className="">
                {existingOffer.verificationStatus}
              </Badge>
            </AlertTitle>
            <AlertDescription>
              {existingOffer.verificationRemark ? (
                <span>
                  <strong>Remarks:</strong> {existingOffer.verificationRemark}
                </span>
              ) : (
                "No remarks provided."
              )}
              {existingOffer.verificationStatus ===
                VERIFICATION_STATUS.APPROVED && (
                <div className="mt-2 text-xs opacity-90">
                  This offer is approved. You can only change its active status
                  or delete it.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        {(offerHydration.loadBanner || offerHydration.issues.length > 0) && (
          <Alert className="border-amber-300 bg-amber-50 text-amber-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Some offer data needed repair</AlertTitle>
            <AlertDescription className="space-y-2">
              {offerHydration.loadBanner && <p>{offerHydration.loadBanner}</p>}
              {offerHydration.issues.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {offerHydration.issues.map((issue) => (
                    <li key={`${issue.field}-${issue.message}`}>
                      {toIssueMessage(issue.field, issue.message)}
                    </li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}
        {isPublished && (
          <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg text-amber-800 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">This offer is live.</p>
              <p>
                Targets and Regions are read-only to ensure promotional
                historical data integrity. You can still update basic details
                and status.
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Summer Sale"
                          {...field}
                          disabled={isReadOnly}
                        />
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
                        <Textarea
                          placeholder="Details..."
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
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
                              onSelect={field.onChange}
                              disabled={(date) =>
                                isReadOnly || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
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
                              onSelect={field.onChange}
                              disabled={(date) =>
                                isReadOnly || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applicable Relations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="relations"
                  render={({ field }) => {
                    const relations = field.value;

                    return (
                      <div className="space-y-4">
                        <div className="flex gap-4 items-end">
                          <div className="space-y-2 flex-1">
                            <FormLabel>Type</FormLabel>
                            <Select
                              disabled={isReadOnly}
                              value={selectedRelationType}
                              onValueChange={(
                                v:
                                  | "CATEGORY"
                                  | "BRAND"
                                  | "SPECIFICATION"
                                  | "ITEM"
                                  | "ITEM_LISTING",
                              ) => setSelectedRelationType(v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CATEGORY">
                                  Category
                                </SelectItem>
                                <SelectItem value="BRAND">Brand</SelectItem>
                                <SelectItem value="SPECIFICATION">
                                  Specification
                                </SelectItem>
                                <SelectItem value="ITEM">Item</SelectItem>
                                <SelectItem value="ITEM_LISTING">
                                  Listing
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 flex-2">
                            <FormLabel>
                              Select{" "}
                              {selectedRelationType
                                .toLowerCase()
                                .replace("_", " ")}
                              s
                            </FormLabel>
                            <MultiSelectCombobox
                              className={cn(
                                isReadOnly && "opacity-60 cursor-not-allowed",
                              )}
                              options={
                                (selectedRelationType === "CATEGORY"
                                  ? categories?.map((c: Category) => ({
                                      id: c.id,
                                      label: c.name,
                                    }))
                                  : selectedRelationType === "BRAND"
                                    ? brands?.map((b: Brand) => ({
                                        id: b.id,
                                        label: b.name,
                                      }))
                                    : selectedRelationType === "SPECIFICATION"
                                      ? specifications?.map((s: Specification) => ({
                                          id: s.id,
                                          label: s.name,
                                        }))
                                      : selectedRelationType === "ITEM"
                                        ? items?.map((i: Item) => ({
                                            id: i.id,
                                            label: i.name,
                                          }))
                                        : listings?.map((l: ItemListing) => ({
                                            id: l.id,
                                            label: `${l.item?.name || l.id} - ${l.itemRates?.[0]?.rate || "No rate"}`,
                                          }))) || []
                              }
                              selectedIds={relations
                                .filter(
                                  (r) =>
                                    r.relationType === selectedRelationType,
                                )
                                .map((r) => r.relationId)}
                              onToggle={isReadOnly ? () => {} : toggleRelation}
                              placeholder={`Select ${selectedRelationType
                                .toLowerCase()
                                .replace("_", " ")}s...`}
                            />
                          </div>
                        </div>

                        <div className="border rounded-md p-4 min-h-[100px] space-y-2">
                          {relations.map(
                            (
                              r: { relationType: string; relationId: string },
                              i: number,
                            ) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="mr-2 mb-2 p-2 gap-2"
                              >
                                <span className="font-bold text-[10px]  text-muted-foreground mr-1">
                                  {r.relationType}
                                </span>
                                {getRelationName(r.relationType, r.relationId)}
                                {!isReadOnly && (
                                  <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => handleRemoveRelation(i)}
                                  />
                                )}
                              </Badge>
                            ),
                          )}
                          {relations.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                              No relations selected. Offer might apply
                              generally?
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </div>
                    );
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Applicable Regions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(isReadOnly && "pointer-events-none opacity-60")}
                >
                  <FormField
                    control={form.control}
                    name="targetRegions"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <UnifiedRegionSelector
                          selectedRegions={field.value}
                          onUpdate={field.onChange}
                          disabled={isReadOnly}
                        />
                        <FormMessage />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="mediaIds"
                  render={({ field }) => (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <FormLabel>Media</FormLabel>
                        {!isReadOnly && (
                          <FileUploader
                            type="media"
                            variant="multiple"
                            entityId={entityId}
                            onUploadSuccess={(
                              newFiles: FileUploadResponse[],
                            ) => {
                              const newIds = newFiles.map((f) => f.id);
                              field.onChange([
                                ...(field.value || []),
                                ...newIds,
                              ]);
                            }}
                          />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((id) => (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 border rounded text-xs"
                          >
                            <ImageIcon className="h-3 w-3" /> {id.slice(0, 8)}
                            ...
                            {!isReadOnly && (
                              <X
                                className="h-3 w-3 cursor-pointer text-destructive"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((i) => i !== id),
                                  )
                                }
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  )}
                />

                <Separator className="my-4" />

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
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((id) => (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 border rounded text-xs"
                          >
                            <FileText className="h-3 w-3 text-blue-500" />{" "}
                            {id.slice(0, 8)}
                            ...
                            <X
                              className="h-3 w-3 cursor-pointer text-destructive"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((i) => i !== id),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>Immediate effect</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Public</FormLabel>
                        <FormDescription>Visible to all</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-dashed">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Publishing Fee</span>
                <span className="font-semibold text-primary">
                  {isLoadingPricing ? (
                    <Loader2 className="h-4 w-4 animate-spin inline-block" />
                  ) : (
                    publishingFee
                  )}{" "}
                  Coins
                </span>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-[10px] text-yellow-800">
                By publishing, you agree that{" "}
                {isLoadingPricing ? "the applicable" : publishingFee} coins will
                be deducted from your entity wallet.
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Update Offer" : "Create Draft"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
