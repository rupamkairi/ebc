"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/ui/containers";
import { EBC_CONTACT, getEbcWhatsappUrl } from "@/constants/contact";
import { useLanguage } from "@/hooks/useLanguage";
import { openSupportCenter } from "@/lib/support-center";
import { IconBrandFacebook, IconBrandWhatsapp, IconBrandYoutube } from "@tabler/icons-react";
import {
  BadgePercent,
  BriefcaseBusiness,
  Calculator,
  CircleHelp,
  FileText,
  Headphones,
  House,
  LogIn,
  Mail,
  MapPin,
  Phone,
  Presentation,
  Scale,
  Store,
  Shield,
  ScrollText,
  UserRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type FooterLinkItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
  onClick?: () => void;
};

function FooterLinks({ items }: { items: FooterLinkItem[] }) {
  return (
    <ul className="space-y-2 text-[13px] font-medium text-white/90">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.label}>
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="inline-flex min-h-11 items-center gap-2 text-left transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:min-h-0"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                {item.label}
              </button>
            ) : item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:min-h-0"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href || "/"}
                className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:min-h-0"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function FacebookLink() {
  return (
    <a
      href={EBC_CONTACT.facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Econ Building Centre on Facebook"
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[11px] font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <IconBrandFacebook
        className="h-8 w-8 shrink-0 rounded-full bg-secondary p-2 text-primary"
        aria-hidden="true"
      />
      Econ Building Centre
    </a>
  );
}

function YoutubeLink() {
  return (
    <a
      href={EBC_CONTACT.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Econ Building Centre on YouTube"
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-[11px] font-medium text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <IconBrandYoutube
        className="h-8 w-8 shrink-0 rounded-full bg-secondary p-2 text-primary"
        aria-hidden="true"
      />
      YouTube
    </a>
  );
}

export function FooterSection() {
  const { t } = useLanguage();
  const whatsappUrl = getEbcWhatsappUrl(t("whatsapp_default_message"));

  const marketplaceLinks: FooterLinkItem[] = [
    { label: t("footer_ai_calculator"), href: "/calculator", icon: Calculator },
    {
      label: t("footer_compare_prices"),
      href: "/browse?type=PRODUCT",
      icon: Scale,
    },
    { label: t("footer_request_quote"), href: "/enquiry/create", icon: FileText },
    {
      label: t("footer_offers_zone"),
      href: "/conference-hall?tab=offers",
      icon: BadgePercent,
    },
    {
      label: t("footer_conference_hall"),
      href: "/conference-hall",
      icon: Presentation,
    },
    {
      label: t("footer_find_workers"),
      href: "/browse?type=SERVICE",
      icon: BriefcaseBusiness,
    },
  ];

  const stakeholderLinks: FooterLinkItem[] = [
    {
      label: t("footer_how_ebc_helps"),
      href: "/#how-ebc-helps",
      icon: House,
    },
    { label: t("footer_cost_guide"), href: "/calculator", icon: Calculator },
    { label: t("footer_faq_builders"), href: "/#faq", icon: CircleHelp },
    {
      label: t("footer_seller_professional_zone"),
      href: "/#ebc-ecosystem",
      icon: Store,
    },
  ];

  const supportLinks: FooterLinkItem[] = [
    { label: t("footer_how_works"), href: "/#how-it-works", icon: Workflow },
    {
      label: t("footer_contact_support"),
      onClick: openSupportCenter,
      icon: Headphones,
    },
    { label: t("footer_help_faq"), href: "/#faq", icon: CircleHelp },
    { label: t("footer_admin_login"), href: "/auth/admin-login", icon: LogIn },
  ];

  const legalLinks: FooterLinkItem[] = [
    { label: t("about_us"), href: "/about-us", icon: UserRound },
    { label: t("contact_us"), href: "/contact-us", icon: Headphones },
    { label: t("privacy_policy"), href: "/privacy-policy", icon: Shield },
    { label: t("cookie_policy"), href: "/cookie-policy", icon: Shield },
    { label: t("disclaimer"), href: "/disclaimer", icon: ScrollText },
    { label: t("faq_page"), href: "/faq", icon: CircleHelp },
    { label: t("how_ebc_works"), href: "/how-ebc-works", icon: Workflow },
    { label: t("refund_policy"), href: "/refund-policy", icon: FileText },
    {
      label: t("shipping_delivery_policy"),
      href: "/shipping-delivery-policy",
      icon: BriefcaseBusiness,
    },
    {
      label: t("terms_of_service"),
      href: "/terms-and-conditions",
      icon: ScrollText,
    },
  ];

  const brandContent = (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight lg:text-[28px]">
          {t("footer_brand")}
        </h2>
        <p className="max-w-sm text-[13px] font-medium leading-relaxed text-white/90">
          {t("footer_tagline")}
        </p>
      </div>
      <ul className="space-y-2">
        {[
          t("footer_features_1"),
          t("footer_features_2"),
          t("footer_features_3"),
          t("footer_features_4"),
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 text-[13px] font-semibold"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-secondary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="h-2.5 w-2.5 text-secondary"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-primary shadow-sm">
        <Scale className="h-[18px] w-[18px] shrink-0 text-secondary" />
        <span className="text-[11px] font-medium md:text-[12px]">
          {t("footer_experience")}
        </span>
      </div>
    </div>
  );

  return (
    <footer className="bg-primary pb-24 pt-10 text-white md:pb-6">
      <Container size="xl">
        <div className="hidden grid-cols-4 gap-8 px-2 lg:grid">
          {brandContent}
          <div className="space-y-4 pt-1">
            <h3 className="text-[17px] font-semibold">
              {t("footer_marketplace")}
            </h3>
            <FooterLinks items={marketplaceLinks} />
          </div>
          <div className="space-y-4 pt-1">
            <h3 className="text-[17px] font-semibold">
              {t("footer_stakeholder_zones")}
            </h3>
            <FooterLinks items={stakeholderLinks} />
          </div>
          <div className="space-y-4 pt-1">
            <h3 className="text-[17px] font-semibold">
              {t("footer_support_company")}
            </h3>
            <FooterLinks items={supportLinks} />
            <div className="pt-4">
              <FooterLinks items={legalLinks} />
            </div>
          </div>
        </div>

        <Accordion type="multiple" className="px-2 lg:hidden">
          <AccordionItem value="brand" className="border-white/20">
            <AccordionTrigger className="text-base font-semibold hover:no-underline [&_svg]:text-white/80">
              {t("footer_brand")}
            </AccordionTrigger>
            <AccordionContent>{brandContent}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="marketplace" className="border-white/20">
            <AccordionTrigger className="text-base font-semibold hover:no-underline [&_svg]:text-white/80">
              {t("footer_marketplace")}
            </AccordionTrigger>
            <AccordionContent>
              <FooterLinks items={marketplaceLinks} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stakeholders" className="border-white/20">
            <AccordionTrigger className="text-base font-semibold hover:no-underline [&_svg]:text-white/80">
              {t("footer_stakeholder_zones")}
            </AccordionTrigger>
            <AccordionContent>
              <FooterLinks items={stakeholderLinks} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support" className="border-white/20">
            <AccordionTrigger className="text-base font-semibold hover:no-underline [&_svg]:text-white/80">
              {t("footer_support_company")}
            </AccordionTrigger>
            <AccordionContent>
              <FooterLinks items={supportLinks} />
              <div className="pt-4">
                <FooterLinks items={legalLinks} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 grid gap-3 border-y border-white/20 py-5 sm:grid-cols-3">
          <Link
            href="/calculator"
            className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Calculator className="h-4 w-4" />
            {t("footer_estimate_cost")}
          </Link>
          <button
            type="button"
            onClick={openSupportCenter}
            className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 px-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Headphones className="h-4 w-4" />
            {t("footer_contact_support")}
          </button>
          <Link
            href="/browse?type=PRODUCT"
            className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 px-4 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Scale className="h-4 w-4" />
            {t("footer_compare_prices")}
          </Link>
        </div>

        <div className="flex items-center justify-start gap-3 overflow-x-auto px-2 py-6 text-[11px] font-medium text-white/90 lg:justify-center">
          <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap">
            <MapPin
              className="h-8 w-8 shrink-0 rounded-full bg-secondary p-2 text-primary"
              aria-hidden="true"
            />
            {EBC_CONTACT.address}
          </span>
          <a
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white"
            href={`tel:${EBC_CONTACT.phone.replace(/\s/g, "")}`}
          >
            <Phone
              className="h-8 w-8 shrink-0 rounded-full bg-secondary p-2 text-primary"
              aria-hidden="true"
            />
            {EBC_CONTACT.phone}
          </a>
          <a
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white"
            href={`mailto:${EBC_CONTACT.email}`}
          >
            <Mail
              className="h-8 w-8 shrink-0 rounded-full bg-secondary p-2 text-primary"
              aria-hidden="true"
            />
            {EBC_CONTACT.email}
          </a>
          <a
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandWhatsapp
              className="h-8 w-8 shrink-0 rounded-full bg-secondary p-2 text-primary"
              aria-hidden="true"
            />
            WhatsApp Help
          </a>
          <FacebookLink />
          <YoutubeLink />
        </div>

        <p className="mx-auto max-w-4xl px-2 pb-5 text-center text-[11px] font-medium text-white/90 md:text-[13px]">
          {t("footer_disclaimer")}
        </p>

        <div className="border-t border-white/20 px-2 pt-5">
          <div className="flex flex-col items-center gap-3 text-center text-[11px] font-medium text-white/90 md:text-[13px]">
            <p>{t("footer_serving")}</p>
            <LanguageSwitcher variant="footer" />
            <p>{t("footer_copyright")}</p>
            <p>{t("footer_designed_by")}</p>
          </div>
        </div>
      </Container>

      <nav
        aria-label="Mobile quick actions"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-primary/20 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] md:hidden"
      >
        <Link
          href="/calculator"
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-primary"
        >
          <Calculator className="h-5 w-5" />
          {t("footer_mobile_estimate")}
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-[#168a40]"
        >
          <IconBrandWhatsapp className="h-5 w-5" />
          WhatsApp
        </a>
        <Link
          href="/enquiry/create"
          className="flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-primary"
        >
          <FileText className="h-5 w-5" />
          RFQ
        </Link>
      </nav>
    </footer>
  );
}
