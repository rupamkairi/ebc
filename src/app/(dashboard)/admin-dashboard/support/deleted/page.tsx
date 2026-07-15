import AdminSupportInbox from "@/components/admin/support/support-inbox";

export default function DeletedSupportTicketsPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Deleted Tickets</h1>
        <p className="text-muted-foreground">Read-only support ticket archive with complete conversations.</p>
      </div>
      <AdminSupportInbox archived />
    </div>
  );
}
