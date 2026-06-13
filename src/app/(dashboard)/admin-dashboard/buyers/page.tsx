"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/containers";
import { UserTable } from "@/components/admin/users/user-table";
import { UserDetailsModal } from "@/components/admin/users/user-details-modal";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { filterAdminUsers } from "@/components/admin/users/filter-users";
import { useUsersQuery } from "@/queries/adminQueries";
import { AdminUser } from "@/types/auth";
import { USER_ROLE } from "@/constants/auth";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function BuyersPage() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [phoneVerified, setPhoneVerified] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const { data: users = [], isLoading } = useUsersQuery({
    role: USER_ROLE.USER_BUYER_ADMIN,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const filteredUsers = useMemo(
    () =>
      filterAdminUsers(users, debouncedSearch, {
        phoneVerified,
      }),
    [debouncedSearch, phoneVerified, users],
  );

  const resetPagination = () => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Buyers & Customers
        </h1>
        <p className="text-muted-foreground">
          View platform buyers and their account information.
        </p>
      </div>

      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPagination();
        }}
        searchPlaceholder="Search buyers, phone, email, or pincode..."
        filters={[
          {
            key: "phoneVerified",
            label: "Phone",
            value: phoneVerified,
            placeholder: "Phone verification",
            onChange: (value) => {
              setPhoneVerified(value);
              resetPagination();
            },
            options: [
              { label: "All phone states", value: "ALL" },
              { label: "Verified", value: "VERIFIED" },
              { label: "Not verified", value: "UNVERIFIED" },
            ],
          },
        ]}
        onClear={() => {
          setSearch("");
          setPhoneVerified("ALL");
          resetPagination();
        }}
      />

      <UserTable
        users={filteredUsers}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </Container>
  );
}
