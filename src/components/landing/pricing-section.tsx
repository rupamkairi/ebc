"use client";

import Container from "@/components/containers/containers";
import Break from "@/components/spacing/break";
import {
  TypographyH1,
  TypographyH2,
  TypographyLarge,
  TypographyP,
} from "@/components/ui/typography";

export function PricingSection() {
  return (
    <section className="bg-primary/5 py-responsive">
      <div className="text-center">
        <TypographyH1>Pricing</TypographyH1>
        <Break />
      </div>
      <Container size="md">
        <div className="overflow-hidden rounded-2xl border border-primary/50  bg-white shadow-sm ring-1 ring-primary/50">
          <div className="grid grid-cols-2">
            <div className="inner-p text-center border-r border-b border-primary/50">
              <TypographyLarge className="font-bold">
                Available Services
              </TypographyLarge>
            </div>
            <div className="inner-p text-center bg-primary">
              <TypographyLarge className="font-bold text-white">
                EBC Charges
              </TypographyLarge>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-primary/50">
            <div className="divide-y divide-primary/50">
              <PricingRow text="Latest rate quotation from local material dealers" />
              <PricingRow text="Consultation with Technical Professionals" />
              <PricingRow text="Site visit by rated skilled workers & technicians" />
              <PricingRow text="Meet at site with local fabricators & fitters" />
              <PricingRow text="Easy hiring of construction tools & machineries" />
              <PricingRow text="Appointment with customer rated renowned contractors" />
              <PricingRow text="Latest information, guidance, discount & offers" />
              <PricingRow text="AI-powered, highly predicted project cost calculation" />
            </div>
            <div className="divide-y divide-primary/50">
              <PricingRow text="Free" />
              <PricingRow text="Free" />
              <PricingRow text="Free" />
              <PricingRow text="Free" />
              <PricingRow text="Free" />
              <PricingRow text="Free" />
              <PricingRow text="Free" />
              <PricingRow text="Free" />
            </div>
          </div>
        </div>

        <Break />

        <div className="text-center">
          <TypographyH2>
            You choose the help you want. Full control. No hidden commissions.
          </TypographyH2>
        </div>
      </Container>
    </section>
  );
}

function PricingRow({ text }: { text: string }) {
  return (
    <div className="inner-p flex items-center justify-center text-center h-14">
      <TypographyP className="text-sm font-medium text-muted-foreground mt-0!">
        {text}
      </TypographyP>
    </div>
  );
}
