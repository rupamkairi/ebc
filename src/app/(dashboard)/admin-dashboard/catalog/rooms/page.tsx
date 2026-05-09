"use client";

import { RoomTable } from "@/components/admin/catalog/room-table";
import { RoomForm } from "@/components/admin/catalog/room-form";

export default function RoomsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rooms</h2>
          <p className="text-muted-foreground">
            Manage rooms for grouping categories and items.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <RoomForm />
        </div>
      </div>
      <RoomTable />
    </div>
  );
}
