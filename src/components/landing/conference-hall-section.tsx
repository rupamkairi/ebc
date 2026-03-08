"use client";

import Container from "@/components/ui/containers";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ConferenceHallSection() {
  return (
    <section id="conference-hall" className="bg-white py-24 overflow-hidden">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-primary text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-4">
            Not Sure? Learn from Experts & Real{" "}
            <span className="text-secondary">Home Builders</span>
          </h2>
          <p className="text-slate-500 font-medium text-base md:text-lg">
            Ask questions. Read real experiences. Decide confidently.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Side: Illustration Area */}
          <div className="relative min-h-[400px] lg:min-h-full bg-slate-100">
            <Image
              src="/images/conference-hall/conference-hall.png"
              alt="Expert teaching family about construction"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>

          {/* Right Side: Blue Information Card */}
          <div className="bg-primary p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-secondary text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  Join The Conference Hall
                </h3>
                <p className="text-white/80 text-base md:text-lg max-w-md leading-relaxed">
                  Discover special discounts, latest construction information,
                  and best practices from top brands in one place.
                </p>
              </div>

              {/* Bullet Features List */}
              <div className="space-y-6">
                {[
                  "Knowledge & Training",
                  "Live Meeting",
                  "Offer Zone",
                  "Q&A Forum",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <CheckCircle2 className="size-7 text-secondary shrink-0" />
                    <span className="text-xl md:text-2xl font-bold tracking-tight">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Button
                  className="h-14 px-10 bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2 rounded-lg transition-all duration-300 shadow-xl group border-none"
                  asChild
                >
                  <Link href="/conference-hall" className="text-lg font-bold">
                    View Expert Answers
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
