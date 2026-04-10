"use client";

import Container from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calculator, Presentation, Waves } from "lucide-react";
import Image from "next/image";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function CostFeature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 size-12 rounded-xl bg-white border border-secondary shadow-sm flex items-center justify-center text-secondary">
        {icon}
      </div>
      <div className="flex flex-col">
        <h4 className="text-primary font-bold text-lg leading-tight mb-1">
          {title}
        </h4>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function AiCalculatorSection() {
  return (
    <section id="ai-calculator" className="bg-white py-24 overflow-hidden">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-primary text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-4">
            EBC Offers <span className="text-secondary">AI-Powered</span> Cost
            Calculator
          </h2>
          <p className="text-slate-600 font-medium text-base md:text-lg">
            AI-powered estimate based on your location and requirements.
          </p>
        </div>

        {/* Main Content: Split Illustration and Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Illustration */}
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">
            <Image
              src="/images/why/cost-calculator.png"
              alt="AI Cost Calculator Illustration"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              priority
            />
          </div>

          {/* Right: Features List */}
          <div className="flex flex-col space-y-8 lg:pl-12">
            <div className="space-y-4 mb-4">
              <h3 className="text-primary text-2xl lg:text-3xl font-black tracking-tight leading-tight">
                Smart Construction Cost <br className="hidden md:block" />{" "}
                Calculator
              </h3>
              <p className="text-slate-500 text-base md:text-lg max-w-lg">
                Estimate your home building cost, plan better, and save money
                with EBC
              </p>
            </div>

            <div className="space-y-8">
              <CostFeature
                icon={<Calculator className="size-6" />}
                title="Accurate Estimation"
                description="Get reliable cost estimates for your entire home project"
              />
              <CostFeature
                icon={<Presentation className="size-6" />}
                title="Budget Planning"
                description="Plan your budget with confidence, no hidden costs"
              />
              <CostFeature
                icon={<Waves className="size-6" />}
                title="Minimize Wastage"
                description="Calculate the right quantities, avoid over buying materials"
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="flex justify-center">
          <Button variant="glow" size="action" asChild>
            <a
              href="/calculator"
              className="flex items-center justify-center gap-3"
            >
              Use AI Calculator
              <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
