"use client";

import React, { useState } from "react";
import { Product } from "@/queries/browse.queries";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AddToEnquiryModal } from "./add-to-enquiry-modal";

interface ItemCardProps {
  product: Product;
}

export function ItemCard({ product }: ItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <CardHeader className="p-4 flex-1">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base line-clamp-1">
              {product.title}
            </CardTitle>
            <span className="font-semibold shrink-0">${product.price}</span>
          </div>
          <CardDescription className="line-clamp-2 text-xs mt-1">
            {product.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
          <div className="flex gap-2 w-full text-xs text-muted-foreground">
            <span className="bg-secondary px-2 py-1 rounded-md">
              {product.category}
            </span>
            <span className="bg-secondary px-2 py-1 rounded-md">
              {product.brand}
            </span>
          </div>
          <Button
            className="w-full"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Add to Enquiry
          </Button>
        </CardFooter>
      </Card>

      <AddToEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
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
