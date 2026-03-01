"use client";

import { useOffersQuery } from "@/queries/conferenceHallQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, ArrowRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export function OfferDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: offers, isLoading } = useOffersQuery({
    search: searchTerm,
  });

  const activeOffers =
    offers?.filter((o) => o.isActive && o.offerDetails?.[0]?.publishedAt) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search promotions & offers..."
          className="pl-9 rounded-xl border-none bg-muted/50 focus-visible:bg-white transition-all shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 md:py-20 animate-in fade-in duration-700 px-4">
          <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-lg aspect-video mb-6 md:mb-8">
            <Image
              src="/images/conference-hall/conference-hall-empty.png"
              alt="No active offers"
              fill
              className="object-contain rounded-3xl"
            />
          </div>
          <p className="text-[#9CA3AF] text-base md:text-lg font-medium text-center max-w-md italic px-4">
            Check back soon for exclusive deals from the community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeOffers.map((offer) => {
            const detail = offer.offerDetails?.[0];
            return (
              <Card
                key={offer.id}
                className="group relative border-none bg-linear-to-br from-card via-card to-primary/5 overflow-hidden rounded-4xl shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="h-24 w-24 text-primary" />
                </div>

                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-lg shadow-lg shadow-primary/20">
                      Promotion
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {offer.name}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed mt-2 line-clamp-2">
                    {offer.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/30 rounded-2xl space-y-3">
                    {detail?.startDate && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Valid: {format(new Date(detail.startDate), "PP")} -{" "}
                          {detail.endDate
                            ? format(new Date(detail.endDate), "PP")
                            : "Ongoing"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-8 flex flex-col gap-4">
                  <Button
                    className="w-full h-12 rounded-xl font-semibold gap-2 group/btn"
                    asChild
                  >
                    <a
                      href={`/buyer-dashboard/conference-hall/offers/${offer.id}`}
                    >
                      View Offer Details
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span>Hosted by</span>
                    <span className="text-foreground">
                      {offer.entity?.name}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
