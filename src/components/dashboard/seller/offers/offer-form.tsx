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
  Image as ImageIcon,
  X,
  Plus,
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
import { useItemListingsQuery } from "@/queries/catalogQueries"; // Assuming these exist
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

// Helper Component for Pincode Selection
function PincodeSelector({
  selectedIds,
  onSelect,
  onRemove,
}: {
  selectedIds: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: pincodes, isLoading } = usePincodeRecordsQuery({
    search: search,
    perPage: 10,
  });

  // De-bounce search could be added here if needed, relying on query cache/debounce

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Select Pincodes...
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search pincode or district..."
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading..." : "No pincode found."}
              </CommandEmpty>
              <CommandGroup>
                {pincodes?.map((pincode) => (
                  <CommandItem
                    key={pincode.id}
                    value={pincode.pincode}
                    onSelect={() => {
                      onSelect(pincode.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(pincode.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {pincode.pincode} - {pincode.district}, {pincode.state}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id) => (
          <Badge key={id} variant="secondary" className="gap-2">
            {/* We might not have the full object here if it wasn't in the search results recently, 
                             but ideally we should fetch selected details. 
                             For now showing ID or "Pincode" unless we store name in form too. 
                             Or we can lookup in cache.
                         */}
            Pincode {id.slice(0, 5)}...
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => onRemove(id)}
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
      form.reset({
        name: existingOffer.name,
        description: existingOffer.description || "",
        startDate: new Date(existingOffer.startDate),
        endDate: new Date(existingOffer.endDate),
        isActive: existingOffer.isActive,
        isPublic: existingOffer.isPublic,
        mediaIds:
          existingOffer.attachments?.filter((id) => !id.includes("doc")) || [], // Naive filter, usually would separate
        documentIds: [], // TODO: Separate attachments if backend returns mixed
        relations: existingOffer.relations.map((r) => ({
          relationType: r.relationType,
          relationId: r.relationId,
        })),
        pincodeIds: existingOffer.regions.map((r) => r.pincodeId),
      });
    }
  }, [existingOffer, form]);

  // Relation Selectors Data
  const { data: categories } = useCategoriesQuery();
  const { data: brands } = useBrandsQuery();
  const { data: specifications } = useSpecificationsQuery();
  const { data: items } = useItemsQuery();
  const { data: listings } = useItemListingsQuery(); // Might need huge list or search
  // regions handled via pincode search ideally, but for now assuming list or manual entry

  const [selectedRelationType, setSelectedRelationType] = useState<
    "CATEGORY" | "BRAND" | "SPECIFICATION" | "ITEM" | "ITEM_LISTING"
  >("CATEGORY");
  const [selectedRelationId, setSelectedRelationId] = useState<string>("");

  const handleAddRelation = () => {
    if (!selectedRelationId) return;
    const current = form.getValues("relations");
    if (
      !current.find(
        (r) =>
          r.relationType === selectedRelationType &&
          r.relationId === selectedRelationId,
      )
    ) {
      form.setValue("relations", [
        ...current,
        { relationType: selectedRelationType, relationId: selectedRelationId },
      ]);
    }
    setSelectedRelationId("");
  };

  const handleRemoveRelation = (index: number) => {
    const current = form.getValues("relations");
    form.setValue(
      "relations",
      current.filter((_, i) => i !== index),
    );
  };

  const getRelationName = (type: string, id: string) => {
    switch (type) {
      case "CATEGORY":
        return categories?.find((c) => c.id === id)?.name || id;
      case "BRAND":
        return brands?.find((b) => b.id === id)?.name || id;
      case "SPECIFICATION":
        return specifications?.find((s) => s.id === id)?.name || id;
      case "ITEM":
        return items?.find((i) => i.name === id)?.name || id; // Item might not have generic name id match easily
      case "ITEM_LISTING":
        return listings?.find((l) => l.id === id)?.item?.name || id;
      default:
        return id;
    }
  };

  const onSubmit = (values: OfferFormValues) => {
    const payload = {
      entityId: entityId || "current-user-entity", // Should come from props or store
      name: values.name,
      description: values.description,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      isActive: values.isActive,
      isPublic: values.isPublic,
      attachments: [...values.mediaIds, ...values.documentIds],
      relations: values.relations,
      pincodeIds: values.pincodeIds,
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
                    <FormLabel>Item</FormLabel>
                    <Select
                      value={selectedRelationId}
                      onValueChange={setSelectedRelationId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRelationType === "CATEGORY" &&
                          categories?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        {selectedRelationType === "BRAND" &&
                          brands?.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        {selectedRelationType === "SPECIFICATION" &&
                          specifications?.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        {selectedRelationType === "ITEM" &&
                          items?.map((i) => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                        {selectedRelationType === "ITEM_LISTING" &&
                          listings?.map((l) => (
                            <SelectItem key={l.id} value={l.id}>
                              {l.item?.name || l.id} - {l.item_rate?.rate}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={handleAddRelation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md p-4 min-h-[100px] space-y-2">
                  {form.watch("relations").map((r, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="mr-2 mb-2 p-2 gap-2"
                    >
                      <span className="font-bold text-[10px] uppercase text-muted-foreground mr-1">
                        {r.relationType}
                      </span>
                      {getRelationName(r.relationType, r.relationId)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveRelation(i)}
                      />
                    </Badge>
                  ))}
                  {form.watch("relations").length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No relations selected. Offer might apply generally?
                    </p>
                  )}
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
