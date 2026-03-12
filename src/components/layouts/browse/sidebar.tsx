import { useBrowseParams } from "@/hooks/useBrowseParams";
import { Facet } from "@/queries/browse.queries";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories?: { id: string; name: string }[];
  facets?: {
    brands: Facet[];
    specifications: Facet[];
  };
  isLoading?: boolean;
}

export function Sidebar({ categories, facets, isLoading }: SidebarProps) {
  const { params, updateParams } = useBrowseParams();

  const handleCategoryChange = (catId: string) => {
    updateParams({ parentCategory: catId, subCategory: [] });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const current = params.brand;
    let next: string[];
    if (checked) {
      next = [...current, brand];
    } else {
      next = current.filter((b) => b !== brand);
    }
    updateParams({ brand: next });
  };

  const handleSpecificationChange = (spec: string, checked: boolean) => {
    const current = params.specification || [];
    let next: string[];
    if (checked) {
      next = [...current, spec];
    } else {
      next = current.filter((s) => s !== spec);
    }
    updateParams({ specification: next });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-muted rounded-md"></div>
        <div className="h-40 bg-muted rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* Sidebar Header */}
      <div className="bg-primary p-4">
        <h2 className="text-white font-black text-2xl tracking-tight">
          Filters
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-8">
        {/* Categories Section */}
        <div>
          <h3 className="text-primary font-black text-lg mb-2">Categories</h3>
          <Separator className="mb-4 bg-slate-100" />
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {categories?.map((cat) => {
              const isActive = params.parentCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <div
                    className={cn(
                      "size-4 rounded border transition-colors",
                      isActive
                        ? "bg-secondary border-secondary"
                        : "border-slate-300 group-hover:border-secondary",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-bold transition-colors uppercase",
                      isActive
                        ? "text-slate-900"
                        : "text-slate-600 group-hover:text-slate-900",
                    )}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
            {(!categories || categories.length === 0) && (
              <p className="text-[10px] text-slate-400 italic">
                No categories available
              </p>
            )}
          </div>
        </div>

        {/* Brands Section */}
        {facets?.brands && facets.brands.length > 0 && (
          <div>
            <h3 className="text-primary font-black text-lg mb-2">Brands</h3>
            <Separator className="mb-4 bg-slate-100" />
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {facets.brands.map((brand) => {
                const isChecked = params.brand.includes(brand.value);
                return (
                  <div
                    key={brand.value}
                    className="flex items-center gap-2 group cursor-pointer"
                    onClick={() => handleBrandChange(brand.value, !isChecked)}
                  >
                    <div
                      className={cn(
                        "size-4 rounded border flex items-center justify-center transition-all",
                        isChecked
                          ? "bg-secondary border-secondary text-white"
                          : "border-slate-300 group-hover:border-secondary",
                      )}
                    >
                      {isChecked && <Check className="size-2.5" />}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-bold transition-colors uppercase",
                        isChecked
                          ? "text-slate-900"
                          : "text-slate-600 group-hover:text-slate-900",
                      )}
                    >
                      {brand.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Specifications Section */}
        {facets?.specifications && facets.specifications.length > 0 && (
          <div>
            <h3 className="text-primary font-black text-lg mb-2">
              Specifications
            </h3>
            <Separator className="mb-4 bg-slate-100" />
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {facets.specifications.map((spec) => {
                const isChecked = (params.specification || []).includes(
                  spec.value,
                );
                return (
                  <div
                    key={spec.value}
                    className="flex items-center gap-2 group cursor-pointer"
                    onClick={() => handleSpecificationChange(spec.value, !isChecked)}
                  >
                    <div
                      className={cn(
                        "size-4 rounded border flex items-center justify-center transition-all",
                        isChecked
                          ? "bg-secondary border-secondary text-white"
                          : "border-slate-300 group-hover:border-secondary",
                      )}
                    >
                      {isChecked && <Check className="size-2.5" />}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-bold transition-colors uppercase",
                        isChecked
                          ? "text-slate-900"
                          : "text-slate-600 group-hover:text-slate-900",
                      )}
                    >
                      {spec.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
