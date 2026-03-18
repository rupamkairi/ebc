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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useUpdateItemListingMutation,
  useUpdateItemRateMutation,
  useUpdateItemRegionMutation,
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  FileText,
  Image as ImageIcon,
  X,
  DollarSign,
  Scale,
} from "lucide-react";

import { ItemListing } from "@/types/catalog";
import { useEffect, useState, useRef } from "react";
import { UNIT_TYPES, UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { PincodeRecord } from "@/types/region";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { Badge } from "@/components/ui/badge";
import { RegionSelectionStep } from "./region-selection-step";
import { ITEM_TYPE } from "@/constants/enums";


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

const getAttachmentIds = (listing: ItemListing): { mediaIds: string[]; documentIds: string[] } => {
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

  const isService = listing.item?.type === ITEM_TYPE.SERVICE;

  // Derive allowed unit types from the listing's item/specification
  const allowedUnits: UnitType[] | undefined = (() => {
    const item = listing.item;
    if (!item) return undefined;
    if (item.acceptableUnitTypes?.length) return item.acceptableUnitTypes as UnitType[];
    if (item.specification?.acceptableUnitTypes?.length)
      return item.specification.acceptableUnitTypes as UnitType[];
    return undefined;
  })();

  // Which units to show in the dropdown
  const visibleUnits =
    allowedUnits && allowedUnits.length > 0
      ? UNIT_TYPES.filter((u) => allowedUnits.includes(u))
      : UNIT_TYPES;

  const [activeTab, setActiveTab] = useState("general");

  // Region Selection Local State
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<PincodeRecord[]>([]);
  const lastInitializedId = useRef<string | null>(null);

  const { data: records, isLoading: isLoadingRegions } = usePincodeRecordsQuery(
    {
      state: selectedState,
      district: selectedDistrict,
      pincode: pincodeSearch.length >= 3 ? pincodeSearch : undefined,
    },
  );

  const form = useForm<ListingEditFormValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues: getInitialFormValues(listing),
  });

  useEffect(() => {
    if (!listing || lastInitializedId.current === listing.id) return;

    lastInitializedId.current = listing.id;

    form.reset(getInitialFormValues(listing));

    if (listing.itemRegions) {
      setSelectedRegions(
        listing.itemRegions.map((ir) => {
          const pincodeData =
            typeof ir.pincode === "object" ? ir.pincode : null;
          return {
            id: ir.pincodeId || "",
            pincode:
              pincodeData?.pincode ||
              ir.pincode?.toString() ||
              "Pincode ID: " + ir.pincodeId,
            district: pincodeData?.district || ir.district || "District",
            state: pincodeData?.state || ir.state || "State",
          } as PincodeRecord;
        }),
      );
    }
  }, [listing.id]); // Removed form.reset to avoid potential unstable reference issues

  const toggleRegion = (record: PincodeRecord) => {
    setSelectedRegions((prev) =>
      prev.some((r) => r.id === record.id)
        ? prev.filter((r) => r.id !== record.id)
        : [...prev, record],
    );
  };

  const removeRegion = (id: string) => {
    setSelectedRegions((prev) => prev.filter((r) => r.id !== id));
  };

  const onSubmit: SubmitHandler<ListingEditFormValues> = async (values) => {
    const toastId = toast.loading("Saving listing changes...");
    try {
      // 1. Update Listing Basic & Attachments
      await updateListingMutation.mutateAsync({
        id: listing.id,
        data: {
          isActive: values.isActive,
          mediaIds: values.mediaIds,
          documentIds: values.documentIds,
        },
      });

      // 2. Update Rate Info (only for products, not services)
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

      // 3. Update Regions
      await updateRegionMutation.mutateAsync({
        id: listing.id,
        data: {
          itemListingId: listing.id,
          regions: selectedRegions.map((r) => ({
            pincodeId: r.id,
            state: r.state,
            district: r.district,
            wholeState: false,
            wholeDistrict: false,
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

  const onInvalid = (errors: any) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Please fill all required fields correctly.");
  };

  const isSubmitting =
    updateListingMutation.isPending ||
    updateRateMutation.isPending ||
    updateRegionMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-muted/30 p-4 rounded-lg border flex items-center gap-4">
        <div className="h-12 w-12 rounded-md bg-background border shadow-sm flex items-center justify-center text-primary">
          <Package size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold">{listing.item?.name}</h4>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General & Rates</TabsTrigger>
              <TabsTrigger value="attachments">Brochures & Media</TabsTrigger>
              <TabsTrigger value="regions">Service Area</TabsTrigger>
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
                  {/* Info banner when unit types are restricted by the backend */}
                  {allowedUnits && allowedUnits.length > 0 && (
                    <div className="col-span-full flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-primary">
                      <Scale size={14} className="mt-0.5 shrink-0" />
                      <span>
                        This item can only be listed in:{" "}
                        <strong>
                          {allowedUnits.map((u) => UNIT_TYPE_LABELS[u]).join(", ")}
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibleUnits.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {UNIT_TYPE_LABELS[unit]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Min Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                          <DollarSign size={14} className="text-primary" /> Base
                          Rate
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-[10px]">
                          Per {UNIT_TYPE_LABELS[form.watch("unitType") || "Nos"]}
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
                {/* Media Section */}
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

                {/* Documents Section */}
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
              <RegionSelectionStep
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                pincodeSearch={pincodeSearch}
                setPincodeSearch={setPincodeSearch}
                isLoadingRegions={isLoadingRegions}
                records={records}
                selectedRegions={selectedRegions}
                toggleRegion={toggleRegion}
                removeRegion={removeRegion}
                setSelectedRegions={setSelectedRegions}
                onBack={() => setActiveTab("attachments")}
                onComplete={() => form.handleSubmit(onSubmit)()}
                isSubmitting={isSubmitting}
                hideButtons={true}
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
