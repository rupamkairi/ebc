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
      <div className="bg-[#445EB4] p-4">
        <h2 className="text-white font-black text-2xl tracking-tight">Materials</h2>
      </div>

      <div className="p-4 flex flex-col gap-8">
        {/* Categories Section */}
        <div>
          <h3 className="text-[#445EB4] font-black text-lg mb-2">Filter</h3>
           <Separator className="mb-4 bg-slate-100" />
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Categories</h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
             {categories?.map((cat) => {
               const isActive = params.parentCategory === cat.id;
               return (
                 <div 
                   key={cat.id} 
                   className="flex items-center gap-2 group cursor-pointer"
                   onClick={() => handleCategoryChange(cat.id)}
                 >
                    <div className={cn(
                      "size-4 rounded border transition-colors",
                      isActive ? "bg-[#FFA500] border-[#FFA500]" : "border-slate-300 group-hover:border-[#FFA500]"
                    )} />
                    <span className={cn(
                      "text-[11px] font-bold transition-colors uppercase",
                      isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                    )}>
                      {cat.name}
                    </span>
                 </div>
               );
             })}
             {(!categories || categories.length === 0) && (
               <p className="text-[10px] text-slate-400 italic">No categories available</p>
             )}
          </div>
        </div>

        {/* Brands Section */}
        <div>
          <h3 className="text-[#445EB4] font-black text-lg mb-2">Brands</h3>
          <Separator className="mb-4 bg-slate-100" />
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">Brand Filter</h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {facets?.brands.map((brand) => {
              const isChecked = params.brand.includes(brand.value);
              return (
                <div key={brand.value} className="flex items-center gap-2 group cursor-pointer" onClick={() => handleBrandChange(brand.value, !isChecked)}>
                   <div className={cn(
                     "size-4 rounded border flex items-center justify-center transition-all",
                     isChecked ? "bg-[#FFA500] border-[#FFA500] text-white" : "border-slate-300 group-hover:border-[#FFA500]"
                   )}>
                     {isChecked && <Check className="size-2.5" />}
                   </div>
                   <span className={cn(
                     "text-[11px] font-bold transition-colors uppercase",
                     isChecked ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                   )}>
                     {brand.label}
                   </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
