"use client";

import Container from "@/components/containers/containers";
import Break from "@/components/ui/break";
import { Card } from "@/components/ui/card";
import { TypographyH1 } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";

export function ConferenceHallSection() {
  return (
    <section id="conference-hall" className="bg-blue-50/50 py-responsive">
      <Container size="lg">
        <div className="text-center">
          <TypographyH1>EBC Offers Conference Hall</TypographyH1>
        </div>

        <Break />

        <Link href="/features/conference-hall">
          <Card className="border-none p-0 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-101">
            <Image
              className="scale-100 aspect-3/2"
              width={1500}
              height={10000}
              src="/images/conference-hall.png"
              alt="Conference Hall"
            />
          </Card>
        </Link>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <DisplayCard2
            icon={<BookOpen className="w-10 h-10 text-primary" />}
            title="1. Access Exclusive Knowledge & Training"
            items={[
              "Searchable repository of documents, videos, & webinars with semantic search & auto-summaries.",
              "Learn from curated content & recorded demos.",
            ]}
          />
          <DisplayCard2
            icon={<Handshake className="w-10 h-10 text-primary" />}
            title="2. Connect with Industry Leaders & Peers"
            items={[
              "Schedule live meetings & invite selective user groups.",
              "Manage RSVPs & attendance logs for events.",
            ]}
          />
          <DisplayCard2
            icon={<Lightbulb className="w-10 h-10 text-primary" />}
            title="3. Discover New Products & Innovations"
            items={[
              "Attend live product launch events.",
              "Watch recorded product demos to stay updated on solutions.",
            ]}
          />
          <DisplayCard2
            icon={<Mic2 className="w-10 h-10 text-primary" />}
            title="4. Engage in Expert-Led Discussions & Q&A"
            items={[
              "Participate in community Q&A sessions.",
              "Join webinars & interact directly with experts.",
            ]}
          />
        </div> */}

        {/* <Break /> */}

        {/* <div className="flex justify-center">
          <Button
            size="xl"
            className="bg-primary hover:bg-primary/90 group"
            asChild
          >
            <a href="#">
              Check discounts & offers{" "}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div> */}
      </Container>
    </section>
  );
}
