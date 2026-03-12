"use client";

import React, { useState } from "react";
import { BrowseItem, Product } from "@/queries/browse.queries";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AddToEnquiryModal } from "./add-to-enquiry-modal";
import { AddToAppointmentModal } from "./add-to-appointment-modal";

interface ItemCardProps {
  item: BrowseItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const router = useRouter();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const isProduct = item.type === "PRODUCT";
  const isService = item.type === "SERVICE";

  const handleCardClick = () => {
    if (isEnquiryModalOpen || isAppointmentModalOpen) return;
    router.push(`/browse/${item.id}`);
  };

  const handleCta = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProduct) {
      setIsEnquiryModalOpen(true);
    } else if (isService) {
      setIsAppointmentModalOpen(true);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer group"
      onClick={handleCardClick}
    >
      {item.image && (
        <div className="relative aspect-square w-full p-6 pb-2">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        </div>
      )}
      <br />
      <div className="p-4 pt-1 flex flex-col gap-1 items-start">
        <h3 className="text-primary font-black text-lg line-clamp-1 leading-tight group-hover:text-secondary transition-colors">
          {item.title}
        </h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          {item.category}
        </p>
      </div>

      <div className="p-4 pt-2 mt-auto">
        <Button
          className="w-full bg-secondary hover:bg-secondary/90 text-white font-black rounded-md h-10 shadow-sm active:scale-95 transition-all"
          size="sm"
          onClick={handleCta}
        >
          {isProduct ? "Add to Enquiry" : "Make Appointment"}
        </Button>
      </div>

      {/* Enquiry Modal for PRODUCT items */}
      <AddToEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={item as Product}
        onSuccess={() => router.push("/enquiry/create")}
      />

      {/* Appointment Modal for SERVICE items */}
      <AddToAppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        product={item as Product}
        onSuccess={() => {
          router.push("/appointment/create");
        }}
      />
    </div>
  );
}

interface ItemCardGridProps {
  items: BrowseItem[];
}

export function ItemCardGrid({ items }: ItemCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
