import { ItemTable } from "@/components/admin/catalog/item-table";
import { ItemForm } from "@/components/admin/catalog/create-item-form";
import { ItemSearch } from "@/components/search/item-search/item-search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ItemsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Items</h2>
          <p className="text-muted-foreground">Manage catalog items.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Search className="size-4" />
                Advanced Search
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advanced Item Search</DialogTitle>
                <DialogDescription>
                  Filter items by category, brand, or specification and perform
                  a manual search.
                </DialogDescription>
              </DialogHeader>
              <ItemSearch />
            </DialogContent>
          </Dialog>
          <ItemForm />
        </div>
      </div>
      <ItemTable />
    </div>
  );
}
