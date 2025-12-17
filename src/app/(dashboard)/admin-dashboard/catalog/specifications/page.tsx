import { SpecificationTable } from "@/components/admin/catalog/specification-table";
import { CreateSpecificationForm } from "@/components/admin/catalog/create-specification-form";

export default function SpecificationsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Specifications</h2>
          <p className="text-muted-foreground">
            Manage product specifications.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateSpecificationForm />
        </div>
      </div>
      <SpecificationTable />
    </div>
  );
}
