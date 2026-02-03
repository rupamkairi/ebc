"use client";

import { useOfferQuery } from "@/queries/conferenceHallQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  Tag,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Package,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { ForumSection } from "@/components/shared/forum";

export default function BuyerOfferDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: offer, isLoading } = useOfferQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-[400px] w-full rounded-4xl" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-black">Offer not found</h1>
        <Button onClick={() => router.back()} className="mt-4 rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  const detail = offer.offerDetails?.[0];

  return (
    <div className="container mx-auto py-10 px-4 lg:px-0 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.back()}
        className="rounded-full bg-background/50 backdrop-blur-sm border-muted shadow-sm hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hall
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary px-3 py-1 font-black">
                EXCLUSIVE PROMOTION
              </Badge>
              {offer.isActive && (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200"
                >
                  Active Offer
                </Badge>
              )}
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05]">
              {offer.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
              {offer.description}
            </p>
          </div>

          {/* Offer Banner Style Card */}
          <Card className="relative border-none bg-linear-to-br from-primary to-primary-foreground/90 overflow-hidden rounded-4xl shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="h-48 w-48 text-white" />
            </div>
            <CardContent className="p-12 relative text-white space-y-6">
              <div className="flex items-center gap-3 font-bold text-sm tracking-widest uppercase opacity-80">
                <Package className="h-5 w-5" />
                Limited Time Opportunity
              </div>
              <h2 className="text-4xl font-black max-w-md">
                Connect with the provider to claim this offer
              </h2>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-2xl h-16 px-10 font-black text-lg gap-2 shadow-xl"
                >
                  APPLY NOW <ExternalLink className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discussion Forum */}
          <div className="pt-20 border-t border-dashed">
            <ForumSection offerId={id} />
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <Card className="border-none bg-muted/30 rounded-4xl p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                Offer Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-3xl shadow-sm">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    Validity Period
                  </p>
                  <p className="font-extrabold text-foreground">
                    {detail?.startDate
                      ? format(new Date(detail.startDate), "PPP")
                      : "TBD"}
                    {" — "}
                    {detail?.endDate
                      ? format(new Date(detail.endDate), "PPP")
                      : "Ongoing"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-3xl shadow-sm">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    Published On
                  </p>
                  <p className="font-extrabold text-foreground">
                    {detail?.publishedAt
                      ? format(new Date(detail.publishedAt), "PPP")
                      : "Awaiting Publication"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-linear-to-b from-primary/5 to-transparent rounded-4xl">
            <CardContent className="p-8 space-y-6">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                About the Promoter
              </p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-black">
                  {offer?.entity?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-xl leading-none">
                    {offer?.entity?.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Verified Professional
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  variant="ghost"
                  className="w-full rounded-xl h-12 font-bold justify-between group"
                >
                  Visit Brand Hub
                  <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
