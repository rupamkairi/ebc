"use client";

import React, { useState } from "react";
import { Product } from "@/queries/browse.queries";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddToEnquiryModal } from "./add-to-enquiry-modal";
import { useEnquiryStore } from "@/store/enquiryStore";
import { toast } from "sonner";

interface ItemCardProps {
  product: Product;
}

export function ItemCard({ product }: ItemCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addItem = useEnquiryStore((state) => state.addItem);

  const handleCardClick = () => {
    router.push(`/browse/${product.id}`);
  };

  const handleAddInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      itemId: product.id,
      title: product.title,
      type: product.type.toUpperCase(),
      quantity: 1,
      unitType: "Nos",
      price: product.price,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      categoryName: product.categoryName,
      subCategoryName: product.subCategoryName,
      image: product.image,
      brand: product.brand,
    } as any);
    toast.success(`${product.title} added to inquiry`);
  };

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square w-full p-6 pb-2">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
      </div>
      <div className="p-4 pt-1 flex flex-col gap-1 items-start">
        <h3 className="text-primary font-black text-lg line-clamp-1 leading-tight group-hover:text-secondary transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          {product.category}
        </p>
      </div>

      <div className="p-4 pt-2 mt-auto">
        <Button
          className="w-full bg-secondary hover:bg-secondary/90 text-white font-black rounded-md h-10 shadow-sm active:scale-95 transition-all"
          size="sm"
          onClick={handleAddInquiry}
        >
          Make enquiry
        </Button>
      </div>

      <AddToEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </div>
  );
}

interface ItemCardGridProps {
  products: Product[];
}

export function ItemCardGrid({ products }: ItemCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ItemCard key={product.id} product={product} />
      ))}
    </div>
  );
}
