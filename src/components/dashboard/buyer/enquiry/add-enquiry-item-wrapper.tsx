"use client";

import React, { useState } from "react";
import { ItemSearch } from "@/components/advanced-forms/item-search/item-search";
import { AddToEnquiryModal } from "@/components/browse/add-to-enquiry-modal";
import { Product } from "@/queries/browse.queries"; // Assuming ItemSearch returns similar structure or I map it

export function AddEnquiryItemWrapper() {
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemSelect = (item: any) => {
    // Adapter to match Product interface expected by Modal
    // The ItemSearch returns items from catalog catalogQueries
    // We need to map `item` to `Product` interface for the modal
    const product: Product = {
      id: item.id,
      title: item.name,
      description: item.description,
      price: 0, // Price might not be visible in search or relevant for enquiry
      image: item.image || "https://placehold.co/300x300",
      category: item.category?.name || "Unknown",
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
        <h2 className="text-xl font-semibold">Add More Items</h2>
      </div>

      <ItemSearch
        onItemSelect={handleItemSelect}
        className="border rounded-lg p-4 bg-card shadow-sm"
      />

      {selectedItem && (
        <AddToEnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedItem}
        />
      )}
    </div>
  );
}
