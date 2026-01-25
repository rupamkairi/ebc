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
  Globe,
  FileText,
  Image as ImageIcon,
  MapPin,
  X,
  Search,
} from "lucide-react";
import { ItemListing } from "@/types/catalog";
import { useEffect, useState } from "react";
import { UNIT_TYPES, UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileUploader,
  FileUploadResponse,
} from "@/components/shared/upload/media-uploader";
import { PincodeRecord } from "@/types/region";
import { StateSearchAutocomplete } from "@/components/autocompletes/state-search-autocomplete";
import { DistrictSearchAutocomplete } from "@/components/autocompletes/district-search-autocomplete";
import { usePincodeRecordsQuery } from "@/queries/regionQueries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const listingEditSchema = z.object({
  isActive: z.boolean(),
  unitType: z.enum(UNIT_TYPES),
  minQuantity: z.number().min(1),
  mediaIds: z.array(z.string()),
  documentIds: z.array(z.string()),
});

interface ListingEditFormValues {
  isActive: boolean;
  unitType: (typeof UNIT_TYPES)[number];
  minQuantity: number;
  mediaIds: string[];
  documentIds: string[];
}

interface ListingEditFormProps {
  listing: ItemListing;
  onSuccess?: () => void;
}

export function ListingEditForm({ listing, onSuccess }: ListingEditFormProps) {
  const updateListingMutation = useUpdateItemListingMutation();
  const updateRateMutation = useUpdateItemRateMutation();
  const updateRegionMutation = useUpdateItemRegionMutation();

  const [activeTab, setActiveTab] = useState("general");

  // Region Selection Local State
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<PincodeRecord[]>([]);

  const { data: records, isLoading: isLoadingRegions } = usePincodeRecordsQuery(
    {
      state: selectedState,
      district: selectedDistrict,
      pincode: pincodeSearch.length >= 3 ? pincodeSearch : undefined,
    },
  );

  const form = useForm<ListingEditFormValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues: {
      isActive: listing.isActive,
      unitType: (listing.item_rate?.unitType as UnitType) || "Nos",
      minQuantity: listing.item_rate?.minQuantity || 1,
      mediaIds: listing.mediaIds || [],
      documentIds: listing.documentIds || [],
    },
  });

  useEffect(() => {
    form.reset({
      isActive: listing.isActive,
      unitType: listing.item_rate?.unitType || "Nos",
      minQuantity: listing.item_rate?.minQuantity || 1,
      mediaIds: listing.mediaIds || [],
      documentIds: listing.documentIds || [],
    });

    if (listing.item_region) {
      setSelectedRegions(
        listing.item_region.map(
          (ir) =>
            ({
              id: ir.pincodeId || "",
              pincode: "", // We don't have the pincode text, but we have the ID.
              // In a real app we might fetch the records or just show ID.
              // For now, mapping what we have.
              district: ir.district || "",
              state: ir.state || "",
            }) as PincodeRecord,
        ),
      );
    }
  }, [listing, form]);

  const toggleRegion = (record: PincodeRecord) => {
    setSelectedRegions((prev) =>
      prev.some((r) => r.id === record.id)
        ? prev.filter((r) => r.id !== record.id)
        : [...prev, record],
    );
  };

  const onSubmit: SubmitHandler<ListingEditFormValues> = async (values) => {
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

      // 2. Update Rate Info
      if (listing.item_rate?.id) {
        await updateRateMutation.mutateAsync({
          id: listing.item_rate.id,
          data: {
            unitType: values.unitType as UnitType,
            minQuantity: values.minQuantity,
          },
        });
      }

      // 3. Update Regions (if changed or just always push selected)
      if (selectedRegions.length > 0) {
        await updateRegionMutation.mutateAsync({
          id: listing.id, // Assuming URL endpoint takes itemListingId
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
      }

      toast.success("Listing updated successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update listing");
      console.error(error);
    }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
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
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Listing visibility on current marketplaces.
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UNIT_TYPES.map((unit) => (
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
                      <FormLabel>Min Quantity</FormLabel>
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
              </div>
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
                          form.setValue("mediaIds", [
                            ...form.getValues("mediaIds"),
                            ...newIds,
                          ]);
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
                          form.setValue("documentIds", [
                            ...form.getValues("documentIds"),
                            ...newIds,
                          ]);
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

            <TabsContent value="regions" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 bg-muted/20 p-3 rounded-lg border">
                    <StateSearchAutocomplete
                      value={selectedState}
                      onValueChange={(v) => {
                        setSelectedState(v);
                        setSelectedDistrict("");
                      }}
                    />
                    <DistrictSearchAutocomplete
                      state={selectedState}
                      value={selectedDistrict}
                      onValueChange={setSelectedDistrict}
                      disabled={!selectedState}
                    />
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                        size={14}
                      />
                      <Input
                        placeholder="Search Pincode..."
                        value={pincodeSearch}
                        onChange={(e) => setPincodeSearch(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border overflow-hidden bg-background h-[300px]">
                    <div className="bg-muted p-2 border-b flex justify-between items-center text-[10px] font-bold uppercase">
                      <span>Available</span>
                      {records && (
                        <span className="opacity-50">
                          {records.length} Found
                        </span>
                      )}
                    </div>
                    <ScrollArea className="h-full">
                      {isLoadingRegions ? (
                        <div className="p-10 flex justify-center">
                          <Loader2 className="animate-spin opacity-20" />
                        </div>
                      ) : records && records.length > 0 ? (
                        <div className="divide-y">
                          {records.map((r) => {
                            const isSelected = selectedRegions.some(
                              (sr) => sr.id === r.id,
                            );
                            return (
                              <div
                                key={r.id}
                                onClick={() => toggleRegion(r)}
                                className={cn(
                                  "p-2 text-xs cursor-pointer hover:bg-muted/50 flex items-center gap-3",
                                  isSelected && "bg-primary/5",
                                )}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  className="rounded"
                                />
                                <span className="font-bold">{r.pincode}</span>
                                <span className="text-muted-foreground truncate">
                                  {r.district}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="p-10 text-center text-xs text-muted-foreground italic">
                          Search to find locations
                        </p>
                      )}
                    </ScrollArea>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/5 flex flex-col h-full">
                  <div className="p-3 border-b flex justify-between items-center bg-card">
                    <h5 className="text-xs font-bold flex items-center gap-2">
                      <MapPin size={14} /> Selected ({selectedRegions.length})
                    </h5>
                    {selectedRegions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRegions([])}
                        className="h-6 text-[10px]"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="flex-1 h-[300px] bg-background">
                    {selectedRegions.length > 0 ? (
                      <div className="divide-y">
                        {selectedRegions.map((r) => (
                          <div
                            key={r.id}
                            className="p-2 flex justify-between items-center group hover:bg-muted/30"
                          >
                            <div className="text-[11px]">
                              <p className="font-bold">{r.pincode}</p>
                              <p className="text-muted-foreground">
                                {r.district}, {r.state}
                              </p>
                            </div>
                            <X
                              size={12}
                              className="cursor-pointer opacity-0 group-hover:opacity-100 hover:text-destructive"
                              onClick={() =>
                                setSelectedRegions((prev) =>
                                  prev.filter((x) => x.id !== r.id),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center text-muted-foreground/30 flex flex-col items-center">
                        <Globe size={32} className="mb-2" />
                        <p className="text-[10px] uppercase font-bold">
                          No Areas Selected
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
