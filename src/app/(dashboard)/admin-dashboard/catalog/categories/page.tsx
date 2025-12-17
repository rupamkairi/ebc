import { CategoryTable } from "@/components/admin/catalog/category-table";
import { CreateCategoryForm } from "@/components/admin/catalog/create-category-form";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product and service categories.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateCategoryForm />
        </div>
      </div>
      <CategoryTable />
    </div>
  );
}
