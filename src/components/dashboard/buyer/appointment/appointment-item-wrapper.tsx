"use client";

import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";
import { AddToAppointmentModal } from "@/components/browse/add-to-appointment-modal";
import { Product } from "@/queries/browse.queries";
import { useState } from "react";

import { Item } from "@/types/catalog";

export function AppointmentItemWrapper() {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemSelect = (item: Item) => {
    const product: Product = {
      id: item.id,
      title: item.name,
      description: item.description,
      price: 0,
      image: "https://placehold.co/300x300", // Catalog Item doesn't have image
      category: item.category?.name || "Unknown",
      categoryName:
        item.category?.parentCategory?.name || item.category?.name || "Unknown",
      brand: item.brand?.name || "Unknown",
      rating: 0,
      type: (item.type?.toLowerCase() === "service" ? "service" : "product") as
        | "product"
        | "service",
    };

    setSelectedItem(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Select an Item for Appointment
        </h2>
      </div>

      <ItemSearch
        onItemSelect={handleItemSelect}
        className="border rounded-lg p-4 bg-card shadow-sm"
      />

      {selectedItem && (
        <AddToAppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedItem}
        />
      )}
    </div>
  );
}
