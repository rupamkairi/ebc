import { BrandTable } from "@/components/admin/catalog/brand-table";
import { BrandForm } from "@/components/admin/catalog/create-brand-form";

export default function BrandsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">Manage brands.</p>
        </div>
        <div className="flex items-center space-x-2">
          <BrandForm />
        </div>
      </div>
      <BrandTable />
    </div>
  );
}
