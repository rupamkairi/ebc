"use client";

import { AdminManagersTable } from "@/components/admin/admin-managers-table";
import { CreateAdminManagerForm } from "@/components/admin/create-admin-manager-form";

export default function AdminManagersPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Managers</h2>
          <p className="text-muted-foreground">
            Manage admin managers and their roles.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateAdminManagerForm />
        </div>
      </div>
      {/* <Separator /> */}
      <AdminManagersTable />
    </div>
  );
}
