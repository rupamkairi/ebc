"use client";

import Container from "@/components/ui/containers";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type LegalSection = {
  title?: string;
  paragraphs?: string[];
  items?: string[];
  orderedItems?: string[];
};

export type LegalPageContent = {
  title: string;
  intro: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalSection[];
  contactLines?: string[];
  notice?: string;
};

function RenderList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag
      className={cn(
        "space-y-3 pl-5 text-sm leading-7 text-slate-700",
        ordered ? "list-decimal" : "list-disc",
      )}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ListTag>
  );
}

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="border-b border-slate-200 bg-[linear-gradient(135deg,#3B52B1_0%,#19234B_100%)] text-white">
        <Container size="lg" className="py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary/90">
            EBC Legal
          </p>
          <TypographyH1 className="mt-4 max-w-4xl text-3xl md:text-5xl">
            {content.title}
          </TypographyH1>
          <TypographyP className="mt-5 max-w-3xl text-base text-white/85 md:text-lg">
            {content.intro}
          </TypographyP>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium">
              Effective Date: {content.effectiveDate}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-medium">
              Last Updated: {content.lastUpdated}
            </span>
          </div>
        </Container>
      </section>

      <Container size="md" className="py-12 md:py-16">
        {content.notice ? (
          <div className="mb-8 rounded-2xl border border-secondary/30 bg-secondary/10 p-5 text-sm leading-7 text-slate-700">
            {content.notice}
          </div>
        ) : null}

        <div className="space-y-8">
          {content.sections.map((section, index) => (
            <section
              key={`${section.title || "section"}-${index}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              {section.title ? (
                <TypographyH2 className="text-2xl md:text-3xl">
                  {section.title}
                </TypographyH2>
              ) : null}
              {section.paragraphs?.map((paragraph) => (
                <TypographyP
                  key={paragraph}
                  className="mt-5 text-sm leading-7 text-slate-700 md:text-base"
                >
                  {paragraph}
                </TypographyP>
              ))}
              {section.items?.length ? (
                <div className="mt-5">
                  <RenderList items={section.items} />
                </div>
              ) : null}
              {section.orderedItems?.length ? (
                <div className="mt-5">
                  <RenderList items={section.orderedItems} ordered />
                </div>
              ) : null}
            </section>
          ))}
        </div>

        {content.contactLines?.length ? (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm md:p-8">
            <TypographyH2 className="text-2xl md:text-3xl">
              Contact Details
            </TypographyH2>
            <div className="mt-5 space-y-2 text-sm leading-7 text-white/85">
              {content.contactLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm font-medium text-primary">
          <Link href="/" className="hover:underline">
            Back to Home
          </Link>
          <Link href="/contact-us" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </Container>
    </main>
  );
}
