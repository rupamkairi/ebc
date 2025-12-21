"use client";

import { AdminExecutivesTable } from "@/components/admin/admin-executives-table";
import { CreateAdminExecutiveForm } from "@/components/admin/create-admin-executive-form";

export default function AdminExecutivesPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Admin Executives
          </h2>
          <p className="text-muted-foreground">
            Manage admin executives and their roles.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateAdminExecutiveForm />
        </div>
      </div>
      <AdminExecutivesTable />
    </div>
  );
}
