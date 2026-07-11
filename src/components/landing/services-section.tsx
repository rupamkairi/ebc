"use client";

import Container from "@/components/ui/containers";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  image: string;
  href?: string;
}

function ServiceCard({ title, image, href }: ServiceCardProps) {
  const content = (
    <>
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
      <div className="bg-secondary p-3 text-center">
        <p className="text-[10px] sm:text-xs font-bold text-white line-clamp-2 min-h-10 flex items-center justify-center">
          {title}
        </p>
      </div>
    </>
  );

  const className =
    "group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col block";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

import { useLanguage } from "@/hooks/useLanguage";

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      title: t("ser_item_1"),
      image: "/images/services/Building_Construction.png",
      href: "/browse?type=SERVICE&page=1&q=contract",
    },
    {
      title: t("ser_item_2"),
      image: "/images/services/Sanitary_&_Plumbing.png",
      href: "/browse?q=Installation&page=1",
    },
    {
      title: t("ser_item_3"),
      image: "/images/services/Consultancy_&_Supervision.png",
      href: "/browse?type=SERVICE&q=Construction+&page=1",
    },
    {
      title: t("ser_item_4"),
      image: "/images/services/Marble_&_Tiles_Setting.png",
      href: "/browse?type=PRODUCT&parentCategory=52975122-fa62-4646-be95-e09bf732054a&page=1",
    },
    {
      title: t("ser_item_5"),
      image: "/images/services/Painting_&_Colouring.png",
      href: "/browse?type=SERVICE&q=Painti&page=1",
    },
    {
      title: t("ser_item_6"),
      image: "/images/services/Electrical_Wiring.png",
      href: "/browse?type=SERVICE&page=1&parentCategory=b2c9a992-ef38-41bc-ad24-51dbe7a9a86c",
    },
    {
      title: t("ser_item_7"),
      image: "/images/services/Outdoor_Beautification.png",
      href: "/browse?type=SERVICE&q=Exte&page=1",
    },
    {
      title: t("ser_item_8"),
      image: "/images/services/Interior_Decoration.png",
      href: "/browse?type=SERVICE&q=Interior&page=1",
    },
  ];

  return (
    <section className="relative py-20 bg-[#F8F9FA] overflow-hidden">
      <Container size="xl">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-secondary">
              {t("services_section_title_part1")}
            </span>{" "}
            <span className="text-primary">
              {t("services_section_title_part2")}
            </span>
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
                href={service.href}
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
            <Link href="/browse?type=SERVICE">
              <Button variant="glow" size="action" className="group">
                {t("services_section_cta")}
                <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
