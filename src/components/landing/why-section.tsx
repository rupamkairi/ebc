"use client";

import Container from "@/components/containers/containers";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { DisplayCard3 } from "@/components/shared/cards/display-card-3";
import Break from "@/components/ui/break";
import {
  CircleDollarSign,
  ShieldCheck,
  UserCheck,
  Eye,
  TrendingUp,
  MegaphoneOff,
  Scale,
  Globe,
  Layers,
  LineChart,
  Users,
  Truck,
  Radio,
  FileText,
  BarChart3,
  Award,
  ClipboardCheck,
  Banknote,
  Star,
  CheckCircle2,
} from "lucide-react";

export function WhySection() {
  return (
    <section className="bg-primary/5 py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>Why Join EBC?</TypographyH1>
          <br />
          <TypographyH2>
            ECON Building Centre (EBC) Marketplace: Stakeholder&apos;s Benefits
          </TypographyH2>
        </div>

        <Break />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 gap-y-4">
          <DisplayCard3
            className="col-span-2"
            iconURL="/images/why/1.png"
            title="HOMEOWNER (End User) - Build Better, Save More"
            items={[
              {
                icon: <CircleDollarSign className="w-6 h-6" />,
                label: "Save Budget & Costs",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                label: "Access Verified Professionals",
              },
              {
                icon: <UserCheck className="w-6 h-6" />,
                label: "Get Engineer Guidance & Quality Checks",
              },
              {
                icon: <Eye className="w-6 h-6" />,
                label: "Avoid Confusion, Ensure Transparency",
              },
            ]}
            buttonLink="/"
            buttonTitle="Join EBC for a Smart & Stress-Free Home-Building Journey."
          />
          <DisplayCard3
            className="col-span-2"
            iconURL="/images/why/2.png"
            title="RETAILER / DEALER (B2C Seller) - Expand Your Reach"
            items={[
              {
                icon: <TrendingUp className="w-6 h-6" />,
                label: "Gain New Customers & Orders",
              },
              {
                icon: <MegaphoneOff className="w-6 h-6" />,
                label: "Zero Marketing Cost",
              },
              {
                icon: <Scale className="w-6 h-6" />,
                label: "Fair Price Discovery Platform",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                label: "Increased Online Visibility",
              },
            ]}
            buttonLink="/"
            buttonTitle="Register Your Shop on EBC & Grow Your Business."
          />
          <DisplayCard3
            className="col-span-2"
            iconURL="/images/why/3.png"
            title="WHOLESALER (B2B Seller) - Bulk Business Made Easy"
            items={[
              {
                icon: <Layers className="w-6 h-6" />,
                label: "Receive Bulk Leads & Inquiries",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                label: "Data-Driven Pricing Insights",
              },
              {
                icon: <Users className="w-6 h-6" />,
                label: "Connect with Multiple Dealers",
              },
              {
                icon: <Truck className="w-6 h-6" />,
                label: "Streamlined Logistics Support",
              },
            ]}
            buttonLink="/"
            buttonTitle="Partner with EBC to Maximize Your Wholesale Volumes."
          />
        </div>
        <div className="mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="col-span-1"></div>
          <DisplayCard3
            className="col-span-2"
            iconURL="/images/why/4.png"
            title="MANUFACTURER (B2B Seller) - Strengthen Your Channel"
            items={[
              {
                icon: <Radio className="w-6 h-6" />,
                label: "Direct Channel Access & Visibility",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                label: "Push Technical Documents & Offers",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                label: "Transparent Market Strength Data",
              },
              {
                icon: <Award className="w-6 h-6" />,
                label: "Brand Promotion to End Users",
              },
            ]}
            buttonLink="/"
            buttonTitle="List Your Products on EBC for Direct Market Impact."
          />
          <DisplayCard3
            className="col-span-2"
            iconURL="/images/why/5.png"
            title="SERVICE PROVIDER (Professional) - Secure More Jobs"
            items={[
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                label: "Access Verified Job Requirements",
              },
              {
                icon: <Banknote className="w-6 h-6" />,
                label: "Better Income & Reliable Payments",
              },
              {
                icon: <Star className="w-6 h-6" />,
                label: "Build Reputation with Ratings & Reviews",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                label: "Quality Supervision & Standards",
              },
            ]}
            buttonLink="/"
            buttonTitle="Sign Up as a Verified Pro on EBC to Elevate Your Career."
          />
          <div className="col-span-1"></div>
        </div>

        {/* <Break /> */}

        {/* <div className="flex justify-center">
          <Button size="xl" className="bg-primary hover:bg-primary/90 group">
            How EBC Helps You <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div> */}
      </Container>
    </section>
  );
}
