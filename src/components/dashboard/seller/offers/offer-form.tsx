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
import { OfferRegion, CreateOfferRequest } from "@/types/conference-hall";
import {
  Category,
  Brand,
  Specification,
  Item,
  ItemListing,
} from "@/types/catalog";
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
  Image as ImageIcon,
  FileText,
  X,
  Plus,
  AlertCircle,
} from "lucide-react";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useOfferQuery,
} from "@/queries/conferenceHallQueries";
import {
  useCategoriesQuery,
  useBrandsQuery,
  useSpecificationsQuery,
  useItemsQuery,
  useItemListingsQuery,
} from "@/queries/catalogQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
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

// Helper Component for Pincode Selection
function PincodeSelector({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const { data: pincodes, isLoading } = usePincodeRecordsQuery({
    search: search,
    perPage: 10,
  });

  const options =
    pincodes?.map((p) => ({
      id: p.id,
      label: `${p.pincode} - ${p.district}, ${p.state}`,
    })) || [];

  return (
    <div className="space-y-4">
      <MultiSelectCombobox
        options={options}
        selectedIds={selectedIds}
        onToggle={onToggle}
        placeholder="Select Pincodes..."
        searchPlaceholder="Search pincode or district..."
        isLoading={isLoading}
        onSearchChange={setSearch}
      />

      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id) => (
          <Badge key={id} variant="secondary" className="gap-2">
            Pincode {id.slice(0, 5)}...
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => onToggle(id)}
            />
          </Badge>
        ))}
      </div>
    </div>
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
  pincodeIds: z.array(z.string()),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  offerId?: string | null;
  entityId?: string; // If creating for specific entity, otherwise might be inferred from auth
}

export function OfferForm({ offerId, entityId }: OfferFormProps) {
  const router = useRouter();
  const isEdit = !!offerId;

  const { data: existingOffer, isLoading: isLoadingOffer } = useOfferQuery(
    offerId || "",
  );

  const { data: entities } = useEntitiesQuery();
  const activeEntityId = entityId || entities?.[0]?.id;

  const isPublished = !!existingOffer?.offerDetails?.[0]?.publishedAt;

  const createMutation = useCreateOfferMutation();
  const updateMutation = useUpdateOfferMutation();

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
    },
  });

  useEffect(() => {
    if (existingOffer) {
      const detail = existingOffer.offerDetails?.[0];
      form.reset({
        name: existingOffer.name,
        description: existingOffer.description || "",
        startDate: detail?.startDate ? new Date(detail.startDate) : new Date(),
        endDate: detail?.endDate ? new Date(detail.endDate) : new Date(),
        isActive: existingOffer.isActive,
        isPublic: detail?.isPublic || false,
        mediaIds: (detail?.attachments || []).filter(
          (id) => !id.includes("doc"),
        ), // Simple filter logic
        documentIds: (detail?.attachments || []).filter((id) =>
          id.includes("doc"),
        ),
        relations:
          existingOffer.offerRelations?.map((r) => {
            let rId = r.relationId;
            let rType = r.relationType;

            if (!rId) {
              if (r.categoryId) {
                rId = r.categoryId;
                rType = "CATEGORY";
              } else if (r.brandId) {
                rId = r.brandId;
                rType = "BRAND";
              } else if (r.specificationId) {
                rId = r.specificationId;
                rType = "SPECIFICATION";
              } else if (r.itemId) {
                rId = r.itemId;
                rType = "ITEM";
              } else if (r.itemListingId) {
                rId = r.itemListingId;
                rType = "ITEM_LISTING";
              }
            }

            return { relationType: rType, relationId: rId };
          }) || [],
        pincodeIds:
          existingOffer.offerRegions?.map((r: OfferRegion) => r.pincodeId) ||
          [],
      });
    }
  }, [existingOffer, form]);

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
      pincodeIds: values.pincodeIds,
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
                        <Input placeholder="Summer Sale" {...field} />
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
                        <Textarea placeholder="Details..." {...field} />
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
                              disabled={(date) => date < new Date("1900-01-01")}
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
                              disabled={(date) => date < new Date("1900-01-01")}
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
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <FormLabel>Type</FormLabel>
                    <Select
                      disabled={isPublished}
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
                        <SelectItem value="CATEGORY">Category</SelectItem>
                        <SelectItem value="BRAND">Brand</SelectItem>
                        <SelectItem value="SPECIFICATION">
                          Specification
                        </SelectItem>
                        <SelectItem value="ITEM">Item</SelectItem>
                        <SelectItem value="ITEM_LISTING">Listing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex-[2]">
                    <FormLabel>
                      Select{" "}
                      {selectedRelationType.toLowerCase().replace("_", " ")}s
                    </FormLabel>
                    <MultiSelectCombobox
                      className={cn(
                        isPublished && "opacity-60 cursor-not-allowed",
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
                                    label: `${l.item?.name || l.id} - ${l.item_rate?.rate || "No rate"}`,
                                  }))) || []
                      }
                      selectedIds={form
                        .watch("relations")
                        .filter((r) => r.relationType === selectedRelationType)
                        .map((r) => r.relationId)}
                      onToggle={isPublished ? () => {} : toggleRelation}
                      placeholder={`Select ${selectedRelationType.toLowerCase().replace("_", " ")}s...`}
                    />
                  </div>
                </div>

                <div className="border rounded-md p-4 min-h-[100px] space-y-2">
                  {form
                    .watch("relations")
                    .map(
                      (
                        r: { relationType: string; relationId: string },
                        i: number,
                      ) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="mr-2 mb-2 p-2 gap-2"
                        >
                          <span className="font-bold text-[10px] uppercase text-muted-foreground mr-1">
                            {r.relationType}
                          </span>
                          {getRelationName(r.relationType, r.relationId)}
                          {!isPublished && (
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => handleRemoveRelation(i)}
                            />
                          )}
                        </Badge>
                      ),
                    )}
                  {form.watch("relations").length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No relations selected. Offer might apply generally?
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Applicable Regions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    isPublished && "pointer-events-none opacity-60",
                  )}
                >
                  <PincodeSelector
                    selectedIds={form.watch("pincodeIds")}
                    onToggle={(id) => {
                      if (isPublished) return;
                      const current = form.getValues("pincodeIds") || [];
                      if (current.includes(id)) {
                        form.setValue(
                          "pincodeIds",
                          current.filter((i) => i !== id),
                        );
                      } else {
                        form.setValue("pincodeIds", [...current, id]);
                      }
                    }}
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
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((id) => (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-2 border rounded text-xs"
                          >
                            <ImageIcon className="h-3 w-3" /> {id.slice(0, 8)}
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
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
