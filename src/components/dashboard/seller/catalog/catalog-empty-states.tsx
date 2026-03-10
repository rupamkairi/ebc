"use client";

import { AlertCircle, MapPin, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Syncing catalog...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-pulse">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
        <Package
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40"
          size={24}
        />
      </div>
      <p className="font-semibold text-muted-foreground">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description: string;
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="py-16 text-center bg-destructive/5 border border-dashed border-destructive/20 rounded-lg animate-in fade-in duration-500">
      <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <p className="font-bold text-destructive text-lg">{title}</p>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
    </div>
  );
}

interface NoEntityStateProps {
  onSetupClick: () => void;
}

export function NoEntityState({ onSetupClick }: NoEntityStateProps) {
  return (
    <div className="py-24 text-center border border-dashed rounded-lg bg-muted/20 animate-in fade-in duration-500">
      <div className="h-16 w-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4 text-muted-foreground/50">
        <MapPin size={32} />
      </div>
      <p className="font-bold text-lg">No Business Entity found.</p>
      <p className="text-muted-foreground text-sm mt-1 mb-6">
        Setup your store to start listing items
      </p>
      <Button onClick={onSetupClick} className="font-semibold">
        Complete Setup
      </Button>
    </div>
  );
}

interface EmptyCatalogStateProps {
  type: "products" | "services";
  onAddClick: () => void;
  disabled?: boolean;
}

export function EmptyCatalogState({
  type,
  onAddClick,
  disabled,
}: EmptyCatalogStateProps) {
  const isProducts = type === "products";
  return (
    <div className="py-20 text-center border border-dashed rounded-lg bg-muted/20">
      <p className="font-semibold text-muted-foreground">
        {isProducts
          ? "No products listed in your catalog."
          : "No professional services listed yet."}
      </p>
      <Button
        onClick={onAddClick}
        disabled={disabled}
        className="mt-4 font-semibold flex items-center gap-2 mx-auto disabled:opacity-50"
      >
        <Plus size={18} /> Add First {isProducts ? "Product" : "Service"}
      </Button>
    </div>
  );
}
