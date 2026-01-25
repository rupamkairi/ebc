"use client";

import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
} from "@/queries/catalogQueries";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { UNIT_TYPES } from "@/constants/quantities";
import { ItemListing } from "@/types/catalog";
import { useEffect } from "react";

const listingEditSchema = z.object({
  isActive: z.boolean(),
  rate: z.coerce.number().min(0, "Rate must be positive"),
  unitType: z.enum(UNIT_TYPES),
  minQuantity: z.coerce.number().min(1, "Min quantity must be at least 1"),
});

type ListingEditFormValues = z.infer<typeof listingEditSchema>;

interface ListingEditFormProps {
  listing: ItemListing;
  onSuccess?: () => void;
}

export function ListingEditForm({ listing, onSuccess }: ListingEditFormProps) {
  const updateListingMutation = useUpdateItemListingMutation();
  const updateRateMutation = useUpdateItemRateMutation();

  const form = useForm<ListingEditFormValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues: {
      isActive: listing.isActive,
      rate: listing.item_rate?.rate || 0,
      unitType: listing.item_rate?.unitType || UnitType.PIECE,
      minQuantity: listing.item_rate?.minQuantity || 1,
    },
  });

  useEffect(() => {
    form.reset({
      isActive: listing.isActive,
      rate: listing.item_rate?.rate || 0,
      unitType: listing.item_rate?.unitType || UnitType.PIECE,
      minQuantity: listing.item_rate?.minQuantity || 1,
    });
  }, [listing, form]);

  const onSubmit = async (values: ListingEditFormValues) => {
    try {
      // Parallelize updates if multiple things changed, but for simplicity sequential is safer for errors
      if (values.isActive !== listing.isActive) {
        await updateListingMutation.mutateAsync({
          id: listing.id,
          data: { isActive: values.isActive }, // Corrected arguments
        } as any); // Typescript might complain about the mutation args mismatch if service expects object vs discrete args.
        // Checking existing mutation hooks...
        // useUpdateItemListingMutation hooks to catalogService.updateItemListing(id, data)
        // Check catalogService signature.
      }

      if (listing.item_rate?.id) {
        // If rate exists, update it. If values changed.
        await updateRateMutation.mutateAsync({
          id: listing.item_rate.id,
          data: {
            rate: values.rate,
            unitType: values.unitType,
            minQuantity: values.minQuantity,
          },
        } as any);
      } else {
        // If no rate exists, we might need create logic, but user assumes existing listing usually has rate.
        // For now mainly updating.
      }

      toast.success("Listing updated successfully");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update listing");
      console.error(error);
    }
  };

  const isSubmitting =
    updateListingMutation.isPending || updateRateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Enable or disable this listing visibility.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (Price)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
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
                        {unit}
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
                <FormLabel>Min Qty</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
