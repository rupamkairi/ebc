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
    <section className="bg-blue-50/50 py-responsive">
      <div className="text-center">
        <TypographyH1>Pricing</TypographyH1>
        <Break />
      </div>
      <Container size="md">
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm ring-1 ring-blue-50">
          <div className="grid grid-cols-2">
            <div className="inner-p text-center border-r border-blue-50">
              <TypographyLarge className="font-bold">Free</TypographyLarge>
            </div>
            <div className="inner-p text-center bg-primary">
              <TypographyLarge className="font-bold text-white">
                Optional Paid Upgrades
              </TypographyLarge>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-blue-50">
            <div className="divide-y divide-blue-50">
              <PricingRow text="Requirement guidance" />
              <PricingRow text="Material quotations" />
              <PricingRow text="Supplier & worker listing access" />
              <div className="py-4 px-6  h-14" /> {/* Spacer */}
            </div>
            <div className="divide-y divide-blue-50">
              <PricingRow text="Engineer BOQ" />
              <PricingRow text="Site supervision" />
              <PricingRow text="Premium contractor match" />
              <PricingRow text="Work quality audits" />
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
