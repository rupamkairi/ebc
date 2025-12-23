"use client";

import Container from "@/components/containers/containers";
import { Hero } from "@/components/layouts/landing-scrap/hero";
import { Navbar } from "@/components/layouts/landing-scrap/navbar";
import { ProblemSection } from "@/components/layouts/landing-scrap/problem-section";
import Break from "@/components/spacing/break";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  TypographyH1,
  TypographyH3,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
  TypographyResponsiveSmall,
} from "@/components/ui/typography";
import {
  ArrowRight,
  Banknote,
  Compass,
  HardHat,
  LayoutList,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white-background">
      <Navbar />
      {/* Existing Header/Banner would go here */}
      <Hero />
      <Container size="lg">
        <ProblemSection />
      </Container>
      {/* <FeaturesSection /> */}

      {/* WHAT IS EBC? SECTION */}
      <section className="bg-blue-50/50 py-responsive">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto">
            <TypographyH1 className="text-4xl font-black">
              What is EBC?
            </TypographyH1>
            <Break className="h-4" />
            <TypographyP className="text-muted-foreground text-lg">
              ECON Building Centre (EBC) is a trusted construction marketplace
              where families get everything needed to build a home — with
              clarity and support.
            </TypographyP>
          </div>

          <Break className="h-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Banknote className="w-8 h-8 text-primary" />}
              title="① Fair Material Prices"
              items={[
                "Multiple quotations",
                "Verified dealers",
                "Price transparency",
              ]}
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="② Trusted Service Providers"
              items={[
                "Mason, plumber, electrician, painter etc.",
                "Ratings & reviews",
              ]}
            />
            <FeatureCard
              icon={<HardHat className="w-8 h-8 text-primary" />}
              title="③ Engineer Support (Optional)"
              items={[
                "BOQ & quantity check",
                "Site quality visits",
                "Construction stage guidance",
              ]}
            />
          </div>

          <Break className="h-12" />

          <div className="flex justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 group">
              How EBC Helps You <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-responsive">
        <Container size="lg">
          <div className="text-center">
            <TypographyH3 className="font-bold uppercase">
              How it works
            </TypographyH3>
            <TypographyH1 className="text-4xl font-black">
              3 Simple Steps
            </TypographyH1>
          </div>

          <Break className="h-16" />

          <div className="relative">
            {/* Connection Arrows (Desktop) */}
            <div className="hidden md:flex absolute top-[15%] left-[33%] w-[10%] items-center justify-center opacity-20">
              <div className="h-px bg-slate-900 w-full" />
              <ArrowRight className="w-5 h-5 -ml-1" />
            </div>
            <div className="hidden md:flex absolute top-[15%] left-[66%] w-[10%] items-center justify-center opacity-20">
              <div className="h-px bg-slate-900 w-full" />
              <ArrowRight className="w-5 h-5 -ml-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <StepItem
                icon={<Compass className="w-12 h-12 text-primary mx-auto" />}
                title="1 Tell us your requirement"
                description="Plot size or renovation work"
              />
              <StepItem
                icon={<LayoutList className="w-12 h-12 text-primary mx-auto" />}
                title="2 Compare quotations & professionals"
                description="Choose what fits budget and trust"
              />
              <StepItem
                icon={
                  <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
                }
                title="3 Build with support and quality checks"
                description="EBC tracks & assists throughout"
              />
            </div>
          </div>

          <Break className="h-12" />

          <div className="flex justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 group">
              Start Your Home Journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* MOST LOVED BENEFITS SECTION */}
      <section className="bg-blue-50/50 py-responsive ">
        <Container size="lg">
          <div className="text-center">
            <TypographyH1 className="text-4xl font-black">
              MOST LOVED BENEFITS
            </TypographyH1>
          </div>

          <Break className="h-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <BenefitCard
              image="https://placehold.co/400x300?text=Savings"
              text="Save ₹50,000–₹3,00,000 by avoiding wrong purchases"
            />
            <BenefitCard
              image="https://placehold.co/400x300?text=Convenience"
              text="No running around — everything online"
            />
            <BenefitCard
              image="https://placehold.co/400x300?text=Accuracy"
              text="Engineer help = fewer mistakes"
            />
            <BenefitCard
              image="https://placehold.co/400x300?text=Renovation"
              text="Bathroom & kitchen renovation"
            />
            <BenefitCard
              image="https://placehold.co/400x300?text=Verification"
              text="Verified workers — not random labour"
            />
            <BenefitCard
              image="https://placehold.co/400x300?text=Documentation"
              text="Documentation for future proof"
            />
          </div>

          <Break className="h-12" />

          <div className="text-center">
            <TypographyH3 className="text-3xl font-black">
              A better home. A better decision. A better sleep at night.
            </TypographyH3>
          </div>
        </Container>
      </section>

      {/* Keep Everything below unchanged. */}

      {/* USE CASES SECTION */}
      <section className="py-responsive">
        <Container size="lg">
          <div className="text-center">
            <TypographyH1 className="text-4xl font-black">
              Use Cases
            </TypographyH1>
            <Break className="h-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UseCaseCard
              image="https://placehold.co/600x400?text=G+1+building"
              title="G+1 building on ancestral land"
            />
            <UseCaseCard
              image="https://placehold.co/600x400?text=Floor+extension"
              title="Floor extension"
            />
            <UseCaseCard
              image="https://placehold.co/600x400?text=Renovation"
              title="Bathroom & kitchen renovation"
            />
            <UseCaseCard
              image="https://placehold.co/600x400?text=Home+monitoring"
              title="Home monitoring from outside Bengal"
            />
          </div>

          <Break className="h-8" />

          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 group"
              asChild
            >
              <a href="#">
                Check if EBC fits your requirement{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </Container>
      </section>

      {/* PRICING SECTION */}
      <section className="bg-blue-50/50 py-responsive">
        <div className="text-center">
          <TypographyH1 className="text-4xl font-black"> Pricing</TypographyH1>
          <Break className="h-4" />
        </div>
        <Container size="lg">
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

          <Break className="h-8" />

          <div className="text-center">
            <TypographyH3 className="text-3xl font-black">
              You choose the help you want. Full control. No hidden commissions.
            </TypographyH3>
          </div>
        </Container>
      </section>

      {/* FAQ SECTION */}
      <section className="py-responsive">
        <div className="text-center">
          <TypographyH1 className="text-4xl font-black">FAQs</TypographyH1>
          <Break className="h-4" />
        </div>
        <Container size="lg">
          <div className="space-y-4">
            <Accordion
              type="single"
              collapsible
              className="w-full border rounded-2xl bg-white overflow-hidden"
            >
              <FAQItem
                question="How does EBC ensure material quality?"
                answer="We work with verified suppliers and provide detailed material specifications to ensure you get the best quality for your construction."
              />
              <FAQItem
                question="Are the workers verified?"
                answer="Yes, all workers and contractors on our platform go through a verification process and their past work is vetted by our engineers."
              />
              <FAQItem
                question="What is the cost of engineer support?"
                answer="Engineer support costs vary based on the extent of assistance required. You can choose specific services as per your project needs."
              />
            </Accordion>
          </div>

          <Break className="h-12" />

          <div className="flex justify-center">
            <Button
              size="lg"
              variant="default"
              className="bg-primary text-base group"
            >
              Still Have Questions? Talk to Us{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Container>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="bg-blue-50/50 text-center py-xl">
        <Container size="lg">
          <TypographyH1 className="leading-tight">
            You are building your life&apos;s biggest asset. Don&apos;t leave it
            to chance.
          </TypographyH1>
          <Break className="h-10" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="2xl" className="bg-primary text-lg font-semibold">
              Plan My Home with an Expert (Free){" "}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="2xl"
              className="border-primary/20 bg-white text-lg font-semibold hover:bg-blue-50 text-foreground"
            >
              Compare Material Prices <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-lg">
        <Container size="lg">
          <div className="text-center">
            <div className="space-y-2">
              <TypographyLarge className="font-bold">
                EBC — Powered by Engineers. Trusted by Families.
              </TypographyLarge>
              <TypographyMuted>Made in India • Built for ALL.</TypographyMuted>
            </div>
            <Break className="h-10" />

            <div className="flex justify-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="bg-[#25D366] hover:bg-[#20bd5c] text-white rounded-full px-5 py-6 shadow-xl flex items-center gap-2 group">
          <div className="bg-white/20 p-1 rounded-full">
            <Send className="h-5 w-5 fill-current" />
          </div>
          <TypographyResponsiveSmall className="font-semibold text-white">
            WhatsApp help
          </TypographyResponsiveSmall>
        </Button>
      </div>
    </main>
  );
}

function UseCaseCard({ image, title }: { image: string; title: string }) {
  return (
    <Card className="py-0 gap-0 justify-between overflow-hidden border-none shadow-md rounded-2xl group cursor-pointer hover:shadow-xl transition-all duration-300">
      <CardContent className="grow relative aspect-3/2">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </CardContent>

      <CardFooter className="inner-p bg-white text-center">
        <TypographyResponsiveSmall className="font-semibold group-hover:text-primary transition-all">
          {title}
        </TypographyResponsiveSmall>
      </CardFooter>
    </Card>
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="w-full inner-p text-left hover:bg-slate-50 transition-colors group">
        <TypographyResponsiveSmall>{question}</TypographyResponsiveSmall>
      </AccordionTrigger>
      <AccordionContent>
        <div className="inner-p border-t border-slate-50 ">
          <TypographyP className="text-muted-foreground mt-0!">
            {answer}
          </TypographyP>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function FeatureCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <Card className="shadow-lg border-none rounded-3xl">
      <CardContent className="flex flex-col items-center text-center ">
        <div className="mb-4">{icon}</div>
        <TypographyLarge className="font-bold mb-4">{title}</TypographyLarge>
        <ul className="text-sm text-muted-foreground space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-left">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function StepItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
        {icon}
      </div>
      <div>
        <TypographyLarge className="font-bold mb-1">{title}</TypographyLarge>
        <TypographyP className="text-muted-foreground text-sm">
          {description}
        </TypographyP>
      </div>
    </div>
  );
}

function BenefitCard({ image, text }: { image: string; text: string }) {
  return (
    <Card className="p-0 gap-0 overflow-hidden border-none shadow-md rounded-2xl group transition-all duration-300 hover:shadow-xl">
      <CardContent className="relative aspect-video">
        <Image
          src={image}
          alt={text}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </CardContent>
      <CardFooter className="inner-p border-t border-slate-50 text-center flex items-center justify-center min-h-20">
        <TypographyResponsiveSmall className="font-semibold leading-tight">
          {text}
        </TypographyResponsiveSmall>
      </CardFooter>
    </Card>
  );
}
