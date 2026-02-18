"use client";

import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { TypographyResponsiveSmall } from "@/components/ui/typography";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  label?: string;
}

export function WhatsAppButton({ 
  phoneNumber = "+911234567890", 
  message = "Hello, I need help with EBC.",
  label = "WhatsApp help"
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleWhatsAppClick}
        className="bg-[#25D366] hover:bg-[#20bd5c] rounded-full px-8 md:px-12 py-6 shadow-xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
      >
        <IconBrandWhatsapp className="h-6 w-6 md:h-8 md:w-8" />
        <TypographyResponsiveSmall className="text-xs md:text-sm font-semibold text-white">
          {label}
        </TypographyResponsiveSmall>
      </Button>
    </div>
  );
}
