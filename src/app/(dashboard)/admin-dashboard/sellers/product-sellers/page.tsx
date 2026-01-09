"use client";

import { useState } from "react";
import Container from "@/components/containers/containers";
import { UserTable } from "@/components/admin/users/user-table";
import { UserDetailsModal } from "@/components/admin/users/user-details-modal";
import { useUsersQuery } from "@/queries/adminQueries";
import { AdminUser } from "@/types/auth";
import { USER_ROLE } from "@/constants/auth";
import { PaginationState, SortingState } from "@tanstack/react-table";

export default function ProductSellersPage() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: users = [], isLoading } = useUsersQuery({
    role: USER_ROLE.USER_PRODUCT_SELLER_ADMIN,
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Product Sellers</h1>
        <p className="text-muted-foreground">
          Manage product sellers, review their business profiles, and verify
          their status.
        </p>
      </div>

      <UserTable
        users={users}
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
