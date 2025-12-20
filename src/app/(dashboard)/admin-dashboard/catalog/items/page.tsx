import { ItemTable } from "@/components/admin/catalog/item-table";
import { ItemForm } from "@/components/admin/catalog/create-item-form";

export default function ItemsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Items</h2>
          <p className="text-muted-foreground">Manage catalog items.</p>
        </div>
        <div className="flex items-center space-x-2">
          <ItemForm />
        </div>
      </div>
      <ItemTable />
    </div>
  );
}
