"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/containers";

export function PricingSection() {
  const { t } = useLanguage();

  const pricingData = [
    {
      service: t("pricing_item_1"),
      isFree: true,
    },
    { service: t("pricing_item_2"), isFree: true },
    {
      service: t("pricing_item_3"),
      isFree: true,
    },
    { service: t("pricing_item_4"), isFree: true },
    {
      service: t("pricing_item_5"),
      isFree: true,
    },
    {
      service: t("pricing_item_6"),
      isFree: true,
    },
    {
      service: t("pricing_item_7"),
      isFree: true,
    },
    {
      service: t("pricing_item_8"),
      isFree: true,
    },
  ];

  return (
    <section className="bg-white py-20 overflow-hidden">
      <Container size="lg">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-primary">{t("pricing_section_title_prefix")}</span>{" "}
            <span className="text-secondary">{t("pricing_section_title_highlight")}</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto shadow-sm border border-[#E5E7EB] rounded-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12">
            <div className="col-span-7 bg-secondary py-5 px-4">
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                {t("pricing_services")}
              </h3>
            </div>
            <div className="col-span-5 bg-primary py-5 px-4">
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                {t("pricing_charges")}
              </h3>
            </div>
          </div>

          {/* Pricing Rows */}
          <div className="flex flex-col">
            {pricingData.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-12 border-b border-[#E5E7EB] last:border-b-0",
                  index % 2 === 1 ? "bg-[#E5E7EB]" : "bg-white",
                )}
              >
                {/* Service Column */}
                <div className="col-span-1 border-r border-[#E5E7EB]/50 flex items-center justify-center">
                  {/* Left gutter/indicator often seen in tables */}
                </div>
                <div className="col-span-6 flex items-center py-4 px-6">
                  <p className="text-xs md:text-sm font-medium text-gray-700 leading-snug">
                    {item.service}
                  </p>
                </div>

                {/* Charges Column */}
                <div className="col-span-5 flex items-center justify-center gap-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative inline-flex h-7 w-14 items-center rounded-full bg-[#00D100]">
                      <span className="inline-block h-5 w-5 translate-x-8 rounded-full bg-white shadow-sm transition" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {t("pricing_free")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h4 className="text-lg md:text-xl font-semibold text-primary">
            {t("pricing_footer_text")}
          </h4>
        </div>
      </Container>
    </section>
  );
}
