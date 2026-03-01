"use client";

import { useState } from "react";
import { CategorySearchAutocomplete } from "@/components/autocompletes/category-search-autocomplete";
import { BrandSearchAutocomplete } from "@/components/autocompletes/brand-search-autocomplete";
import { SpecificationSearchAutocomplete } from "@/components/autocompletes/specification-search-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useItemsQuery } from "@/queries/catalogQueries";
import { Item } from "@/types/catalog";
import { Loader2, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ITEM_TYPE } from "@/constants/enums";

import { Product } from "@/queries/browse.queries";
import { AddToEnquiryModal } from "@/components/browse/add-to-enquiry-modal";

interface EnquiryItemSearchProps {
  onItemSelect?: (item: Item) => void;
  className?: string;
}

export function EnquiryItemSearch({
  onItemSelect,
  className,
}: EnquiryItemSearchProps) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [specificationId, setSpecificationId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectItem = (item: Item) => {
    // Adapter to match Product interface expected by Modal
    const product: Product = {
      id: item.id,
      title: item.name,
      description: item.description || "",
      price: 0,
      image:
        item.brand?.brandLogo?.url ||
        item.category?.categoryIcon?.url ||
        "https://placehold.co/300x300",
      category: item.category?.name || "Unknown",
      categoryName:
        item.category?.parentCategory?.name ||
        (item.category?.parentCategoryId
          ? "Unknown Parent"
          : item.category?.name || "Unknown"),
      subCategoryName: item.category?.parentCategoryId
        ? item.category?.name
        : undefined,
      categoryId: item.category?.parentCategoryId || item.categoryId,
      subCategoryId: item.category?.parentCategoryId
        ? item.categoryId
        : undefined,
      brand: item.brand?.name || "Unknown",
      rating: 0,
      type: (item.type?.toLowerCase() === "service" ? "service" : "product") as
        | "product"
        | "service",
    };

    setSelectedProduct(product);
    setIsModalOpen(true);
    onItemSelect?.(item);
  };

  const isSearchValid = search.length >= 3;

  const { data: items, isLoading } = useItemsQuery({
    categoryId: categoryId || undefined,
    brandId: brandId || undefined,
    specificationId: specificationId || undefined,
    search: isSearchValid ? search : undefined,
    type: ITEM_TYPE.PRODUCT,
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Choose Items Blue Section */}
      <div className="rounded-4xl bg-linear-to-br from-[#0F28A9] to-[#0A1B75] p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        {/* Subtle Background Pattern/Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/20 pb-4">
            <Search className="size-8 text-white" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
              Choose Items to Enquire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 group">
              <Label className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase pl-1">
                Sub Category
              </Label>
              <div className="relative">
                <CategorySearchAutocomplete
                  value={categoryId}
                  onValueChange={setCategoryId}
                  placeholder="Select Sub Category"
                  additionalParams={{ isSubCategory: true }}
                  className="bg-white dark:bg-white hover:bg-white dark:hover:bg-white border-none h-14 rounded-xl text-[#3D52A0] font-bold shadow-lg focus:ring-2 focus:ring-[#FFA500]"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase pl-1">
                Brand
              </Label>
              <BrandSearchAutocomplete
                value={brandId}
                onValueChange={setBrandId}
                placeholder="Select Brand"
                className="bg-white dark:bg-white hover:bg-white dark:hover:bg-white border-none h-14 rounded-xl text-[#3D52A0] font-bold shadow-lg focus:ring-2 focus:ring-[#FFA500]"
              />
            </div>

            <div className="space-y-2 group">
              <Label className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase pl-1">
                Specification
              </Label>
              <SpecificationSearchAutocomplete
                value={specificationId}
                onValueChange={setSpecificationId}
                placeholder="Select Specification"
                className="bg-white dark:bg-white hover:bg-white dark:hover:bg-white border-none h-14 rounded-xl text-[#3D52A0] font-bold shadow-lg focus:ring-2 focus:ring-[#FFA500]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase pl-1">
              Item Search
            </Label>
            <div className="relative group">
              <Input
                placeholder="Enter Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white border-none h-14 rounded-xl pl-12 text-[#3D52A0] font-bold shadow-lg focus:ring-2 focus:ring-[#FFA500] placeholder:text-[#3D52A0]/30"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#3D52A0]/40 group-focus-within:text-[#FFA500] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-[#3D52A0]/20">
            <Loader2 className="size-10 animate-spin text-[#3D52A0] mb-3" />
            <p className="text-[#3D52A0] font-bold italic">
              Searching for items...
            </p>
          </div>
        ) : items && items.length > 0 ? (
          <div className="max-h-[500px] overflow-y-auto rounded-3xl border border-[#3D52A0]/10 bg-white/50 backdrop-blur-sm p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#3D52A0]/20 scrollbar-track-transparent">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-white shadow-sm ring-1 ring-[#3D52A0]/5 hover:ring-[#FFA500]/50 hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#3D52A0]/5 p-3 rounded-xl group-hover:bg-[#FFA500] group-hover:text-white transition-all duration-300">
                    <Package className="size-6" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-[#3D52A0] text-lg leading-tight">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mt-1">
                      {item.brand && (
                        <span className="flex items-center gap-1 bg-[#3D52A0]/5 px-2 py-0.5 rounded-md">
                          {item.brand.name}
                        </span>
                      )}
                      {item.category && (
                        <span className="flex items-center gap-1 bg-[#3D52A0]/5 px-2 py-0.5 rounded-md">
                          {item.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleSelectItem(item)}
                  className="rounded-xl bg-[#3D52A0] hover:bg-[#FFA500] text-white font-bold h-11 px-6 shadow-lg shadow-[#3D52A0]/10 hover:shadow-[#FFA500]/20 transition-all duration-300 transform group-hover:scale-105 active:scale-95"
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        ) : isSearchValid ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-[#3D52A0]/20">
            <Package className="size-10 text-[#3D52A0]/30 mb-3" />
            <p className="text-[#3D52A0] font-bold opacity-60">
              No items found matching your search.
            </p>
          </div>
        ) : null}
      </div>

      {selectedProduct && (
        <AddToEnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
