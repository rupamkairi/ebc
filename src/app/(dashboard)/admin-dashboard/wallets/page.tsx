"use client";

import React, { useState } from "react";
import Container from "@/components/ui/containers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletsQuery } from "@/queries/walletQueries";
import { Wallet } from "@/types/wallet";
import { WalletAdjustmentModal } from "@/components/dashboard/admin/wallet/wallet-adjustment-modal";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Plus, Wallet as WalletIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function WalletsManagementPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const { data: wallets, isLoading } = useWalletsQuery();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdjust = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsAdjustmentModalOpen(true);
  };

  const filteredWallets = React.useMemo(() => {
    if (!wallets) return [];
    if (!searchQuery.trim()) return wallets;

    const query = searchQuery.toLowerCase();
    return wallets.filter(
      (wallet) =>
        wallet.entity?.name?.toLowerCase().includes(query) ||
        wallet.owner?.name?.toLowerCase().includes(query),
    );
  }, [wallets, searchQuery]);

  if (isLoading) {
    return (
      <Container>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Wallet Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage wallet balances for sellers and service
              providers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WalletIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>All Wallets</CardTitle>
              <CardDescription>
                A list of all entities and their current coin balances.
              </CardDescription>
            </div>
            <div className="w-72">
              <Input
                placeholder="Search by entity or owner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets?.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell className="font-medium">
                      {wallet.entity?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {wallet.entity?.type || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{wallet.owner?.name || "N/A"}</TableCell>
                    <TableCell>{wallet.owner?.phone || "N/A"}</TableCell>
                    <TableCell className="text-right font-bold">
                      {wallet.balance.toLocaleString()} 🪙
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdjust(wallet)}
                        >
                          <Plus className="mr-1 h-4 w-4" /> Adjust
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!wallets?.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No wallets found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <WalletAdjustmentModal
        wallet={selectedWallet}
        open={isAdjustmentModalOpen}
        onOpenChange={setIsAdjustmentModalOpen}
      />
    </Container>
  );
}
