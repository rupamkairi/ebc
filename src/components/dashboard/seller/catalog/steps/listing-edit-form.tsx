"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  useUpdateItemListingMutation,
  useUpdateItemRateMutation,
  useUpdateItemRegionMutation,
} from "@/queries/catalogQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useEntityRegionsQuery } from "@/queries/entityRegionQueries";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  FileText,
  Image as ImageIcon,
  X,
  Scale,
  IndianRupee,
} from "lucide-react";

import { ItemListing } from "@/types/catalog";
import { useState } from "react";
import { formatUnitType, UNIT_TYPES, UnitType } from "@/constants/quantities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { Badge } from "@/components/ui/badge";
import { ITEM_TYPE } from "@/constants/enums";
import { RegionScopeInput, RegionScopeType, EntityRegion } from "@/types/region";
import { EntityRegionSelector } from "@/components/shared/region/entity-region-selector";
import { ItemRegion } from "@/types/catalog";
import { UnitTypeSelect } from "@/components/shared/unit-type-select";

const listingEditSchema = z.object({
  isActive: z.boolean(),
  unitType: z.enum(UNIT_TYPES).optional(),
  minQuantity: z.number().min(1).optional(),
  rate: z.number().min(0).optional(),
  isNegotiable: z.boolean().optional(),
  mediaIds: z.array(z.string()),
  documentIds: z.array(z.string()),
});

interface ListingEditFormValues {
  isActive: boolean;
  unitType?: (typeof UNIT_TYPES)[number];
  minQuantity?: number;
  rate?: number;
  isNegotiable?: boolean;
  mediaIds: string[];
  documentIds: string[];
}

interface ListingEditFormProps {
  listing: ItemListing;
  onSuccess?: () => void;
}

interface AttachmentWithMedia {
  id: string;
  mediaId?: string | null;
  documentId?: string | null;
  media?: { id: string; url: string } | null;
  document?: { id: string; url: string } | null;
}

function mapItemRegionsToScopeInput(itemRegions: ItemRegion[]): RegionScopeInput[] {
  return itemRegions.map((ir) => {
    const pinObj = typeof ir.pincode === "object" && ir.pincode ? ir.pincode : null;
    return {
      scopeType: (ir.scopeType || "PINCODE") as RegionScopeType,
      state: pinObj?.state ?? ir.state ?? null,
      district: pinObj?.district ?? ir.district ?? null,
      pincodeId: ir.pincodeId ?? null,
      pincode: pinObj?.pincode ?? null,
    };
  });
}

function mapEntityRegionsToScopeInput(entityRegions: EntityRegion[]): RegionScopeInput[] {
  return entityRegions.map((er) => ({
    scopeType: er.scopeType,
    state: er.state ?? null,
    district: er.district ?? null,
    pincodeId: er.pincodeId ?? null,
    pincode: er.pincode?.pincode ?? null,
  }));
}

const getAttachmentIds = (
  listing: ItemListing,
): { mediaIds: string[]; documentIds: string[] } => {
  const mediaIds: string[] = [];
  const documentIds: string[] = [];

  if (listing.attachments && listing.attachments.length > 0) {
    listing.attachments.forEach((att: AttachmentWithMedia) => {
      if (att.mediaId && !mediaIds.includes(att.mediaId)) {
        mediaIds.push(att.mediaId);
      }
      if (att.documentId && !documentIds.includes(att.documentId)) {
        documentIds.push(att.documentId);
      }
    });
  }

  return { mediaIds, documentIds };
};

const getInitialFormValues = (listing: ItemListing) => {
  const rate = listing.itemRates?.[0];
  const { mediaIds, documentIds } = getAttachmentIds(listing);

  return {
    isActive: listing.isActive,
    unitType: (rate?.unitType as UnitType) || "Nos",
    minQuantity: rate?.minQuantity || 1,
    rate: rate?.rate || 0,
    isNegotiable: rate?.isNegotiable || false,
    mediaIds,
    documentIds,
  };
};

export function ListingEditForm({ listing, onSuccess }: ListingEditFormProps) {
  const updateListingMutation = useUpdateItemListingMutation();
  const updateRateMutation = useUpdateItemRateMutation();
  const updateRegionMutation = useUpdateItemRegionMutation();

  const { data: entities } = useEntitiesQuery();
  const entity = entities?.[0];
  const { data: entityRegions } = useEntityRegionsQuery(entity?.id);

  const isService = listing.item?.type === ITEM_TYPE.SERVICE;

  const allowedUnits: UnitType[] | undefined = (() => {
    const item = listing.item;
    if (!item) return undefined;
    if (item.acceptableUnitTypes?.length)
      return item.acceptableUnitTypes as UnitType[];
    return undefined;
  })();

  const visibleUnits =
    allowedUnits && allowedUnits.length > 0
      ? UNIT_TYPES.filter((u) => allowedUnits.includes(u))
      : UNIT_TYPES;

  const [activeTab, setActiveTab] = useState("general");

  // Region state — RegionScopeInput[] supports all scope types
  const [selectedRegions, setSelectedRegions] = useState<RegionScopeInput[]>([]);
  const [initListingId, setInitListingId] = useState<string | null>(null);

  // Derived-state init: once per listing.id, from itemRegions or entityRegions fallback
  if (initListingId !== listing.id) {
    if (listing.itemRegions && listing.itemRegions.length > 0) {
      setInitListingId(listing.id);
      setSelectedRegions(mapItemRegionsToScopeInput(listing.itemRegions));
    } else if (entityRegions !== undefined) {
      setInitListingId(listing.id);
      setSelectedRegions(mapEntityRegionsToScopeInput(entityRegions));
    }
    // else: entityRegions still loading — re-evaluates on next render
  }

  const form = useForm<ListingEditFormValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues: getInitialFormValues(listing),
  });

  const onSubmit: SubmitHandler<ListingEditFormValues> = async (values) => {
    const toastId = toast.loading("Saving listing changes...");
    try {
      await updateListingMutation.mutateAsync({
        id: listing.id,
        data: {
          isActive: values.isActive,
          mediaIds: values.mediaIds,
          documentIds: values.documentIds,
        },
      });

      const rateId = listing.itemRates?.[0]?.id;
      if (!isService && rateId && values.unitType !== undefined) {
        await updateRateMutation.mutateAsync({
          id: rateId,
          data: {
            unitType: values.unitType as UnitType,
            minQuantity: values.minQuantity || 1,
            rate: values.rate || 0,
            isNegotiable: values.isNegotiable || false,
          },
        });
      }

      await updateRegionMutation.mutateAsync({
        id: listing.id,
        data: {
          itemListingId: listing.id,
          regions: selectedRegions.map((r) => ({
            scopeType: r.scopeType,
            state: r.state ?? undefined,
            district: r.district ?? undefined,
            pincodeId: r.pincodeId ?? undefined,
          })),
        },
      });

      toast.success("Listing updated successfully", { id: toastId });
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update listing", { id: toastId });
      console.error(error);
    }
  };

  const onInvalid = (errors: unknown) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Please fill all required fields correctly.");
  };

  const isSubmitting =
    updateListingMutation.isPending ||
    updateRateMutation.isPending ||
    updateRegionMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg border flex items-center gap-4">
        <div className="h-12 w-12 rounded-md bg-background border shadow-sm flex items-center justify-center text-primary">
          <Package size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold">{listing.item?.name}</h4>
          <p className="text-[11px] font-medium text-muted-foreground">
            {listing.item?.category?.name} • {listing.item?.brand?.name}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid h-auto min-h-9 w-full grid-cols-3 items-stretch">
              <TabsTrigger
                value="general"
                className="h-auto min-w-0 whitespace-normal break-words px-1 py-2 text-center text-xs leading-tight sm:px-2 sm:text-sm"
              >
                General & Rates
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="h-auto min-w-0 whitespace-normal break-words px-1 py-2 text-center text-xs leading-tight sm:px-2 sm:text-sm"
              >
                Brochures & Media
              </TabsTrigger>
              <TabsTrigger
                value="regions"
                className="h-auto min-w-0 whitespace-normal break-words px-1 py-2 text-center text-xs leading-tight sm:px-2 sm:text-sm"
              >
                Service Area
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-bold text-primary">
                        Active Status
                      </FormLabel>
                      <FormDescription>
                        Control visibility on the marketplace.
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

              {!isService && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allowedUnits && allowedUnits.length > 0 && (
                    <div className="col-span-full flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-primary">
                      <Scale size={14} className="mt-0.5 shrink-0" />
                      <span>
                        This item can only be listed in:{" "}
                        <strong>
                          {allowedUnits
                            .map(formatUnitType)
                            .join(", ")}
                        </strong>
                        . Other unit types have been hidden.
                      </span>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="unitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Unit Type</FormLabel>
                        <FormControl>
                          <UnitTypeSelect
                            value={field.value}
                            onValueChange={field.onChange}
                            units={visibleUnits}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Min Quantity
                        </FormLabel>
                        <FormControl>
                          <NumericInput
                            value={field.value}
                            onValueChange={field.onChange}
                            integer
                            min={1}
                            fallbackValue={1}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold flex items-center gap-2">
                          <IndianRupee size={14} className="text-primary" /> Base
                          Price
                        </FormLabel>
                        <FormControl>
                          <NumericInput
                            value={field.value}
                            onValueChange={field.onChange}
                            step="0.01"
                            min={0}
                            fallbackValue={0}
                          />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                          Per{" "}
                          {formatUnitType(form.watch("unitType") || "Nos")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNegotiable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card mt-2">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold">
                            Negotiable
                          </FormLabel>
                          <FormDescription className="text-[10px]">
                            Price can be negotiated?
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
              )}
            </TabsContent>

            <TabsContent value="attachments" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold flex items-center gap-2">
                          <ImageIcon size={16} className="text-primary" />{" "}
                          Product Images
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          High quality visuals of the item.
                        </p>
                      </div>
                      <FileUploader
                        type="media"
                        variant="multiple"
                        onUploadSuccess={(files: FileUploadResponse[]) => {
                          const newIds = files.map((f) => f.id);
                          const current = form.getValues("mediaIds") || [];
                          form.setValue("mediaIds", [...current, ...newIds], {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.watch("mediaIds").map((id) => (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="gap-2 px-2 py-1 h-8"
                        >
                          <span className="text-[10px] truncate max-w-[80px]">
                            {id}
                          </span>
                          <X
                            size={14}
                            className="cursor-pointer hover:text-destructive"
                            onClick={() => {
                              form.setValue(
                                "mediaIds",
                                form
                                  .getValues("mediaIds")
                                  .filter((m) => m !== id),
                              );
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold flex items-center gap-2">
                          <FileText size={16} className="text-primary" />{" "}
                          Brochures & Specs
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          PDFs, manuals, or technical sheets.
                        </p>
                      </div>
                      <FileUploader
                        type="document"
                        variant="multiple"
                        onUploadSuccess={(files: FileUploadResponse[]) => {
                          const newIds = files.map((f) => f.id);
                          const current = form.getValues("documentIds") || [];
                          form.setValue(
                            "documentIds",
                            [...current, ...newIds],
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          );
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.watch("documentIds").map((id) => (
                        <Badge
                          key={id}
                          variant="outline"
                          className="gap-2 px-2 py-1 h-8 border-primary/20"
                        >
                          <FileText size={12} className="text-primary" />
                          <span className="text-[10px] truncate max-w-[80px]">
                            {id}
                          </span>
                          <X
                            size={14}
                            className="cursor-pointer hover:text-destructive"
                            onClick={() => {
                              form.setValue(
                                "documentIds",
                                form
                                  .getValues("documentIds")
                                  .filter((d) => d !== id),
                              );
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="regions" className="mt-6">
              <EntityRegionSelector
                regions={selectedRegions}
                onChange={setSelectedRegions}
                inheritedRegions={entityRegions ? mapEntityRegionsToScopeInput(entityRegions) : undefined}
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col items-end gap-3 pt-6 border-t">
            {Object.keys(form.formState.errors).length > 0 && (
              <p className="text-xs font-bold text-destructive animate-pulse">
                Please fix errors in:{" "}
                {Object.keys(form.formState.errors).join(", ")}
              </p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px] font-bold"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save All Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
