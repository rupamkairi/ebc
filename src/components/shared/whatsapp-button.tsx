"use client";

import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { TypographyResponsiveSmall } from "@/components/ui/typography";
import { useLanguage } from "@/hooks/useLanguage";
import { EBC_CONTACT, getEbcWhatsappUrl } from "@/constants/contact";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  label?: string;
}

export function WhatsAppButton({ 
  phoneNumber = EBC_CONTACT.phone, 
  message,
  label
}: WhatsAppButtonProps) {
  const { t } = useLanguage();
  
  const whatsappMessage = message || t("whatsapp_default_message");
  const buttonLabel = label || t("whatsapp_help_label");
  const handleWhatsAppClick = () => {
    const normalizedNumber = phoneNumber.replace(/\D/g, "");
    const url =
      normalizedNumber === EBC_CONTACT.whatsappNumber
        ? getEbcWhatsappUrl(whatsappMessage)
        : `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <Button 
        onClick={handleWhatsAppClick}
        className="bg-[#25D366] hover:bg-[#20bd5c] rounded-full px-8 md:px-12 py-6 shadow-xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
      >
        <IconBrandWhatsapp className="h-6 w-6 md:h-8 md:w-8" />
        <TypographyResponsiveSmall className="text-xs md:text-sm font-semibold text-white">
          {buttonLabel}
        </TypographyResponsiveSmall>
      </Button>
    </div>
  );
}
