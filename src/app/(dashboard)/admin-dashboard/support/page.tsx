import AdminSupportInbox from "@/components/admin/support/support-inbox";
import { SupportCategoryManager } from "@/components/admin/support/category-manager";

export default function AdminSupportPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground">Manage and respond to support queries from buyers and sellers.</p>
        </div>
        <SupportCategoryManager />
      </div>
      <AdminSupportInbox />
    </div>
  );
}
