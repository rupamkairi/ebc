"use client";

import { SubCategoryTable } from "@/components/admin/catalog/sub-category-table";
import { SubCategoryForm } from "@/components/admin/catalog/create-sub-category-form";

export default function SubCategoriesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sub Categories</h2>
          <p className="text-muted-foreground">
            Manage sub-categories under main categories.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SubCategoryForm />
        </div>
      </div>
      <SubCategoryTable />
    </div>
  );
}
