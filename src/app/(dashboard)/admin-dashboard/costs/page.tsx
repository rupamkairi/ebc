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
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  useLeadPricingList,
  useUpdateLeadPricingMutation,
} from "@/queries/pricingQueries";
import {
  useCoinPackagesList,
  useCreateUpdateCoinPackageMutation,
  useDeleteCoinPackageMutation,
} from "@/queries/packageQueries";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Save, IndianRupee, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CoinPackage } from "@/types/wallet";

export default function CostsAndPackagesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  // Pricing Queries
  const { data: pricingConfigs, isLoading: isLoadingPricing } =
    useLeadPricingList();
  const updatePricing = useUpdateLeadPricingMutation();
  const [editingConfigs, setEditingConfigs] = useState<Record<string, number>>(
    {},
  );

  // Package Queries
  const { data: coinPackages, isLoading: isLoadingPackages } =
    useCoinPackagesList();
  const createUpdatePackage = useCreateUpdateCoinPackageMutation();
  const deletePackage = useDeleteCoinPackageMutation();
  const [editingPackages, setEditingPackages] = useState<
    Record<string, Partial<CoinPackage>>
  >({});
  const [newPackage, setNewPackage] = useState<Partial<CoinPackage> | null>(
    null,
  );

  // Pricing Handlers
  const handleCostChange = (leadType: string, value: number) => {
    setEditingConfigs((prev) => ({
      ...prev,
      [leadType]: value,
    }));
  };

  const handleSavePricing = (leadType: string) => {
    const value = editingConfigs[leadType];
    if (value === undefined) return;

    updatePricing.mutate(
      { leadType, value },
      {
        onSuccess: () => {
          toast.success(`Pricing for ${leadType} updated successfully`);
          setEditingConfigs((prev) => {
            const newState = { ...prev };
            delete newState[leadType];
            return newState;
          });
        },
        onError: () => {
          toast.error(`Failed to update pricing for ${leadType}`);
        },
      },
    );
  };

  // Package Handlers
  const handlePackageFieldChange = (
    id: string,
    field: keyof CoinPackage,
    value: string | number,
  ) => {
    setEditingPackages((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSavePackage = (
    id: string | undefined,
    data: Partial<CoinPackage>,
  ) => {
    const payload = id ? { ...data, id } : data;
    createUpdatePackage.mutate(payload, {
      onSuccess: () => {
        toast.success(
          id ? "Package updated successfully" : "Package created successfully",
        );
        if (id) {
          setEditingPackages((prev) => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
          });
        } else {
          setNewPackage(null);
        }
      },
      onError: () => {
        toast.error(
          id ? "Failed to update package" : "Failed to create package",
        );
      },
    });
  };

  const handleDeletePackage = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    deletePackage.mutate(id, {
      onSuccess: () => {
        toast.success("Package deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete package");
      },
    });
  };

  if (!isAdmin) {
    return (
      <Container>
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-destructive font-semibold">
            Access Denied. Admin only.
          </p>
        </div>
      </Container>
    );
  }

  const isLoading = isLoadingPricing || isLoadingPackages;

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
      <div className="flex flex-col gap-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Costs & Packages
            </h1>
            <p className="text-muted-foreground">
              Manage lead prices and coin purchase packages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Pricing Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Configuration</CardTitle>
            <CardDescription>
              Set fixed coin costs or the percentage charged for quotations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity Type</TableHead>
                  <TableHead className="w-[220px]">Pricing Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingConfigs?.map((config) => {
                  const isEditing =
                    editingConfigs[config.leadType] !== undefined;
                  const currentValue = isEditing
                    ? editingConfigs[config.leadType]
                    : config.value;

                  return (
                    <TableRow key={config.leadType}>
                      <TableCell className="font-medium">
                        {config.leadType.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <NumericInput
                            value={currentValue}
                            onValueChange={(value) =>
                              handleCostChange(config.leadType, value)
                            }
                            className="w-32"
                            integer={config.unit === "COINS"}
                            min={0}
                            max={config.unit === "PERCENT" ? 100 : undefined}
                            step={config.unit === "PERCENT" ? "0.01" : "1"}
                            fallbackValue={0}
                          />
                          <span className="text-sm font-medium text-muted-foreground">
                            {config.unit === "PERCENT" ? "%" : "coins"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          disabled={!isEditing || updatePricing.isPending}
                          onClick={() => handleSavePricing(config.leadType)}
                        >
                          {updatePricing.isPending ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-1 h-4 w-4" />
                          )}
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!pricingConfigs?.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No pricing configurations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Coin Packages Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Coin Packages Management</CardTitle>
              <CardDescription>
                Define packages users can purchase to top up their wallets.
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() =>
                setNewPackage({
                  name: "",
                  coins: 0,
                  priceInInr: 0,
                  description: "",
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Package
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead className="w-[120px]">Coins</TableHead>
                  <TableHead className="w-[150px]">Price (INR)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right w-[120px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Package Row */}
                {newPackage && (
                  <TableRow className="bg-muted/50 border-primary">
                    <TableCell>
                      <Input
                        placeholder="Package Name"
                        value={newPackage.name}
                        onChange={(e) =>
                          setNewPackage({ ...newPackage, name: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <NumericInput
                        value={newPackage.coins}
                        onValueChange={(value) =>
                          setNewPackage({
                            ...newPackage,
                            coins: value,
                          })
                        }
                        integer
                        min={0}
                        fallbackValue={0}
                      />
                    </TableCell>
                    <TableCell>
                      <NumericInput
                        value={newPackage.priceInInr}
                        onValueChange={(value) =>
                          setNewPackage({
                            ...newPackage,
                            priceInInr: value,
                          })
                        }
                        integer
                        min={0}
                        fallbackValue={0}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Optional description"
                        value={newPackage.description}
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            description: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setNewPackage(null)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleSavePackage(undefined, newPackage)
                          }
                        >
                          {createUpdatePackage.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Existing Packages */}
                {coinPackages?.map((pkg) => {
                  const editData = editingPackages[pkg.id];
                  const isEditing = !!editData;
                  const data = isEditing ? { ...pkg, ...editData } : pkg;

                  return (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <Input
                          value={data.name}
                          onChange={(e) =>
                            handlePackageFieldChange(
                              pkg.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className={cn(
                            !isEditing &&
                              "border-transparent bg-transparent shadow-none",
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <NumericInput
                          value={data.coins}
                          onValueChange={(value) =>
                            handlePackageFieldChange(
                              pkg.id,
                              "coins",
                              value,
                            )
                          }
                          integer
                          min={0}
                          fallbackValue={0}
                          className={cn(
                            !isEditing &&
                              "border-transparent bg-transparent shadow-none",
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <NumericInput
                          value={data.priceInInr}
                          onValueChange={(value) =>
                            handlePackageFieldChange(
                              pkg.id,
                              "priceInInr",
                              value,
                            )
                          }
                          integer
                          min={0}
                          fallbackValue={0}
                          className={cn(
                            !isEditing &&
                              "border-transparent bg-transparent shadow-none",
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={data.description || ""}
                          onChange={(e) =>
                            handlePackageFieldChange(
                              pkg.id,
                              "description",
                              e.target.value,
                            )
                          }
                          className={cn(
                            !isEditing &&
                              "border-transparent bg-transparent shadow-none",
                          )}
                          placeholder="No description"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            disabled={deletePackage.isPending}
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            {deletePackage.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            disabled={!isEditing || createUpdatePackage.isPending}
                            onClick={() =>
                              handleSavePackage(pkg.id, editingPackages[pkg.id])
                            }
                          >
                            {createUpdatePackage.isPending && isEditing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!coinPackages?.length && !newPackage && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No coin packages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
