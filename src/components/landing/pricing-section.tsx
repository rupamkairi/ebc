"use client";

import Container from "@/components/ui/containers";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const pricingData = [
    {
      service: "Latest rate quotation from local material dealers",
      isFree: true,
    },
    { service: "Consultation with Technical Professionals", isFree: true },
    {
      service: "Site visit by rated skilled workers & technicians",
      isFree: true,
    },
    { service: "Meet at site with local fabricators & fitters", isFree: true },
    {
      service: "Easy hiring of construction tools & machineries",
      isFree: true,
    },
    {
      service: "Appointment with customer rated renowned contractors",
      isFree: true,
    },
    {
      service: "Latest information, guidance, discount & offers",
      isFree: true,
    },
    {
      service: "AI-powered, highly predicted project cost calculation",
      isFree: true,
    },
  ];

  return (
    <section className="bg-white py-20 overflow-hidden">
      <Container size="lg">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-[#3B5998]">EBC</span>{" "}
            <span className="text-[#FFA500]">Pricing</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto shadow-sm border border-[#E5E7EB] rounded-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12">
            <div className="col-span-7 bg-[#FFA500] py-5 px-4">
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                Services
              </h3>
            </div>
            <div className="col-span-5 bg-[#3B5998] py-5 px-4">
              <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                Charges
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
                      Free
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h4 className="text-lg md:text-xl font-semibold text-[#1B2559]">
            You choose the help you want. Full control. No hidden commissions.
          </h4>
        </div>
      </Container>
    </section>
  );
}
