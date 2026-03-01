"use client";

import Container from "@/components/ui/containers";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  image: string;
}

function ServiceCard({ title, image }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <div className="relative aspect-4/3 w-full grow">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized
        />
      </div>
      <div className="bg-[#FFA500] p-3 text-center">
        <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider line-clamp-2 min-h-10 flex items-center justify-center">
          {title}
        </p>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const services = [
    {
      title: "Public or private projects of any size",
      image: "/images/services/architecture.png",
    },
    {
      title: "Floor extension or upgradation",
      image:
        "/images/services/construction-residential-new-house-progress-building-site 1.png",
    },
    {
      title: "Building repair or renovation",
      image:
        "/images/services/skilled-worker-installing-ceramic-wood-effect-tiles-floor-worker-making-laminate-flooring-construction-site-new-apartment 1.png",
    },
    {
      title: "Work Monitoring from anywhere",
      image: "/images/services/site-engineer-construction-site 1.png",
    },
    {
      title: "Custom Home Design & Planning",
      image: "/images/services/architecture.png",
    },
    {
      title: "Commercial Space Renovation",
      image:
        "/images/services/construction-residential-new-house-progress-building-site 1.png",
    },
    {
      title: "Industrial Flooring & Upgrades",
      image:
        "/images/services/skilled-worker-installing-ceramic-wood-effect-tiles-floor-worker-making-laminate-flooring-construction-site-new-apartment 1.png",
    },
    {
      title: "Remote Technical Supervision",
      image: "/images/services/site-engineer-construction-site 1.png",
    },
  ];

  return (
    <section className="relative py-20 bg-[#F8F9FA] overflow-hidden">
      <Container size="xl">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-[#FFA500]">Trending</span>{" "}
            <span className="text-[#2D3E7F]">Construction Services</span>
          </h2>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Grid of Service Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl z-10 px-4">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                image={service.image}
              />
            ))}
          </div>

          {/* Steamroller Asset (Bottom Left - needs to be absolute or positioned carefully) */}
          <div className="hidden lg:block absolute -bottom-20 -left-80 w-[400px] h-[300px] pointer-events-none">
            <Image
              src="/images/services/roller.png"
              alt="Construction Equipment"
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>

          {/* Select Your Service Button */}
          <div className="mt-12 z-10">
            <Link href="/hire">
              <Button variant="glow" size="action" className="group">
                Select your Service
                <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
