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
import { Calendar, Search, ArrowRight, Sparkles, MapPin, Building2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Offer } from "@/types/conference-hall";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface OfferDiscoveryProps {
  pincodeId: string;
  isPublic?: boolean;
}

export function OfferDiscovery({ pincodeId, isPublic = true }: OfferDiscoveryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { data: offers, isLoading } = useOffersQuery({
    search: searchTerm,
    isPublic,
    targeting: { pincodeId },
  });

  const activeOffers =
    offers?.filter((o) => o.isActive && o.offerDetails?.[0]?.publishedAt) || [];

  if (isLoading) {
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
                    onClick={() => setSelectedOffer(offer)}
                  >
                    View Offer Details
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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

      {/* Offer Details Modal */}
      <Dialog open={!!selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
          {selectedOffer && (
            <div className="flex flex-col">
              {/* Top Banner Style Header */}
              <div className="bg-[#3D52A0] p-8 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-32 w-32" />
                </div>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md mb-4 px-3 py-1 text-xs uppercase tracking-widest font-bold">
                  Exclusive Promotion
                </Badge>
                <DialogHeader className="text-left space-y-2 relative z-10">
                  <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    {selectedOffer.name}
                  </DialogTitle>
                </DialogHeader>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8 bg-linear-to-b from-white to-slate-50">
                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#3D52A0]">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      Offer Details
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <DialogDescription className="text-base text-slate-600 leading-relaxed font-medium">
                    {selectedOffer.description}
                  </DialogDescription>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Validity Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-[#3D52A0]/30 transition-colors group">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity Period</p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedOffer.offerDetails?.[0]?.startDate ? (
                          <>
                            {format(new Date(selectedOffer.offerDetails[0].startDate), "PPP")}
                            {" - "}
                            {selectedOffer.offerDetails[0].endDate
                              ? format(new Date(selectedOffer.offerDetails[0].endDate), "PPP")
                              : "Ongoing"}
                          </>
                        ) : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Region Card */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-[#3D52A0]/30 transition-colors group">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Regions</p>
                      <p className="text-sm font-bold text-slate-700 line-clamp-2">
                        {selectedOffer.targetRegions && selectedOffer.targetRegions.length > 0
                          ? selectedOffer.targetRegions.map(r => r.pincode?.pincode || r.pincodeId).join(", ")
                          : "Pan India"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer / Hosting Entity */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5 text-center md:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hosted by</p>
                      <p className="text-sm font-black text-[#173072] uppercase">{selectedOffer.entity?.name}</p>
                    </div>
                  </div>
                  
                  <Button
                    className="rounded-2xl h-12 px-8 bg-[#FFA500] hover:bg-[#E69500] text-white font-black gap-2 shadow-lg shadow-amber-200 w-full md:w-auto"
                    onClick={() => setSelectedOffer(null)}
                  >
                    Ok
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
