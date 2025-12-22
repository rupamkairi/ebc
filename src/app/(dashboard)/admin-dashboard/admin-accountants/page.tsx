"use client";

import { AdminAccountantsTable } from "@/components/admin/admin-accountants-table";
import { CreateAdminAccountantForm } from "@/components/admin/create-admin-accountant-form";

export default function AdminAccountantsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Admin Accountants
          </h2>
          <p className="text-muted-foreground">
            Manage admin accountants and their roles.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateAdminAccountantForm />
        </div>
      </div>
      <AdminAccountantsTable />
    </div>
  );
}
