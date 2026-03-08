"use client";

import Container from "@/components/ui/containers";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  name: string;
  time: string;
  rating: number;
  review: string;
  avatar: string;
}

function ReviewCard({ name, time, rating, review, avatar }: ReviewCardProps) {
  return (
    <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col gap-4 max-w-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
          />
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-primary text-lg leading-tight">
            {name}
          </h4>
          <span className="text-xs text-gray-400 font-medium">{time}</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4 fill-current",
                  i < rating ? "text-[#FFD700]" : "text-gray-300",
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">
        {review}
      </p>
    </div>
  );
}

export function ReviewsSection() {
  const reviews = [
    {
      name: "Agusto Lee",
      time: "2 week ago",
      rating: 4,
      avatar: "https://placehold.co/100x100?text=AL",
      review:
        'These 88 constellations divide the Star maps are made from the brightest stars, and the patterns they form give rise to the constellation names" entire night sky as seen from Earth.',
    },
    {
      name: "Agusto Lee",
      time: "2 week ago",
      rating: 4,
      avatar: "https://placehold.co/100x100?text=AL",
      review:
        'These 88 constellations divide the Star maps are made from the brightest stars, and the patterns they form give rise to the constellation names" entire night sky as seen from Earth.',
    },
    {
      name: "Agusto Lee",
      time: "2 week ago",
      rating: 4,
      avatar: "https://placehold.co/100x100?text=AL",
      review:
        'These 88 constellations divide the Star maps are made from the brightest stars, and the patterns they form give rise to the constellation names" entire night sky as seen from Earth.',
    },
  ];

  return (
    <section className="bg-white pt-16 pb-0 overflow-hidden">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
          ECON Reviews
        </h2>
      </div>

      {/* Yellow Background Wrapper */}
      <div className="bg-secondary/40 py-16">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
