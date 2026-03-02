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
import {
  Calendar,
  Search,
  ArrowRight,
  Sparkles,
  MapPin,
  LogIn,
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useSessionQuery } from "@/queries/authQueries";
import Link from "next/link";

export function OfferDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [manualPincode, setManualPincode] = useState("");
  const [appliedPincode, setAppliedPincode] = useState("");

  const { data: session, isLoading: sessionLoading } = useSessionQuery();
  const hasSession = !!session?.user;
  const sessionPincodeId = session?.user?.pincodeId;

  // Build targeting:
  // - If logged in → use pincodeId from session automatically
  // - If not logged in → use manually entered pincode (by pincode string value, not ID)
  const targeting = sessionPincodeId
    ? { pincodeId: sessionPincodeId }
    : appliedPincode
      ? { pincodeId: appliedPincode } // fallback: send as pincodeId; backend may match on value
      : undefined;

  const { data: offers, isLoading } = useOffersQuery({
    search: searchTerm,
    isPublic: true,
    targeting,
  });

  const activeOffers =
    offers?.filter((o) => o.isActive && o.offerDetails?.[0]?.publishedAt) ||
    [];

  const handlePincodeSearch = () => {
    setAppliedPincode(manualPincode.trim());
  };

  if (isLoading || sessionLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Pincode Bar */}
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search promotions & offers..."
            className="pl-9 rounded-xl border-none bg-muted/50 focus-visible:bg-white transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Pincode panel — only shown for non-logged-in users */}
        {!hasSession && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Find offers near you — enter your pincode:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="e.g. 700001"
                className="h-9 w-full sm:w-36 rounded-xl text-sm border-blue-200 bg-white focus-visible:ring-blue-400"
                value={manualPincode}
                onChange={(e) =>
                  setManualPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) => e.key === "Enter" && handlePincodeSearch()}
                maxLength={6}
              />
              <Button
                size="sm"
                className="rounded-xl bg-[#3D52A0] hover:bg-[#2d3f7c] text-white font-semibold shrink-0"
                onClick={handlePincodeSearch}
                disabled={manualPincode.trim().length < 4}
              >
                Search
              </Button>
              {appliedPincode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground underline px-1"
                  onClick={() => {
                    setManualPincode("");
                    setAppliedPincode("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
            <Link href="/auth/login" className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100 gap-1.5 text-xs"
              >
                <LogIn className="h-3.5 w-3.5" />
                Login to auto-match
              </Button>
            </Link>
          </div>
        )}

        {/* Logged in pincode indicator */}
        {hasSession && sessionPincodeId && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-50 border border-green-100 rounded-xl px-4 py-2 w-fit">
            <MapPin className="h-3.5 w-3.5 text-green-600 shrink-0" />
            <span className="text-green-700 font-medium">
              Showing offers in your area
            </span>
          </div>
        )}
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
            {appliedPincode
              ? `No offers found for pincode "${appliedPincode}". Try a different pincode.`
              : "Check back soon for exclusive deals from the community."}
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
                    {offer.targetRegions && offer.targetRegions.length > 0 && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {offer.targetRegions
                            .map((r) => r.pincode?.pincode || r.pincodeId)
                            .slice(0, 3)
                            .join(", ")}
                          {offer.targetRegions.length > 3
                            ? ` +${offer.targetRegions.length - 3} more`
                            : ""}
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
